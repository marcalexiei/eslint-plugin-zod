import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

export const createZodMiniPluginRule = ESLintUtils.RuleCreator(getRuleURL);
