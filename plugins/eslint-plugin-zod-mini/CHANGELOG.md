# eslint-plugin-zod-mini

## 1.0.3

### Patch Changes

- [#293](https://github.com/marcalexiei/eslint-zod/pull/293) [`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(README): correct `zod/mini` URL

- Updated dependencies [[`74117f9`](https://github.com/marcalexiei/eslint-zod/commit/74117f9ad94697911f42f77b958e59b4d2239017)]:
  - @eslint-zod/utils@1.2.0

## 1.0.2

### Patch Changes

- [#297](https://github.com/marcalexiei/eslint-zod/pull/297) [`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - refactor(prefer-meta): rely on `detectZodSchemaRootNode` to detect describe methods

- Updated dependencies [[`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6), [`66dcfca`](https://github.com/marcalexiei/eslint-zod/commit/66dcfca1aceb8c5dc2d85e4e06147561495491e6), [`38429ee`](https://github.com/marcalexiei/eslint-zod/commit/38429ee89494bc1605d3248b10e46c8a6ec0a58c)]:
  - @eslint-zod/utils@1.1.0

## 1.0.1

### Patch Changes

- [#286](https://github.com/marcalexiei/eslint-zod/pull/286) [`9cfe2bb`](https://github.com/marcalexiei/eslint-zod/commit/9cfe2bb16ba1a70f12bf81a6bd1ed47e97200889) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: `dist` folder is missing in published package

- Updated dependencies [[`9cfe2bb`](https://github.com/marcalexiei/eslint-zod/commit/9cfe2bb16ba1a70f12bf81a6bd1ed47e97200889)]:
  - @eslint-zod/utils@1.0.1

## 1.0.0

### Major Changes

- [#277](https://github.com/marcalexiei/eslint-zod/pull/277) [`349991f`](https://github.com/marcalexiei/eslint-zod/commit/349991fc60a7909af4830d0aa117d2878f306557) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: initial release

  This plugin visits only schemas coming from `zod/mini` and `zod/v4-mini`

  It supports the following rules from `eslint-plugin-zod`:
  - `consistent-import`
  - `consistent-import-source`
  - `consistent-object-schema-type`
  - `consistent-schema-output-type-style`
  - `consistent-schema-var-name`
  - `no-any-schema`
  - `no-empty-custom-schema`
  - `no-unknown-schema`
  - `prefer-meta`
  - `require-brand-type-parameter`
  - `require-error-message`
  - `schema-error-property-style`

  A `recommended` config is exposed by the plugin for easy setup

### Patch Changes

- Updated dependencies [[`349991f`](https://github.com/marcalexiei/eslint-zod/commit/349991fc60a7909af4830d0aa117d2878f306557)]:
  - @eslint-zod/utils@1.0.0
