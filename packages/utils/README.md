# @eslint-zod/utils

[![CI Status][CIBadge]][CIURL]
[![Code style: prettier][CodeStyleBadge]][CodeStyleURL]
[![Lint: eslint][lintBadge]][lintURL]
[![Open on npmx][npmVersionBadge]][npmVersionURL]
[![Open issue tracker][issuesBadge]][issuesURL]

[CIBadge]: https://img.shields.io/github/actions/workflow/status/marcalexiei/eslint-zod/ci.yml?style=for-the-badge&logo=github&event=push&label=CI
[CIURL]: https://github.com/marcalexiei/eslint-zod/actions/workflows/CI.yml/badge.svg
[CodeStyleBadge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier
[CodeStyleURL]: https://prettier.io
[lintBadge]: https://img.shields.io/badge/lint-eslint-3A33D1?logo=eslint&style=for-the-badge
[lintURL]: https://eslint.org
[npmVersionBadge]: https://img.shields.io/npm/v/@eslint-zod/utils.svg?style=for-the-badge&logo=npm
[npmVersionURL]: https://npmx.dev/package/@eslint-zod/utils
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/eslint-zod.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/eslint-zod/issues

Shared AST utilities for

- `eslint-plugin-zod`
- `eslint-plugin-zod-mini`
- `eslint-plugin-zod-core`

> [!NOTE]
> This package is a dependency of all previously listed packages, so you do not need to install it directly.

## API

### `createZodSchemaImportTrack()`

Tracks namespace and named imports from a Zod import source. Returns an object with `isZodNamespace`, `getNamedImportOriginal`, `collectZodChainMethods`, and listener hooks to wire into a rule's visitor.

### `detectZodSchemaRootNode()`

Finds the outermost Zod call expression in a chain, including calls in argument position (e.g. inside `.check()`).

### `isZodNumberSchemaCallExpression()`

Returns `true` if a call expression is a Zod number schema call (`z.number()` or equivalent).

### `findParentSchemaMatchingCondition()`

Walks up the AST from a call expression and returns the first ancestor Zod schema node that satisfies the provided predicate.

### `buildZodChainRemoveMethodFix` / `buildZodChainReplacementFix`

Fixer helpers for removing or replacing a method in a Zod chain.

### `buildPreferEnumOverLiteralUnionCreate(scope)`

Returns the `create` function for the `prefer-enum-over-literal-union` rule, parameterised by import scope. Used by both `eslint-plugin-zod` and `eslint-plugin-zod-mini` to share rule logic while keeping per-plugin scope and rule metadata.

### `zodImportScope` / `zodMiniImportScope`

Class and pre-built instances that define the set of recognised import sources for each plugin scope.

- `zodImportScope.sources` → `['zod', 'zod/v4', 'zod/v3']`
- `zodMiniImportScope.sources` → `['zod/mini', 'zod/v4-mini']`
- `isAllowed(source)` — returns `true` if the source belongs to the scope

### `ZOD_NON_SCHEMA_PRODUCING_METHODS`

Array of Zod method names that do not return a schema (parse methods, codec helpers, error formatters). Useful for filtering out terminal calls when traversing a chain.

### Import syntax helpers

Utilities used by `consistent-import` rules to inspect and rewrite import declarations.

- `IMPORT_SYNTAXES` — `['namespace', 'named']` constant tuple
- `isGroupFirstImportKindValidForSyntax()` — checks whether the first import in a group matches the expected syntax and `import type` rules
- `shouldIdentifierBeRenamed()` — returns `true` if an identifier node should be renamed (skips specifier nodes and already-qualified members)
- `getNamespaceAliasNameFrom()` — extracts the most significant local name from an import clause for use as a namespace alias
