import { deTranslation as deCms, enTranslation as enCms } from '@axonivy/cms-editor';
import { deTranslation as deDataClass, enTranslation as enDataClass } from '@axonivy/dataclass-editor';
import { deMessages as deForm, enMessages as enForm } from '@axonivy/form-editor';
import deProcess from '@axonivy/process-editor/lib/translation/process-editor/de.json' with { type: 'json' };
import enProcess from '@axonivy/process-editor/lib/translation/process-editor/en.json' with { type: 'json' };
import { deTranslation as deVariable, enTranslation as enVariable } from '@axonivy/variable-editor';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import deNeo from '../app/translation/neo/de.json' with { type: 'json' };
import enNeo from '../app/translation/neo/en.json' with { type: 'json' };

const localsDir = path.resolve('./public/assets/locals/');

const collectTranslations = () => {
  const enDir = path.resolve(localsDir, 'en/');
  writeFile(enDir, 'cms-editor.json', enCms);
  writeFile(enDir, 'dataclass-editor.json', enDataClass);
  writeFile(enDir, 'process-editor.json', enProcess);
  writeFile(enDir, 'variable-editor.json', enVariable);
  writeFile(enDir, 'form-editor.json', enForm);
  writeFile(enDir, 'neo.json', enNeo);

  const deDir = path.resolve(localsDir, 'de/');
  writeFile(deDir, 'cms-editor.json', deCms);
  writeFile(deDir, 'dataclass-editor.json', deDataClass);
  writeFile(deDir, 'process-editor.json', deProcess);
  writeFile(deDir, 'variable-editor.json', deVariable);
  writeFile(deDir, 'form-editor.json', deForm);
  writeFile(deDir, 'neo.json', deNeo);
};

const writeFile = (dir: string, file: string, content: object) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.resolve(dir, file), JSON.stringify(content, null, 2), { encoding: 'utf-8' });
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
