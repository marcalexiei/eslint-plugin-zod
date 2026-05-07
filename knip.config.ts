import type { KnipConfig } from 'knip';

export default {
  workspaces: {
    '.': {
      entry: [],
    },
    'plugins/eslint-plugin-zod': {
      entry: [
        'src/index.ts',
        '.eslint-doc-generatorrc.js',
      ],
    },
    'plugins/eslint-plugin-zod-mini': {
      entry: [
        'src/index.ts',
        '.eslint-doc-generatorrc.js',
      ],
    },
    'packages/utils': {
      entry: ['src/index.ts'],
    },
  },
} satisfies KnipConfig;
