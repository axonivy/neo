import { validateArtifactName, validateArtifactNamespace } from './validation';

test('valid artifact names', () => {
  const validNames = ['ValidName', 'M', 'M1', 'A_', 'A_b'];
  for (const name of validNames) {
    expect(validateArtifactName(name)).toBeUndefined();
  }
});

test('valid but ugly artifact names', () => {
  expect(validateArtifactName('makeWarning')).toEqual({ message: "It's recommended to capitalize the first letter", variant: 'warning' });
  expect(validateArtifactName('m')).toEqual({ message: "It's recommended to capitalize the first letter", variant: 'warning' });
});

test('invalid artifact names', () => {
  expect(validateArtifactName()).toEqual({ message: `Artifact name must not be empty.`, variant: 'error' });
  expect(validateArtifactName('')).toEqual({ message: `Artifact name must not be empty.`, variant: 'error' });
  expect(validateArtifactName('abstract')).toEqual({ message: `Input 'abstract' is a reserved keyword.`, variant: 'error' });
  expect(validateArtifactName('1First')).toEqual({ message: `Invalid character '1' at position 1 in '1First'.`, variant: 'error' });
  expect(validateArtifactName('Last-')).toEqual({ message: `Invalid character '-' at position 5 in 'Last-'.`, variant: 'error' });
  expect(validateArtifactName('em-bedded')).toEqual({ message: `Invalid character '-' at position 3 in 'em-bedded'.`, variant: 'error' });

  const invalidNames = [' ', ' SpacePrefix', 'SpaceSuffix ', 'Space Infix', '1', '-', '_', '_a'];
  for (const name of invalidNames) {
    expect(validateArtifactName(name)?.variant).toBe('error');
  }
});

test('valid dot separated namespaces', () => {
  const validNamespaces = ['ValidOne', 'othervalid', 'm', 'M', 'M1', 'A_', 'A_b', 'a.b', 'a.b.c_'];
  for (const namespace of validNamespaces) {
    expect(validateArtifactNamespace(namespace)).toBeUndefined();
  }
});

test('valid slash separated namespaces', () => {
  const validNamespaces = ['', undefined, 'ValidOne', 'othervalid', 'm', 'M', 'M1', 'A_', 'A_b', 'a/b', 'a/b/c_'];
  for (const namespace of validNamespaces) {
    expect(validateArtifactNamespace(namespace, 'Process')).toBeUndefined();
  }
});

test('invalid dot separated namespaces', () => {
  const invalidNamespaces = ['', undefined, ' ', '1', '-', '_', '_a', 'abc-abc', 'abc.', 'abc/', 'abc/abc'];
  for (const namespace of invalidNamespaces) {
    expect(validateArtifactNamespace(namespace)?.variant).toBe('error');
  }
});

test('invalid slash separated namespaces', () => {
  const invalidNamespaces = [' ', '1', '-', '_', '_a', 'abc-abc', 'abc.', 'abc/', 'abc.abc'];
  for (const namespace of invalidNamespaces) {
    expect(validateArtifactNamespace(namespace, 'Process')?.variant).toBe('error');
  }
});
