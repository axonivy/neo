import { lastSegment, removeFirstSegmet } from './path';

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
