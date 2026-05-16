import path from 'node:path';

import configBase from '@marcalexiei/eslint-config/base';
import configTS from '@marcalexiei/eslint-config/typescript';
import configVitest from '@marcalexiei/eslint-config/vitest';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import pluginEslintPlugin from 'eslint-plugin-eslint-plugin';
import pluginEslintNode from 'eslint-plugin-n';

export default defineConfig(
  includeIgnoreFile([path.resolve('.gitignore')]),
  {
    ...configBase,
    rules: {
      ...configBase.rules,
      'no-continue': 'off',
    },
  },
  {
    ...configTS,
    rules: {
      ...configTS.rules,
      '@typescript-eslint/naming-convention': [
        ...configTS.rules['@typescript-eslint/naming-convention'],
        // for rules listeners
        {
          selector: ['objectLiteralProperty', 'objectLiteralMethod'],
          format: ['camelCase', 'PascalCase'],
        },
        // path-like keys in config files (e.g. knip workspaces)
        {
          selector: 'objectLiteralProperty',
          modifiers: ['requiresQuotes'],
          format: null,
        },
      ],
    },
  },
  configVitest,
  {
    ...pluginEslintPlugin.configs.recommended,
    rules: {
      ...pluginEslintPlugin.configs.recommended.rules,
      // handled by typescript-eslint ESLintUtils.`RuleCreator`
      'eslint-plugin/require-meta-default-options': 'off',
    },
  },
  {
    ...pluginEslintNode.configs['flat/recommended-module'],
    rules: {
      ...pluginEslintNode.configs['flat/recommended-module'].rules,
      'n/no-missing-import': ['error', { ignoreTypeImport: true }],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.node.json',
          './plugins/*/tsconfig.json',
          './packages/*/tsconfig.json',
        ],
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          packageDir: [
            '.',
            './plugins/eslint-plugin-zod',
            './plugins/eslint-plugin-zod-mini',
            './packages/utils',
          ],
        },
      ],
    },
  },
);
