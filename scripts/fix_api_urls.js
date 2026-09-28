const fs = require('fs');
const path = require('path');

const filesToFix = [
  '_astro/site-settings.CKBpDEDM.js',
  '_astro/NgcResultsShowcase.astro_astro_type_script_index_0_lang.BAW-JUi9.js',
  '_astro/http.BUnDBjdO.js',
  '_astro/bundle.ngc.js',
  '_astro/bundle.judge.js',
  '_astro/bundle.index.js'
];

for (const relPath of filesToFix) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    const beforeCount = (content.match(/https:\/\/api\.nwgn\.art/g) || []).length;
    if (beforeCount > 0) {
      content = content.replace(/https:\/\/api\.nwgn\.art/g, '');
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed ${beforeCount} occurrence(s) in ${relPath}`);
    } else {
      console.log(`No occurrences in ${relPath}`);
    }
  } else {
    console.warn(`File not found: ${relPath}`);
  }
}
