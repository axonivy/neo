import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { initTranslation } from '~/translation/translation';

vi.mock('zustand');

initTranslation();

afterEach(() => cleanup());
