import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import path from 'path';

const translations = {
  'cms-editor': path.resolve('./node_modules/@axonivy/cms-editor/src/translation/cms-editor'),
  'dataclass-editor': path.resolve('./node_modules/@axonivy/dataclass-editor/src/translation/dataclass-editor'),
  'variable-editor': path.resolve('./node_modules/@axonivy/variable-editor/src/translation/variable-editor'),
  'form-editor': path.resolve('./node_modules/@axonivy/form-editor/src/translation/form-editor'),
  'process-editor': path.resolve('./node_modules/@axonivy/process-editor/src/translation/process-editor'),
  'log-view': path.resolve('./node_modules/@axonivy/log-view/src/translation/log-view'),
  neo: path.resolve('./app/translation/neo/')
};

const localesDir = path.resolve('./public/assets/locales/');

const collectTranslations = () => {
  rmSync(localesDir, { force: true, recursive: true });
  Object.entries(translations).forEach(([targetFile, dir]) => copyLocales(dir, targetFile));
};

const copyLocales = (dir: string, targetFile: string) => {
  const files = readdirSync(dir);
  files.forEach(file => {
    if (file.includes('old')) return;
    const lng = file.replace('.json', '');
    const lngDir = path.resolve(localesDir, lng);
    copyFile(dir, lng, lngDir, `${targetFile}.json`);
  });
};

const copyFile = (srcDir: string, lng: string, targetDir: string, targetFile: string) => {
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(path.resolve(srcDir, `${lng}.json`), path.resolve(targetDir, targetFile));
};

type RecursiveValue = string | RecursiveRecord;
type RecursiveRecord = { [key: string]: RecursiveValue };

const updateKnownLanguages = () => {
  const metaFile = 'meta.json';
  const knownLanguages = readdirSync(localesDir).filter(file => file !== metaFile);
  const knownLanguagesFile = path.resolve(localesDir, metaFile);
  writeFileSync(knownLanguagesFile, JSON.stringify(knownLanguages));
};

collectTranslations();
updateKnownLanguages();
