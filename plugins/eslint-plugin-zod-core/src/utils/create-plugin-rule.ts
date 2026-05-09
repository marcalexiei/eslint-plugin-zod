import { ESLintUtils } from '@typescript-eslint/utils';

import { getRuleURL } from '../meta.js';

export const createZodPluginRule = ESLintUtils.RuleCreator(getRuleURL);
