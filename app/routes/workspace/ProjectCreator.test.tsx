import { nameChangeHandler } from './ProjectCreator';

test('projectdetails name handling', () => {
  expect(nameChangeHandler('M', '', '.')).toEqual('m');
  expect(nameChangeHandler('HALLO', 'HALL', '.')).toEqual('hallo');
  expect(nameChangeHandler('Mein-', 'mein', '.')).toEqual('mein.');
  expect(nameChangeHandler('P-r-o-j-E-K-T-', 'P-r-o-j-E-K-T--', '-')).toEqual('p-r-o-j-e-k-t-');
  expect(nameChangeHandler('PROJEKTNAME', '', '.')).toEqual('projektname');
  expect(nameChangeHandler('projektName', 'dontTouchIt', '.')).toEqual(undefined);
});
