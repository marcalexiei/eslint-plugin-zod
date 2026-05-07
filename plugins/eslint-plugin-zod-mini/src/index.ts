import type { ESLint, Rule } from 'eslint';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';

const eslintPluginZodMini = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  rules: {} as unknown as Record<string, Rule.RuleModule>,
} satisfies ESLint.Plugin;

export default {
  ...eslintPluginZodMini,
  configs: {},
} satisfies ESLint.Plugin;
