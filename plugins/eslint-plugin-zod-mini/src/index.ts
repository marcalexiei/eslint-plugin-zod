import type { ESLint, Linter, Rule } from 'eslint';

import { PLUGIN_NAME, PLUGIN_VERSION } from './meta.js';
import { consistentImportSource } from './rules/consistent-import-source.js';
import { consistentImport } from './rules/consistent-import.js';
import { consistentObjectSchemaType } from './rules/consistent-object-schema-type.js';
import { consistentSchemaOutputTypeStyle } from './rules/consistent-schema-output-type-style.js';
import { consistentSchemaVarName } from './rules/consistent-schema-var-name.js';
import { noAnySchema } from './rules/no-any-schema.js';
import { noEmptyCustomSchema } from './rules/no-empty-custom-schema.js';
import { noUnknownSchema } from './rules/no-unknown-schema.js';
import { preferMeta } from './rules/prefer-meta.js';
import { preferNamespaceImport } from './rules/prefer-namespace-import.js';
import { requireBrandTypeParameter } from './rules/require-brand-type-parameter.js';
import { requireErrorMessage } from './rules/require-error-message.js';
import { requireSchemaSuffix } from './rules/require-schema-suffix.js';
import { schemaErrorPropertyStyle } from './rules/schema-error-property-style.js';

interface CompatibleConfig {
  name?: string;
  rules?: object;
  plugins?: Record<string, CompatiblePlugin>;
}

interface CompatiblePlugin {
  meta: {
    name: string;
    version: string;
  };
}

const eslintPluginZodMini = {
  meta: {
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
  },
  rules: {
    'consistent-import': consistentImport,
    'consistent-import-source': consistentImportSource,
    'consistent-object-schema-type': consistentObjectSchemaType,
    'consistent-schema-output-type-style': consistentSchemaOutputTypeStyle,
    'consistent-schema-var-name': consistentSchemaVarName,
    'no-any-schema': noAnySchema,
    'no-empty-custom-schema': noEmptyCustomSchema,
    'no-unknown-schema': noUnknownSchema,
    'prefer-meta': preferMeta,
    'prefer-namespace-import': preferNamespaceImport,
    'require-brand-type-parameter': requireBrandTypeParameter,
    'require-error-message': requireErrorMessage,
    'require-schema-suffix': requireSchemaSuffix,
    'schema-error-property-style': schemaErrorPropertyStyle,
  } as unknown as Record<string, Rule.RuleModule>,
} satisfies ESLint.Plugin as CompatiblePlugin;

const baseConfig = {
  name: `${PLUGIN_NAME}/recommended`,
  files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
  plugins: {
    'zod-mini': eslintPluginZodMini,
  },
};

const recommendedConfig = {
  ...baseConfig,
  rules: {

    'zod-mini/consistent-import': 'error',
    'zod-mini/consistent-schema-var-name': 'error',
    'zod-mini/no-any-schema': 'error',
    'zod-mini/no-empty-custom-schema': 'error',
    'zod-mini/prefer-meta': 'error',
    'zod-mini/require-brand-type-parameter': 'error',
    'zod-mini/require-error-message': 'error',

  },
} satisfies Linter.Config as CompatibleConfig;

export default {
  ...eslintPluginZodMini,
  configs: {
    recommended: recommendedConfig,
  },
} satisfies ESLint.Plugin;
/**
 * why `satisfies`?
 * @see https://github.com/marcalexiei/eslint-plugin-zod/issues/49
 */
