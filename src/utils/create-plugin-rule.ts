import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

import type { ZodImportAllowedSource } from './is-zod-import-source.js';

/**
 * Used by .eslint-doc-generatorrc.js
 * @lintignore
 */
export type ZodPluginRule = ESLintUtils.RuleWithMetaAndName<
  [],
  string,
  { zodImportAllowedSource: ZodImportAllowedSource }
>;

export const createZodPluginRule = ESLintUtils.RuleCreator<{
  zodImportAllowedSource: 'all' | 'zod' | 'zod-mini';
}>(getRuleURL);
