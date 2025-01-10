import type { MessageData } from '@axonivy/ui-components';
import type { NewArtifactType } from './useNewArtifact';

export const artifactAlreadyExists = (name: string): MessageData => ({ message: `Artifact ${name} already exists.`, variant: 'error' });

export const validateArtifactName = (name?: string): MessageData | undefined => {
  if (!name) {
    return { message: `Artifact name must not be empty.`, variant: 'error' };
  }
  const message = reservedCheck(name);
  if (message) {
    return message;
  }
  if (!ARTIFACT_NAME_REGEX.test(name)) {
    const index = findFirstNonMatchingIndex(name, ARTIFACT_NAME_REGEX);
    return { message: `Invalid character '${name[index]}' at position ${index + 1} in '${name}'.`, variant: 'error' };
  }
  if (startsWithLowercase(name)) {
    return { message: "It's recommended to capitalize the first letter.", variant: 'warning' };
  }
};

export const validateArtifactNamespace = (namespace?: string, type?: NewArtifactType): MessageData | undefined => {
  if (!namespace) {
    return type === 'Process' ? undefined : { message: `Artifact namespace must not be empty.`, variant: 'error' };
  }
  const separator = type === 'Process' ? '/' : '.';
  for (const segment of namespace.split(separator)) {
    const message = reservedCheck(segment);
    if (message) {
      return message;
    }
  }
  const nsRegex = namespaceRegex(separator);
  if (!nsRegex.test(namespace)) {
    const index = findFirstNonMatchingIndex(namespace, nsRegex);
    return { message: `Invalid character '${namespace[index]}' at position ${index + 1} in '${namespace}'.`, variant: 'error' };
  }
};

const reservedCheck = (input: string): MessageData | undefined => {
  if (JAVA_KEYWORDS.includes(input)) {
    return { message: `Input '${input}' is a reserved keyword.`, variant: 'error' };
  }
};

const startsWithLowercase = (input: string): boolean => {
  return /^[a-z]/.test(input);
};

const findFirstNonMatchingIndex = (input: string, regex: RegExp) => {
  for (let i = 0; i < input.length; i++) {
    const subsstr = input.substring(0, i + 1);
    if (!regex.test(subsstr)) {
      return i;
    }
  }
  return -1;
};

const ARTIFACT_NAME_REGEX = /^[a-zA-Z][\w_]*$/;
const namespaceRegex = (separator: string) => new RegExp(`^[a-zA-Z][\\w_]*(\\${separator}[a-zA-Z][\\w_]*)*$`);

const JAVA_KEYWORDS = [
  'abstract',
  'continue',
  'for',
  'new',
  'switch',
  'assert',
  'default',
  'goto',
  'package',
  'synchronized',
  'boolean',
  'do',
  'if',
  'private',
  'this',
  'break',
  'double',
  'implements',
  'protected',
  'throw',
  'byte',
  'else',
  'import',
  'public',
  'throws',
  'case',
  'enum',
  'instanceof',
  'return',
  'transient',
  'catch',
  'extends',
  'int',
  'short',
  'try',
  'char',
  'final',
  'interface',
  'static',
  'void',
  'class',
  'finally',
  'long',
  'strictfp',
  'volatile',
  'const',
  'float',
  'native',
  'super',
  'while'
];
