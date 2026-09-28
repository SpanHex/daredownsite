const UAParser = require('ua-parser-js');
const SecurityEvent = require('../models/SecurityEvent');

/**
 * Normalizes IP addresses:
 * - Strips IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 -> 1.2.3.4)
 * - Trims whitespace
 */
/**
 * Normalizes IP addresses:
 * - Strips IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 -> 1.2.3.4)
 * - Trims whitespace
 */
function safeTrim(val) {
  if (!val) return '';
  if (Array.isArray(val)) return String(val[0] || '').trim();
  return String(val).trim();
}

/**
 * Normalizes IP addresses:
 * - Strips IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 -> 1.2.3.4)
 * - Trims whitespace
 */
function normalizeIp(ip) {
  if (!ip) return null;
  let clean = safeTrim(ip);
  if (clean.startsWith('::ffff:')) {
    clean = clean.slice(7);
  }
  return clean || null;
}

/**
 * Checks if a string is an IPv4 address.
 */
function isIPv4(ip) {
  if (!ip) return false;
  const clean = safeTrim(ip);
  if (clean === '127.0.0.1') return true;
  return /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(clean);
}

/**
 * Checks if a string is an IPv6 address.
 */
function isIPv6(ip) {
  if (!ip) return false;
  const clean = safeTrim(ip);
  if (clean === '::1' || clean.includes(':')) return true;
  return false;
}

/**
 * Extracts and classifies IPv4 and IPv6 addresses from the incoming request.
 *
 * PRODUCTION (Vercel / Reverse Proxies):
 * - Uses server-observed headers: x-vercel-forwarded-for, x-real-ip, x-forwarded-for, or req.ip.
 * - Captures actual client IPv4 or IPv6.
 * - Stores null for the address family genuinely not used by the client connection.
 *
 * LOCALHOST:
 * - IPv6 connection (e.g. ::1) -> IPv6: '::1', IPv4: null.
 * - IPv4 connection (e.g. 127.0.0.1) -> IPv4: '127.0.0.1', IPv6: null.
 * - Neither family is fabricated.
 */
function extractAndClassifyIp(req) {
  let clientRaw = null;

  const vercelHeader = req.headers ? req.headers['x-vercel-forwarded-for'] : null;
  const realIpHeader = req.headers ? req.headers['x-real-ip'] : null;
  const forwardedHeader = req.headers ? req.headers['x-forwarded-for'] : null;

  if (vercelHeader) {
    clientRaw = safeTrim(vercelHeader).split(',')[0].trim();
  } else if (realIpHeader) {
    clientRaw = safeTrim(realIpHeader);
  } else if (forwardedHeader) {
    clientRaw = safeTrim(forwardedHeader).split(',')[0].trim();
  } else if (req.ip) {
    clientRaw = safeTrim(req.ip);
  } else if (req.socket?.remoteAddress) {
    clientRaw = safeTrim(req.socket.remoteAddress);
  }

  const clientIp = normalizeIp(clientRaw) || 'unknown';

  let ipv4 = null;
  let ipv6 = null;

  if (isIPv4(clientIp)) {
    ipv4 = clientIp;
  } else if (isIPv6(clientIp)) {
    ipv6 = clientIp;
  }

  // Check multi-family proxy chain if present
  if (vercelHeader || forwardedHeader) {
    const rawChain = [
      ...(vercelHeader ? safeTrim(vercelHeader).split(',') : []),
      ...(forwardedHeader ? safeTrim(forwardedHeader).split(',') : [])
    ];

    for (const item of rawChain) {
      const normalized = normalizeIp(item);
      if (normalized) {
        if (!ipv4 && isIPv4(normalized)) {
          ipv4 = normalized;
        }
        if (!ipv6 && isIPv6(normalized)) {
          ipv6 = normalized;
        }
      }
      if (ipv4 && ipv6) break;
    }
  }

  return {
    primaryIp: clientIp,
    ipv4,
    ipv6
  };
}

/**
 * Logs a security/audit event to MongoDB.
 */
const logSecurityEvent = async (
  req, eventType, success,
  failureReason = null, userId = null,
  usernameAttempt = null, authProvider = 'local'
) => {
  try {
    const { primaryIp, ipv4, ipv6 } = extractAndClassifyIp(req);

    const uaString = req.headers ? (req.headers['user-agent'] || '') : '';
    const parser = new UAParser(uaString);
    const result = parser.getResult();

    const browserName = result.browser?.name || (uaString ? 'Unknown' : 'None');
    const browserVersion = result.browser?.version || null;
    const osName = result.os?.name || (uaString ? 'Unknown' : 'None');
    const osVersion = result.os?.version || null;
    const deviceType = result.device?.type || (result.os?.name ? 'desktop' : 'Unknown');
    const deviceModel = result.device?.model || null;

    return await SecurityEvent.create({
      userId,
      usernameAttempt,
      eventType,
      success,
      failureReason,
      authProvider,
      ipAddress: primaryIp || 'unknown',
      ipv4: ipv4 || null,
      ipv6: ipv6 || null,
      userAgent: typeof uaString === 'string' ? uaString.substring(0, 512) : '',
      browser: browserName,
      browserVersion: browserVersion,
      os: osName,
      osVersion: osVersion,
      deviceType: deviceType,
      deviceModel: deviceModel
    });
  } catch (error) {
    console.error('Failed to log security event:', error.message);
    return null;
  }
};

module.exports = logSecurityEvent;

