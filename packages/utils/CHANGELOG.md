# @eslint-zod/utils

## 1.3.0

### Minor Changes

- [#314](https://github.com/marcalexiei/eslint-zod/pull/314) [`b073f04`](https://github.com/marcalexiei/eslint-zod/commit/b073f0404c06a808aa6f0712020728d97b39a26f) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: add `buildPreferEnumOverLiteralUnionCreate` shared rule factory

## 1.2.0

### Minor Changes

- [#293](https://github.com/marcalexiei/eslint-zod/pull/293) [`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: adds `zodCoreImportScope`

## 1.1.0

### Minor Changes

- [#297](https://github.com/marcalexiei/eslint-zod/pull/297) [`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: remove `detectZodSchemaRootNode` from export

  This is technically a breaking change, but since this package is only used by the plugin within this repository, I'm releasing it as a minor version.

  If you were relying on the previous behavior, feel free to open an issue and I’ll cut a follow-up release to restore compatibility.

- [#297](https://github.com/marcalexiei/eslint-zod/pull/297) [`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: `detectZodSchemaRootNode#schemaType` should be the zod public name not the local one

### Patch Changes

- [#295](https://github.com/marcalexiei/eslint-zod/pull/295) [`38429ee`](https://github.com/marcalexiei/eslint-zod/commit/38429ee89494bc1605d3248b10e46c8a6ec0a58c) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(ZodImportScope): simplify types using sources directly

## 1.0.1

### Patch Changes

- [#286](https://github.com/marcalexiei/eslint-zod/pull/286) [`9cfe2bb`](https://github.com/marcalexiei/eslint-zod/commit/9cfe2bb16ba1a70f12bf81a6bd1ed47e97200889) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: `dist` folder is missing in published package

## 1.0.0

### Major Changes

- [#277](https://github.com/marcalexiei/eslint-zod/pull/277) [`349991f`](https://github.com/marcalexiei/eslint-zod/commit/349991fc60a7909af4830d0aa117d2878f306557) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: initial release
