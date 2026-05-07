import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

export const createZodMiniPluginRule = ESLintUtils.RuleCreator<{
  zodImportAllowedSource: 'all' | 'zod' | 'zod-mini';
}>(getRuleURL);
