const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== STEP 1: Update _astro/bracket-data.js with site_settings.json data ===');
const siteSettingsRaw = fs.readFileSync('site_settings.json', 'utf8');
const bracketDataPath = path.join('_astro', 'bracket-data.js');
let bracketDataContent = fs.readFileSync(bracketDataPath, 'utf8');

const siteSettingsScript = `\nwindow.__SITE_SETTINGS = ${siteSettingsRaw.trim()};\n`;
if (!bracketDataContent.includes('window.__SITE_SETTINGS')) {
  bracketDataContent += siteSettingsScript;
  fs.writeFileSync(bracketDataPath, bracketDataContent, 'utf8');
  console.log('Added window.__SITE_SETTINGS to _astro/bracket-data.js');
} else {
  bracketDataContent = bracketDataContent.replace(/\nwindow\.__SITE_SETTINGS = [\s\S]*?;\n/, siteSettingsScript);
  fs.writeFileSync(bracketDataPath, bracketDataContent, 'utf8');
  console.log('Updated window.__SITE_SETTINGS in _astro/bracket-data.js');
}

console.log('=== STEP 2: Ensure site-settings.CKBpDEDM.js supports window.__SITE_SETTINGS fallback ===');
const siteSettingsModulePath = path.join('_astro', 'site-settings.CKBpDEDM.js');
let siteSettingsMod = fs.readFileSync(siteSettingsModulePath, 'utf8');

if (!siteSettingsMod.includes('window.__SITE_SETTINGS')) {
  const cacheReturnTarget = 'return!l(n)||!l(n.data)||typeof n.fetchedAt!="number"?null:{data:h(n.data),fetchedAt:n.fetchedAt}}catch{return null}}';
  const cacheReturnReplacement = 'return!l(n)||!l(n.data)||typeof n.fetchedAt!="number"?null:{data:h(n.data),fetchedAt:n.fetchedAt}}catch{return null}if(typeof window!="undefined"&&window.__SITE_SETTINGS)return{data:h(window.__SITE_SETTINGS),fetchedAt:Date.now()};return null}';
  if (siteSettingsMod.includes(cacheReturnTarget)) {
    siteSettingsMod = siteSettingsMod.replace(cacheReturnTarget, cacheReturnReplacement);
  }

  const fetchNotOkTarget = 'if(!c.ok){if(o)return u(o.data),{settings:o.data,fromCache:!0,fetchedAt:o.fetchedAt};throw new Error(`Failed to load site settings: ${c.status}`)}';
  const fetchNotOkReplacement = 'if(!c.ok){if(o)return u(o.data),{settings:o.data,fromCache:!0,fetchedAt:o.fetchedAt};if(typeof window!="undefined"&&window.__SITE_SETTINGS){const m=h(window.__SITE_SETTINGS);return u(m),{settings:m,fromCache:!0,fetchedAt:Date.now()}}throw new Error(`Failed to load site settings: ${c.status}`)}';
  if (siteSettingsMod.includes(fetchNotOkTarget)) {
    siteSettingsMod = siteSettingsMod.replace(fetchNotOkTarget, fetchNotOkReplacement);
  }

  const fetchCallTarget = 'const T=b(e.apiBaseUrl),c=await fetch(`${T}${n}`,{headers:{Accept:"application/json"},signal:e.signal});';
  const fetchCallReplacement = 'const T=b(e.apiBaseUrl);let c;try{c=await fetch(`${T}${n}`,{headers:{Accept:"application/json"},signal:e.signal});}catch(err){if(o)return u(o.data),{settings:o.data,fromCache:!0,fetchedAt:o.fetchedAt};if(typeof window!="undefined"&&window.__SITE_SETTINGS){const m=h(window.__SITE_SETTINGS);return u(m),{settings:m,fromCache:!0,fetchedAt:Date.now()}}throw err;}';
  if (siteSettingsMod.includes(fetchCallTarget)) {
    siteSettingsMod = siteSettingsMod.replace(fetchCallTarget, fetchCallReplacement);
  }

  fs.writeFileSync(siteSettingsModulePath, siteSettingsMod, 'utf8');
  console.log('Injected fallback into _astro/site-settings.CKBpDEDM.js');
}

console.log('=== STEP 3: Create temporary entry files and bundle with esbuild ===');
const entryIndex = path.join('_astro', '_entry_index.js');
fs.writeFileSync(entryIndex, `
import "./Winners.astro_astro_type_script_index_0_lang.9ape3wy-.js";
import "./Bracket.astro_astro_type_script_index_0_lang.By8uBWsx.js";
import "./Sponsors.astro_astro_type_script_index_0_lang.kMc95YVg.js";
import "./About.astro_astro_type_script_index_0_lang.DRiQXxsm.js";
import "./Rounds.astro_astro_type_script_index_0_lang.DyZ9KqsY.js";
import "./SpecialThanks.astro_astro_type_script_index_0_lang.C9B1wXl3.js";
import "./VsScreenModal.astro_astro_type_script_index_0_lang.BXoPRkcZ.js";
import "./index.astro_astro_type_script_index_0_lang.Cv9zphZG.js";
`, 'utf8');

const entryNgc = path.join('_astro', '_entry_ngc.js');
fs.writeFileSync(entryNgc, `
import "./NgcResultsShowcase.astro_astro_type_script_index_0_lang.BAW-JUi9.js";
import "./ngc.astro_astro_type_script_index_0_lang.Lo47_M4U.js";
`, 'utf8');

const entryJudge = path.join('_astro', '_entry_judge.js');
fs.writeFileSync(entryJudge, `
import "./judge.astro_astro_type_script_index_0_lang.CaRAhbzU.js";
`, 'utf8');

const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: [entryIndex],
  bundle: true,
  format: 'iife',
  outfile: '_astro/bundle.index.js',
  logLevel: 'warning'
});
esbuild.buildSync({
  entryPoints: [entryNgc],
  bundle: true,
  format: 'iife',
  outfile: '_astro/bundle.ngc.js',
  logLevel: 'warning'
});
esbuild.buildSync({
  entryPoints: [entryJudge],
  bundle: true,
  format: 'iife',
  outfile: '_astro/bundle.judge.js',
  logLevel: 'warning'
});

fs.unlinkSync(entryIndex);
fs.unlinkSync(entryNgc);
fs.unlinkSync(entryJudge);

console.log('=== STEP 4: Ensure @ and %40 encoded CSS filenames both exist on disk ===');
if (fs.existsSync(path.join('_astro', 'index@_@astro.D4QzF_Pf.css'))) {
  fs.copyFileSync(
    path.join('_astro', 'index@_@astro.D4QzF_Pf.css'),
    path.join('_astro', 'index%40_%40astro.D4QzF_Pf.css')
  );
  console.log('Synchronized index%40_%40astro.D4QzF_Pf.css');
}
if (fs.existsSync(path.join('_astro', 'ngc@_@astro.DyPrpO0Q.css'))) {
  fs.copyFileSync(
    path.join('_astro', 'ngc@_@astro.DyPrpO0Q.css'),
    path.join('_astro', 'ngc%40_%40astro.DyPrpO0Q.css')
  );
  console.log('Synchronized ngc%40_%40astro.DyPrpO0Q.css');
}

console.log('=== STEP 5: Update HTML files to use classic scripts and absolute paths ===');

function normalizeHtmlAssets(html) {
  return html
    .replace(/(?:href|src)="(?:\.\.\/)*theme\.css"/g, 'href="/theme.css"')
    .replace(/(?:href|src)="(?:\.\.\/)*_astro\/Layout\.BHgu_56x\.css"/g, 'href="/_astro/Layout.BHgu_56x.css"')
    .replace(/(?:href|src)="(?:\.\.\/)*_astro\/index%40_%40astro\.D4QzF_Pf\.css"/g, 'href="/_astro/index%40_%40astro.D4QzF_Pf.css"')
    .replace(/(?:href|src)="(?:\.\.\/)*_astro\/index@_@astro\.D4QzF_Pf\.css"/g, 'href="/_astro/index%40_%40astro.D4QzF_Pf.css"')
    .replace(/(?:href|src)="(?:\.\.\/)*favicon\.png"/g, 'href="/favicon.png"')
    .replace(/(?:href|src)="(?:\.\.\/)*footer_newgen\.svg"/g, 'src="/footer_newgen.svg"')
    .replace(/content="(?:\.\.\/)*meta_img\.jpg"/g, 'content="/meta_img.jpg"')
    .replace(/(?:href|src)="(?:\.\.\/)*auth-client\.js"/g, 'src="/auth-client.js"')
    .replace(/(?:href|src)="(?:\.\.\/)*_astro\/bracket-data\.js"/g, 'src="/_astro/bracket-data.js"')
    .replace(/(?:href|src)="(?:\.\.\/)*_astro\/bundle\.([a-z]+)\.js"/g, 'src="/_astro/bundle.$1.js"')
    .replace(/index\.html#bracker/g, 'index.html#bracket');
}

// --- index.html ---
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/Winners\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/Bracket\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/Sponsors\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/About\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/Rounds\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/SpecialThanks\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/VsScreenModal\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
indexHtml = indexHtml.replace(/<script type="module" src="_astro\/index\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');

if (!indexHtml.includes('/_astro/bracket-data.js') && !indexHtml.includes('_astro/bracket-data.js')) {
  indexHtml = indexHtml.replace('</head>', '<script src="/_astro/bracket-data.js"></script></head>');
}
if (!indexHtml.includes('/_astro/bundle.index.js') && !indexHtml.includes('_astro/bundle.index.js')) {
  indexHtml = indexHtml.replace('</main>', '<script src="/_astro/bundle.index.js"></script></main>');
}
indexHtml = normalizeHtmlAssets(indexHtml);
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html to use absolute paths');

// --- ngc/index.html ---
let ngcHtml = fs.readFileSync(path.join('ngc', 'index.html'), 'utf8');
ngcHtml = ngcHtml.replace(/<script type="module" src="(?:\.\.\/)?_astro\/NgcResultsShowcase\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');
ngcHtml = ngcHtml.replace(/<script type="module" src="(?:\.\.\/)?_astro\/ngc\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');

if (!ngcHtml.includes('bracket-data.js')) {
  ngcHtml = ngcHtml.replace('</head>', '<script src="/_astro/bracket-data.js"></script></head>');
}
if (!ngcHtml.includes('bundle.ngc.js')) {
  if (ngcHtml.includes('</main>')) {
    ngcHtml = ngcHtml.replace('</main>', '<script src="/_astro/bundle.ngc.js"></script></main>');
  } else if (ngcHtml.includes('</body>')) {
    ngcHtml = ngcHtml.replace('</body>', '<script src="/_astro/bundle.ngc.js"></script></body>');
  }
}
ngcHtml = normalizeHtmlAssets(ngcHtml);
fs.writeFileSync(path.join('ngc', 'index.html'), ngcHtml, 'utf8');
console.log('Updated ngc/index.html to use absolute paths');

// --- judge/index.html ---
let judgeHtml = fs.readFileSync(path.join('judge', 'index.html'), 'utf8');
judgeHtml = judgeHtml.replace(/<script type="module" src="(?:\.\.\/)?_astro\/judge\.astro_astro_type_script_index_0_lang\.[^"]+"><\/script>/g, '');

if (!judgeHtml.includes('bracket-data.js')) {
  judgeHtml = judgeHtml.replace('</head>', '<script src="/_astro/bracket-data.js"></script></head>');
}
if (!judgeHtml.includes('bundle.judge.js')) {
  if (judgeHtml.includes('</main>')) {
    judgeHtml = judgeHtml.replace('</main>', '<script src="/_astro/bundle.judge.js"></script></main>');
  } else if (judgeHtml.includes('</body>')) {
    judgeHtml = judgeHtml.replace('</body>', '<script src="/_astro/bundle.judge.js"></script></body>');
  }
}
judgeHtml = normalizeHtmlAssets(judgeHtml);
fs.writeFileSync(path.join('judge', 'index.html'), judgeHtml, 'utf8');
console.log('Updated judge/index.html to use absolute paths');

// --- rules/index.html ---
let rulesHtml = fs.readFileSync(path.join('rules', 'index.html'), 'utf8');
rulesHtml = normalizeHtmlAssets(rulesHtml);
fs.writeFileSync(path.join('rules', 'index.html'), rulesHtml, 'utf8');
console.log('Updated rules/index.html to use absolute paths');

// --- profile/index.html ---
let profileHtml = fs.readFileSync(path.join('profile', 'index.html'), 'utf8');
profileHtml = normalizeHtmlAssets(profileHtml);
fs.writeFileSync(path.join('profile', 'index.html'), profileHtml, 'utf8');
console.log('Updated profile/index.html to use absolute paths');

// --- admin/index.html ---
let adminHtml = fs.readFileSync(path.join('admin', 'index.html'), 'utf8');
adminHtml = normalizeHtmlAssets(adminHtml);
fs.writeFileSync(path.join('admin', 'index.html'), adminHtml, 'utf8');
console.log('Updated admin/index.html to use absolute paths');

// --- register/index.html ---
let registerHtml = fs.readFileSync(path.join('register', 'index.html'), 'utf8');
registerHtml = normalizeHtmlAssets(registerHtml);
fs.writeFileSync(path.join('register', 'index.html'), registerHtml, 'utf8');
console.log('Updated register/index.html to use absolute paths');

console.log('=== STEP 6: Populate dist/ and public/ build output directories ===');

const outputDirs = ['dist', 'public'];

outputDirs.forEach(outDir => {
  const targetDir = path.resolve(outDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy folders
  const foldersToCopy = [
    '_astro',
    'admin',
    'rules',
    'ngc',
    'judge',
    'profile',
    'register',
    'avatars',
    'sponsors',
    'logos',
    'videos'
  ];

  foldersToCopy.forEach(folder => {
    if (fs.existsSync(folder)) {
      const dest = path.join(targetDir, folder);
      fs.cpSync(folder, dest, { recursive: true });
      console.log(`Copied ${folder} -> ${outDir}/${folder}`);
    }
  });

  // Copy root static files
  const filesToCopy = [
    'index.html',
    'theme.css',
    'favicon.png',
    'footer_newgen.svg',
    'meta_img.jpg',
    'auth-client.js',
    'background.mp4',
    'site_settings.json',
    'bracket_data.json',
    'rendered_bracket.html'
  ];

  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      const dest = path.join(targetDir, file);
      fs.copyFileSync(file, dest);
      console.log(`Copied ${file} -> ${outDir}/${file}`);
    }
  });
});

console.log('=== All files updated and build output directories generated successfully! ===');

