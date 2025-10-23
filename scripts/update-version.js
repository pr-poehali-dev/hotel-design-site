import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(
  await import('fs').then(fs => 
    fs.promises.readFile(join(__dirname, '../package.json'), 'utf-8')
  )
);

const version = packageJson.version || '1.0.0';
const buildDate = new Date().toISOString().split('T')[0];

const versionData = {
  version: version,
  buildDate: buildDate
};

const versionPath = join(__dirname, '../public/version.json');
writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

console.log(`✅ Version updated: ${version} (${buildDate})`);
