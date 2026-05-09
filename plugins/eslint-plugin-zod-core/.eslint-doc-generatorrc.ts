import prettierConfig from '@marcalexiei/prettier-config';
import type { GenerateOptions } from 'eslint-doc-generator';
import * as prettier from 'prettier';

export default {
  postprocess: (content): Promise<string> =>
    prettier.format(content, {
      parser: 'markdown',
      ...prettierConfig,
    }),
} satisfies GenerateOptions;
