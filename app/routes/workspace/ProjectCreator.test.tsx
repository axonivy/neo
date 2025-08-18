import { NameChangeHandler } from './ProjectCreator';

test('projectdetails name handling', () => {
  expect(NameChangeHandler('M', '', '.')).toEqual('m');
  expect(NameChangeHandler('HALLO', 'HALL', '.')).toEqual('hallo');
  expect(NameChangeHandler('Mein-', 'mein', '.')).toEqual('mein.');
  expect(NameChangeHandler('P-r-o-j-E-K-T-', 'P-r-o-j-E-K-T--', '-')).toEqual('p-r-o-j-e-k-t-');
  expect(NameChangeHandler('PROJEKTNAME', '', '.')).toEqual('projektname');
  expect(NameChangeHandler('projektName', 'dontTouchIt', '.')).toEqual(undefined);
});
