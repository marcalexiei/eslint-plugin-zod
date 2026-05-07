# @eslint-zod/utils

[![CI Status][CIBadge]][CIURL]
[![Code style: prettier][CodeStyleBadge]][CodeStyleURL]
[![Open on npmx][npmVersionBadge]][npmVersionURL]
[![Open issue tracker][issuesBadge]][issuesURL]

[CIBadge]: https://img.shields.io/github/actions/workflow/status/marcalexiei/eslint-zod/ci.yml?style=for-the-badge&logo=github&event=push&label=CI
[CIURL]: https://github.com/marcalexiei/eslint-zod/actions/workflows/CI.yml/badge.svg
[CodeStyleBadge]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=for-the-badge&logo=prettier
[CodeStyleURL]: https://prettier.io
[npmVersionBadge]: https://img.shields.io/npm/v/@eslint-zod/utils.svg?style=for-the-badge&logo=npm
[npmVersionURL]: https://npmx.dev/package/@eslint-zod/utils
[issuesBadge]: https://img.shields.io/github/issues/marcalexiei/eslint-zod.svg?style=for-the-badge
[issuesURL]: https://github.com/marcalexiei/eslint-zod/issues

Shared AST utilities for [eslint-plugin-zod](../plugins/eslint-plugin-zod) and [eslint-plugin-zod-mini](../plugins/eslint-plugin-zod-mini).

> [!NOTE]
> This package is a dependency of `eslint-plugin-zod` and `eslint-plugin-zod-mini`. You do not need to install it directly.

## API

### `trackZodSchemaImports()`

Tracks namespace and named imports from a Zod import source. Returns `isZodNamespace`, `getNamedImportOriginal`, and listener hooks to wire into a rule's visitor.

### `detectZodSchemaRootNode()`

Finds the outermost Zod call expression in a chain, including calls in argument position (e.g. inside `.check()`).

### `collectZodChainMethods()`

Returns the list of chained method names on a Zod expression.

### `buildZodChainRemoveMethodFix` / `buildZodChainReplacementFix`

Fixer helpers for removing or replacing a method in a Zod chain.
