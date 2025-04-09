import { deCommonTranslation as deCommonCms, enCommonTranslation as enCommonCms } from '@axonivy/cms-editor';
import { deCommonTranslation as deCommonDataClass, enCommonTranslation as enCommonDataClass } from '@axonivy/dataclass-editor';
import { deCommonMessages as deCommonForm, enCommonMessages as enCommonForm } from '@axonivy/form-editor';
import { deCommonTranslation as deCommonVariable, enCommonTranslation as enCommonVariable } from '@axonivy/variable-editor';
import deCommonNeo from './common/de.json';
import enCommonNeo from './common/en.json';

const additionalTranslations = [
  { de: deCommonNeo, en: enCommonNeo },
  { de: deCommonVariable, en: enCommonVariable },
  { de: deCommonCms, en: enCommonCms },
  { de: deCommonDataClass, en: enCommonDataClass },
  { de: deCommonForm, en: enCommonForm }
];

export const getCommonTranslations = () => {
  const deCommon = {};
  const enCommon = {};

  for (const { de, en } of additionalTranslations) {
    deepMerge(deCommon, de);
    deepMerge(enCommon, en);
  }

  return {
    en: enCommon,
    de: deCommon
  };
};

type RecursiveValue = string | RecursiveRecord;
export type RecursiveRecord = { [key: string]: RecursiveValue };

const isRecord = (value: unknown): value is RecursiveRecord => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

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
};
