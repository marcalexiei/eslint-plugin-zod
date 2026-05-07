import type { ZodImportAllowedSource } from '@eslint-zod/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

export type ZodPluginRule = ESLintUtils.RuleWithMetaAndName<
  [],
  string,
  { zodImportAllowedSource: ZodImportAllowedSource }
>;

export const createZodPluginRule = ESLintUtils.RuleCreator<{
  zodImportAllowedSource: ZodImportAllowedSource;
}>(getRuleURL);
