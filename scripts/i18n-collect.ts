import {
  deTranslation as deCms,
  deCommonTranslation as deCommonCms,
  enTranslation as enCms,
  enCommonTranslation as enCommonCms
} from '@axonivy/cms-editor';
import {
  deCommonTranslation as deCommonDataClass,
  deTranslation as deDataClass,
  enCommonTranslation as enCommonDataClass,
  enTranslation as enDataClass
} from '@axonivy/dataclass-editor';
import deCommonProcess from '@axonivy/process-editor/lib/translation/common/de.json' with { type: 'json' };
import enCommonProcess from '@axonivy/process-editor/lib/translation/common/en.json' with { type: 'json' };
import deProcess from '@axonivy/process-editor/lib/translation/process-editor/de.json' with { type: 'json' };
import enProcess from '@axonivy/process-editor/lib/translation/process-editor/en.json' with { type: 'json' };
import {
  deCommonTranslation as deCommonVariable,
  deTranslation as deVariable,
  enCommonTranslation as enCommonVariable,
  enTranslation as enVariable
} from '@axonivy/variable-editor';
import { mkdirSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import deCommonNeo from '../app/translation/common/de.json' with { type: 'json' };
import enCommonNeo from '../app/translation/common/en.json' with { type: 'json' };
import deNeo from '../app/translation/neo/de.json' with { type: 'json' };
import enNeo from '../app/translation/neo/en.json' with { type: 'json' };

const enCommonCollection = [enCommonNeo, enCommonVariable, enCommonCms, enCommonDataClass, enCommonProcess];
const deCommonCollection = [deCommonNeo, deCommonVariable, deCommonCms, deCommonDataClass, deCommonProcess];

const localsDir = path.resolve('./public/assets/locals/');

const collectTranslations = () => {
  const enCommon = enCommonCollection.reduce<RecursiveRecord>((acc, curr) => deepMerge(acc, curr), {});
  const deCommon = deCommonCollection.reduce<RecursiveRecord>((acc, curr) => deepMerge(acc, curr), {});

  const enDir = path.resolve(localsDir, 'en/');
  writeFile(enDir, 'common.json', enCommon);
  writeFile(enDir, 'cms-editor.json', enCms);
  writeFile(enDir, 'dataclass-editor.json', enDataClass);
  writeFile(enDir, 'process-editor.json', enProcess);
  writeFile(enDir, 'variable-editor.json', enVariable);
  writeFile(enDir, 'neo.json', enNeo);

  const deDir = path.resolve(localsDir, 'de/');
  writeFile(deDir, 'common.json', deCommon);
  writeFile(deDir, 'cms-editor.json', deCms);
  writeFile(deDir, 'dataclass-editor.json', deDataClass);
  writeFile(deDir, 'process-editor.json', deProcess);
  writeFile(deDir, 'variable-editor.json', deVariable);
  writeFile(deDir, 'neo.json', deNeo);
};

const writeFile = (dir: string, file: string, content: object) => {
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.resolve(dir, file), JSON.stringify(content, null, 2), { encoding: 'utf-8' });
};

type RecursiveValue = string | RecursiveRecord;
type RecursiveRecord = { [key: string]: RecursiveValue };

const isRecord = (value: unknown): value is RecursiveRecord => typeof value === 'object' && value !== null && !Array.isArray(value);

const deepMerge = (target: RecursiveRecord, source: RecursiveRecord) => {
  for (const key in source) {
    const val1 = target[key];
    const val2 = source[key];

    if (isRecord(val1) && isRecord(val2)) {
      deepMerge(val1, val2);
    } else {
      target[key] = val2;
    }
  }
  return target;
};

const updateKnownLanguages = () => {
  const metaFile = 'meta.json';
  const knownLanguages = readdirSync(localsDir).filter(file => file !== metaFile);
  const knownLanguagesFile = path.resolve(localsDir, metaFile);
  writeFileSync(knownLanguagesFile, JSON.stringify(knownLanguages));
};

collectTranslations();
updateKnownLanguages();
