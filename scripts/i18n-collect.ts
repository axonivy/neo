import { copyFileSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';

const translations = {
  'cms-editor': path.resolve('./node_modules/@axonivy/cms-editor/src/translation/cms-editor'),
  'dataclass-editor': path.resolve('./node_modules/@axonivy/dataclass-editor/src/translation/dataclass-editor'),
  'variable-editor': path.resolve('./node_modules/@axonivy/variable-editor/src/translation/variable-editor'),
  'form-editor': path.resolve('./node_modules/@axonivy/form-editor/src/translation/form-editor'),
  'process-editor': path.resolve('./node_modules/@axonivy/process-editor/src/translation/process-editor'),
  neo: path.resolve('./app/translation/neo/')
};

const localsDir = path.resolve('./public/assets/locals/');

const collectTranslations = () => {
  Object.entries(translations).forEach(([targetFile, dir]) => scanDir(dir, targetFile));
};

const scanDir = (dir: string, targetFile: string) => {
  const files = readdirSync(dir);
  for (const file of files) {
    const lng = file.replace('.json', '');
    const lngDir = path.resolve(localsDir, lng);
    copyFile(dir, lng, lngDir, `${targetFile}.json`);
  }
};

const copyFile = (srcDir: string, lng: string, targetDir: string, targetFile: string) => {
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(path.resolve(srcDir, `${lng}.json`), path.resolve(targetDir, targetFile));
};

type RecursiveValue = string | RecursiveRecord;
type RecursiveRecord = { [key: string]: RecursiveValue };

const updateKnownLanguages = () => {
  const metaFile = 'meta.json';
  const knownLanguages = readdirSync(localsDir).filter(file => file !== metaFile);
  const knownLanguagesFile = path.resolve(localsDir, metaFile);
  writeFileSync(knownLanguagesFile, JSON.stringify(knownLanguages));
};

collectTranslations();
updateKnownLanguages();
