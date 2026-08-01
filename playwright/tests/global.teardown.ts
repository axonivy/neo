import { rm } from 'node:fs';

const teardown = async () => {
  rm('./neo-test-project/dataclass/temp', { force: true, recursive: true }, () => {});
};

export default teardown;
