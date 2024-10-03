import { lastSegment, removeFirstSegmet, removeStartSegmets } from './path';

test('lastSegmet', () => {
  expect(lastSegment('')).toEqual('');
  expect(lastSegment('test')).toEqual('test');
  expect(lastSegment('/test')).toEqual('test');
  expect(lastSegment('src_hd/form/test/project/test/test')).toEqual('test');
});

test('removeFirstSegmet', () => {
  expect(removeFirstSegmet('')).toEqual('');
  expect(removeFirstSegmet('test')).toEqual('test');
  expect(removeFirstSegmet('/test')).toEqual('test');
  expect(removeFirstSegmet('src_hd/form/test/project/test/test')).toEqual('form/test/project/test/test');
  expect(removeFirstSegmet('/src_hd/form/test/project/test/test')).toEqual('form/test/project/test/test');
});

test('removeStartSegmets', () => {
  expect(removeStartSegmets('', 2)).toEqual('');
  expect(removeStartSegmets('test', 3)).toEqual('test');
  expect(removeStartSegmets('/test', 3)).toEqual('test');
  expect(removeStartSegmets('src_hd/form/test/project/test/test', 3)).toEqual('project/test/test');
  expect(removeStartSegmets('/src_hd/form/test/project/test/test', 2)).toEqual('test/project/test/test');
});
