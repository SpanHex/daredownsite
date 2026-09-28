module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  },
  
  isAdmin: (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    if ((req.user?.role || '').toLowerCase() === 'admin') {
      return next();
    }
    res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
};
