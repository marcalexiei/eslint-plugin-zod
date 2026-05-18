---
'@eslint-zod/utils': major
---

refactor(utils): introduce per-file rule builder exports

Eleven additional shared rule `create` factories have been extracted from the plugins into `@eslint-zod/utils`, joining the existing `buildPreferEnumOverLiteralUnionCreate`. All rule builders are now exported as individual sub-path exports — one per rule — instead of from the package root.

**New exports** (`@eslint-zod/utils/rule-builders/<rule-name>`):

- `@eslint-zod/utils/rule-builders/consistent-import`
- `@eslint-zod/utils/rule-builders/consistent-import-source`
- `@eslint-zod/utils/rule-builders/consistent-object-schema-type`
- `@eslint-zod/utils/rule-builders/consistent-schema-output-type-style`
- `@eslint-zod/utils/rule-builders/consistent-schema-var-name`
- `@eslint-zod/utils/rule-builders/no-any-schema`
- `@eslint-zod/utils/rule-builders/no-empty-custom-schema`
- `@eslint-zod/utils/rule-builders/no-unknown-schema`
- `@eslint-zod/utils/rule-builders/prefer-enum-over-literal-union`
- `@eslint-zod/utils/rule-builders/require-brand-type-parameter`
- `@eslint-zod/utils/rule-builders/require-error-message`
- `@eslint-zod/utils/rule-builders/schema-error-property-style`

**Breaking changes** (removed from `@eslint-zod/utils` root):

- `buildPreferEnumOverLiteralUnionCreate` → now exported from `@eslint-zod/utils/rule-builders/prefer-enum-over-literal-union`
- `IMPORT_SYNTAXES` and `ImportSyntax` → now exported from `@eslint-zod/utils/rule-builders/consistent-import`
- `isGroupFirstImportKindValidForSyntax`, `shouldIdentifierBeRenamed`, `getNamespaceAliasNameFrom`, `ImportGroupData` → removed from public API (internal to the rule builder)
