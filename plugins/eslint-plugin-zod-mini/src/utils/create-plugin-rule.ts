import type { ZodImportAllowedSource } from '@eslint-zod/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';


export type ZodMiniPluginRule = ESLintUtils.RuleWithMetaAndName<
  [],
  string,
  { zodImportAllowedSource: ZodImportAllowedSource }
>;

export const createZodMiniPluginRule = ESLintUtils.RuleCreator<{
  zodImportAllowedSource: 'all' | 'zod' | 'zod-mini';
}>(getRuleURL);
