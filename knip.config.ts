import type { KnipConfig } from 'knip';

export default {
  tags: ['-lintignore'],
  ignore: [
    '.eslint-doc-generatorrc.js', // Executed by `eslint-doc-generator`
  ],
} satisfies KnipConfig;
