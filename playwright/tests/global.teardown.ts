import { rm } from 'node:fs';

const teardown = async () => {
  rm('./neo-test-project/dataclasses/temp', { force: true, recursive: true }, () => {});
};

export default teardown;
