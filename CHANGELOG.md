# eslint-plugin-zod

## 3.1.0

### Minor Changes

- [#201](https://github.com/marcalexiei/eslint-plugin-zod/pull/201) [`6b1eece`](https://github.com/marcalexiei/eslint-plugin-zod/commit/6b1eecec612aac02eac2bf6536d26d1da27f98ca) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-namespace-import): deprecate rule in favour of `zod/consistent-import`

- [#179](https://github.com/marcalexiei/eslint-plugin-zod/pull/179) [`51563cf`](https://github.com/marcalexiei/eslint-plugin-zod/commit/51563cfc91c68c94caf27cbfac10057f02ca55ba) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-import): add new rule

## 3.0.2

### Patch Changes

- [#195](https://github.com/marcalexiei/eslint-plugin-zod/pull/195) [`45bbc49`](https://github.com/marcalexiei/eslint-plugin-zod/commit/45bbc49ee7a52d868b57d872e7e2b7d4c3d61c44) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(array-style): use collectZodChainMethods to improve detection logic

- [#197](https://github.com/marcalexiei/eslint-plugin-zod/pull/197) [`187d7a2`](https://github.com/marcalexiei/eslint-plugin-zod/commit/187d7a2e6d4792d5c5fed60116c5a5d89be5fc70) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta-last): simplify detect logic

- [#197](https://github.com/marcalexiei/eslint-plugin-zod/pull/197) [`187d7a2`](https://github.com/marcalexiei/eslint-plugin-zod/commit/187d7a2e6d4792d5c5fed60116c5a5d89be5fc70) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-number-schema-with-int): simplify detect logic

- [#193](https://github.com/marcalexiei/eslint-plugin-zod/pull/193) [`2f2184d`](https://github.com/marcalexiei/eslint-plugin-zod/commit/2f2184d839c67a1d676281257ef7b320cb33da70) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-throw-in-refine): missing report when refine is not the last method

- [#196](https://github.com/marcalexiei/eslint-plugin-zod/pull/196) [`fb0fe80`](https://github.com/marcalexiei/eslint-plugin-zod/commit/fb0fe8046cc0b50713992d6f393a1ff93f9a3bce) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-enum-over-literal-union): optional string literal unions are not flagged

## 3.0.1

### Patch Changes

- [#190](https://github.com/marcalexiei/eslint-plugin-zod/pull/190) [`294b4b1`](https://github.com/marcalexiei/eslint-plugin-zod/commit/294b4b17060d30354be707a3400cced43915df2c) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-enum-over-literal-union): handle empty methods

## 3.0.0

### Major Changes

- [`5f4db68`](https://github.com/marcalexiei/eslint-plugin-zod/commit/5f4db6830555b65a0e1607fa8ad65988c6bfb8ef) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: `eslint-plugin-zod-x` is now `eslint-plugin-zod`

  ***

  The author of `eslint-plugin-zod` has kindly shared ownership of the package, allowing `eslint-plugin-zod-x` to become `eslint-plugin-zod`.

  Thanks @gajus!

  ## Migrating from `eslint-plugin-zod-x`

  You can replace `eslint-plugin-zod-x` directly with `eslint-plugin-zod`.

  ### Rule prefix changes

  If you have customized rules, remove the `-x` suffix from the rule namespace.

  ```diff
  - 'zod-x/array-style': 'error',
  + 'zod/array-style': 'error',
  ```

  ### Configuration update

  ```diff
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslint from '@eslint/js';
  - import eslintPluginZodX from 'eslint-plugin-zod-x';
  + import eslintPluginZod from 'eslint-plugin-zod';

  export default defineConfig(
    eslint.configs.recommended,
  - eslintPluginZodX.configs.recommended,
  + eslintPluginZod.configs.recommended,
  );
  ```

  ## Update `eslint-plugin-zod`

  When the project was taken over, `eslint-plugin-zod-x` was already at version `2.x`.

  To avoid versioning conflicts, `eslint-plugin-zod` will not publish any `2.x` releases and will instead start at version `3.x`.

  ### Supported ESLint and Zod versions

  This release supports **ESLint 9** and **Zod 4** only.
  If your project depends on an older versions, you must upgrade before adopting this version.

  ### Configuration compatibility

  You are encouraged to use the `recommended` configuration, as shown in the README.

  If the recommended configuration does not meet your requirements, the following table shows the equivalent rules between `eslint-plugin-zod-x` and `eslint-plugin-zod`:
  - `prefer-enum` → `prefer-enum-over-literal-union`
  - `require-strict` → `consistent-object-schema-type` with `allow: ['strictObject']`
  - `no-any` → `no-any-schema`

  #### Example custom configuration

  ```ts
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslint from '@eslint/js';
  import eslintPluginZod from 'eslint-plugin-zod';

  export default defineConfig(eslint.configs.recommended, {
    plugins: {
      zod: eslintPluginZod,
    },
    rules: {
      'zod/no-any-schema': 'error',
      'zod/prefer-enum-over-literal-union': 'error',
      'zod/consistent-object-schema-type': [
        'error',
        {
          allow: ['strictObject'],
        },
      ],
    },
  });
  ```

## 2.1.0

### Minor Changes

- [#183](https://github.com/marcalexiei/eslint-plugin-zod/pull/183) [`70f5add`](https://github.com/marcalexiei/eslint-plugin-zod/commit/70f5addfeb6e8438c3b0fdf5b5fa0ae32dc5057e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-enum-over-literal-union): add new rule

- [#184](https://github.com/marcalexiei/eslint-plugin-zod/pull/184) [`950f61f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/950f61f8957f81a7dd5627c7e406f512dde6ad7e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: `eslint-plugin-zod-x` deprecation notice

  This is the last `eslint-plugin-zod-x` release.
  Soon I'll release a new major version on `eslint-plugin-zod`.
  See [Takeover eslint-plugin-zod](https://github.com/marcalexiei/issues/171) for additional information.

## 2.0.1

### Patch Changes

- [#176](https://github.com/marcalexiei/eslint-plugin-zod/pull/176) [`d64dbc2`](https://github.com/marcalexiei/eslint-plugin-zod/commit/d64dbc21f032b341ffdafbcf397ea58018a6fc19) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: `detectZodSchemaRootNode` doesn't detect named `z` import

- [#177](https://github.com/marcalexiei/eslint-plugin-zod/pull/177) [`070a9a5`](https://github.com/marcalexiei/eslint-plugin-zod/commit/070a9a5fbd9ea1a5c0e506648d742f63c7fdd7d7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(schema-error-property-style): rule should report invalid esQuery selectors

- [#162](https://github.com/marcalexiei/eslint-plugin-zod/pull/162) [`b6eb583`](https://github.com/marcalexiei/eslint-plugin-zod/commit/b6eb5833dde8438c59bae4279c4f2fc59645082f) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: separate rule name into title; move description to its own paragraph

  Change coming from `eslint-doc-generator` update to v3
  - <https://github.com/bmish/eslint-doc-generator/releases/tag/v3.0.0>
  - <https://github.com/bmish/eslint-doc-generator/pull/835>
  - <https://github.com/bmish/eslint-doc-generator/pull/839>

- [#155](https://github.com/marcalexiei/eslint-plugin-zod/pull/155) [`84657fc`](https://github.com/marcalexiei/eslint-plugin-zod/commit/84657fc57724f4ad9eb5984c9b66ed878bf70297) Thanks [@ShayanTheNerd](https://github.com/ShayanTheNerd)! - fix(schema-error-property-style): correct typos in schema property descriptions

- [#173](https://github.com/marcalexiei/eslint-plugin-zod/pull/173) [`14bde3e`](https://github.com/marcalexiei/eslint-plugin-zod/commit/14bde3e84442f231d1fa3892fbbbd19caa422291) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(prefer-namespace-import): add treeshaking issue link

## 2.0.0

### Major Changes

- [#154](https://github.com/marcalexiei/eslint-plugin-zod/pull/154) [`8e72b23`](https://github.com/marcalexiei/eslint-plugin-zod/commit/8e72b23e8534deca30314f985a3877ea4e167b95) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: rename `no-any` to `no-any-schema`

  The `no-any` rule has been renamed to `no-any-schema` to align with the naming convention used by other rules such as `no-unknown-schema` and `consistent-object-schema-type`.

  If you are using the `recommend` configuration, no changes are required.

  For manual configurations, update your rule key as shown below:

  ```diff
    // eslint.config.js
    import { defineConfig } from 'eslint/config';
    import eslintPluginZodX from 'eslint-plugin-zod';

    export default defineConfig(
      {
        plugins: {
          'zod-x': eslintPluginZodX,
        },
        rules: {
  -       'zod-x/no-any': 'error',
  +       'zod-x/no-any-schema': 'error',
        }
      }
    );
  ```

- [#153](https://github.com/marcalexiei/eslint-plugin-zod/pull/153) [`a1a7612`](https://github.com/marcalexiei/eslint-plugin-zod/commit/a1a7612986d912f0f6058d60629c53f4f9771e05) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-strict-object)!: remove rule

  Use `consistent-object-schema-type` instead:

  ```diff
    // eslint.config.js
    import { defineConfig } from 'eslint/config';
    import eslintPluginZodX from 'eslint-plugin-zod';

    export default defineConfig(
      {
        plugins: {
          'zod-x': eslintPluginZodX,
        },
        rules: {
  -       'zod-x/prefer-strict-object': 'error',
  +       'zod-x/consistent-object-schema-type': [
  +         'error',
  +         { allow: ['strictObject'] },
  +       ],
        }
      }
    );
  ```

## 1.13.2

### Patch Changes

- [#149](https://github.com/marcalexiei/eslint-plugin-zod/pull/149) [`2479a93`](https://github.com/marcalexiei/eslint-plugin-zod/commit/2479a932a79f32ea541c32587b2df939dc9e6e1c) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(array-style): handle chain methods with `style: ‘method’`

## 1.13.1

### Patch Changes

- [#144](https://github.com/marcalexiei/eslint-plugin-zod/pull/144) [`4463fca`](https://github.com/marcalexiei/eslint-plugin-zod/commit/4463fca7000425cd197534a814a345e6c0d511df) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(no-any): handle chained method when creating fixer

## 1.13.0

### Minor Changes

- [#139](https://github.com/marcalexiei/eslint-plugin-zod/pull/139) [`77e7dde`](https://github.com/marcalexiei/eslint-plugin-zod/commit/77e7dde560233d5df7ea2658b860e465ad8e77b0) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-namespace-import): add autofix for all import references

- [#137](https://github.com/marcalexiei/eslint-plugin-zod/pull/137) [`cae9847`](https://github.com/marcalexiei/eslint-plugin-zod/commit/cae9847a9e5b441571d715dabf2819ec93ff10d1) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-strict-object): deprecate rule (use `consistent-object-schema-type`)

### Patch Changes

- [#139](https://github.com/marcalexiei/eslint-plugin-zod/pull/139) [`77e7dde`](https://github.com/marcalexiei/eslint-plugin-zod/commit/77e7dde560233d5df7ea2658b860e465ad8e77b0) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-namespace-import): handle named imports autofix correctly

## 1.12.0

### Minor Changes

- [#132](https://github.com/marcalexiei/eslint-plugin-zod/pull/132) [`d559140`](https://github.com/marcalexiei/eslint-plugin-zod/commit/d559140264d6024fcb079d8ad1a55b52f01da65a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-unknown-schema): add new rule

### Patch Changes

- [#133](https://github.com/marcalexiei/eslint-plugin-zod/pull/133) [`49c73fe`](https://github.com/marcalexiei/eslint-plugin-zod/commit/49c73fecd210471016896da23f27e29f3580602e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: ensure consistent structure across rules documentation

## 1.11.2

### Patch Changes

- [#125](https://github.com/marcalexiei/eslint-plugin-zod/pull/125) [`62b8ce3`](https://github.com/marcalexiei/eslint-plugin-zod/commit/62b8ce30212b981f3db818e122b9a59d8fdbc839) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): remove unsafe autofix

  If you previously relied on this feature, you can safely update your code by using your IDE’s rename functionality.

  For more details, see the [`require-schema-suffix` documentation](https://github.com/marcalexiei/eslint-plugin-zod/blob/main/docs/rules/require-schema-suffix.md).

## 1.11.1

### Patch Changes

- [#122](https://github.com/marcalexiei/eslint-plugin-zod/pull/122) [`85a1ec7`](https://github.com/marcalexiei/eslint-plugin-zod/commit/85a1ec72e7508b8c1e0e7a4908b20d1b072186a7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta): do not process non-zod expressions

## 1.11.0

### Minor Changes

- [#119](https://github.com/marcalexiei/eslint-plugin-zod/pull/119) [`725c4de`](https://github.com/marcalexiei/eslint-plugin-zod/commit/725c4de6fb004489ef12bb0410b4a6f3104c6e7a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-object-schema-type): add new rule

## 1.10.0

### Minor Changes

- [#110](https://github.com/marcalexiei/eslint-plugin-zod/pull/110) [`d54bade`](https://github.com/marcalexiei/eslint-plugin-zod/commit/d54bade9949834e53c11c50aef31961c2af2d3bf) Thanks [@marcalexiei](https://github.com/marcalexiei)! - This release adds support for Zod named exports.
  All rules should now work with default, namespace, and named import styles,
  this required a major rewrite.

  ***

  Some rules do not yet provide automatic fixes when using named imports.
  Fixes for those cases are more complex because they often require modifying import statements.

  ***

  🤕🤕🤕
  This is not a major release since doesn't add any breaking change,
  however there might be some issues due to the major refactor.

### Patch Changes

- [#112](https://github.com/marcalexiei/eslint-plugin-zod/pull/112) [`bbbb147`](https://github.com/marcalexiei/eslint-plugin-zod/commit/bbbb147433e554a11ad7193e0ffa7286dc8f9f0a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: new find logic perf improvements

## 1.9.0

### Minor Changes

- [#103](https://github.com/marcalexiei/eslint-plugin-zod/pull/103) [`44fb4bf`](https://github.com/marcalexiei/eslint-plugin-zod/commit/44fb4bfc20b0afb3d205cb1d9f2bc3556778c949) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-import-source): add suggestion

## 1.8.3

### Patch Changes

- [#105](https://github.com/marcalexiei/eslint-plugin-zod/pull/105) [`3dfcd52`](https://github.com/marcalexiei/eslint-plugin-zod/commit/3dfcd525464018da8e89003d4cee7058ac5be767) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(meta): make zod an optional peer dependency

## 1.8.2

### Patch Changes

- [#102](https://github.com/marcalexiei/eslint-plugin-zod/pull/102) [`8dd776d`](https://github.com/marcalexiei/eslint-plugin-zod/commit/8dd776dd2bdca0ddbf81489a7eb394cb64499220) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(array-style): correct rule name

- [#99](https://github.com/marcalexiei/eslint-plugin-zod/pull/99) [`a07e3fc`](https://github.com/marcalexiei/eslint-plugin-zod/commit/a07e3fc52272d8165c0816abf23dd67ee41beffd) Thanks [@V1RE](https://github.com/V1RE)! - fix(schema-error-property-style): correct rule name from 'consistent-import-source'

- [#101](https://github.com/marcalexiei/eslint-plugin-zod/pull/101) [`0642e50`](https://github.com/marcalexiei/eslint-plugin-zod/commit/0642e5001d1fcaf566dc871e5cc326acd1ccf3f7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-brand-type-parameter): correct `removeBrandFunction` message typo

## 1.8.1

### Patch Changes

- [#96](https://github.com/marcalexiei/eslint-plugin-zod/pull/96) [`6b282b4`](https://github.com/marcalexiei/eslint-plugin-zod/commit/6b282b4076801556c4fdbc20be2fd650d75ddca2) Thanks [@andreww2012](https://github.com/andreww2012)! - fix(array-style): disallow extra properties in rule options

- [#95](https://github.com/marcalexiei/eslint-plugin-zod/pull/95) [`7b28d3a`](https://github.com/marcalexiei/eslint-plugin-zod/commit/7b28d3a28ae91ae0a3ff55f3ad530d2691cecf2a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-namespace-import): treat each source as standalone group to allow using multiple versions

- [#96](https://github.com/marcalexiei/eslint-plugin-zod/pull/96) [`6b282b4`](https://github.com/marcalexiei/eslint-plugin-zod/commit/6b282b4076801556c4fdbc20be2fd650d75ddca2) Thanks [@andreww2012](https://github.com/andreww2012)! - fix(prefer-strict-object): disallow extra properties in rule options

- [#97](https://github.com/marcalexiei/eslint-plugin-zod/pull/97) [`4ae924f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/4ae924f488e8305d2bf5d6a2e9de7f3bb87e3eac) Thanks [@andreww2012](https://github.com/andreww2012)! - fix(meta): remove anchor from rule url prefix

## 1.8.0

### Minor Changes

- [#90](https://github.com/marcalexiei/eslint-plugin-zod/pull/90) [`13653a6`](https://github.com/marcalexiei/eslint-plugin-zod/commit/13653a68372779dea5ef626b997d109d487580b7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(schema-error-property-style): add new rule

- [#89](https://github.com/marcalexiei/eslint-plugin-zod/pull/89) [`56e9aff`](https://github.com/marcalexiei/eslint-plugin-zod/commit/56e9aff6086ea3c76e8b7bdffbba54662b93bea9) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat: support Node 25

- [#92](https://github.com/marcalexiei/eslint-plugin-zod/pull/92) [`707ee6f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/707ee6f6ca054432879a970f7db7e38196638e32) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(require-brand-type-parameter): add new rule

## 1.7.1

### Patch Changes

- [#69](https://github.com/marcalexiei/eslint-plugin-zod/pull/69) [`fb209b7`](https://github.com/marcalexiei/eslint-plugin-zod/commit/fb209b79d5e17ef68f6d10232ebf61b2909a575b) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(package.json): add hash to readme in `homepage` field

- [#75](https://github.com/marcalexiei/eslint-plugin-zod/pull/75) [`c8718d8`](https://github.com/marcalexiei/eslint-plugin-zod/commit/c8718d85b221fe901a286c9020e7df92ed4fc6de) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): false positive if last method in chain is not a parse-like method

- [#73](https://github.com/marcalexiei/eslint-plugin-zod/pull/73) [`01820c0`](https://github.com/marcalexiei/eslint-plugin-zod/commit/01820c0bb414b0b1da820eb379572b7be6b2d77e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta-last): handle meta inside objects

## 1.7.0

### Minor Changes

- [#61](https://github.com/marcalexiei/eslint-plugin-zod/pull/61) [`926b6bd`](https://github.com/marcalexiei/eslint-plugin-zod/commit/926b6bdd12902bb68e0c689b8f7c58e09f38e5aa) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-number-schema-with-int): add new rule

  Thanks to @ulrichstark for the proposal

### Patch Changes

- [#67](https://github.com/marcalexiei/eslint-plugin-zod/pull/67) [`e1b3955`](https://github.com/marcalexiei/eslint-plugin-zod/commit/e1b3955a12ecdcdd92b438e3a759906d3beae008) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: format rules descriptions consistently marking methods with “`”

- [#68](https://github.com/marcalexiei/eslint-plugin-zod/pull/68) [`ce8132a`](https://github.com/marcalexiei/eslint-plugin-zod/commit/ce8132a2c021c94edf4dffbb88ed726b6a0ba08d) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs(README): improve install and configuration

- [#65](https://github.com/marcalexiei/eslint-plugin-zod/pull/65) [`45dbdc8`](https://github.com/marcalexiei/eslint-plugin-zod/commit/45dbdc81f1e9f43955c5c41232858ad39ace4e54) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: create compatible plugin/config types to avoid external types references

## 1.6.0

### Minor Changes

- [#53](https://github.com/marcalexiei/eslint-plugin-zod/pull/53) [`2dba641`](https://github.com/marcalexiei/eslint-plugin-zod/commit/2dba641334936362e95a8d802ff8a182344434fd) Thanks [@ulrichstark](https://github.com/ulrichstark)! - feat(no-optional-and-default-together): add new rule

- [#57](https://github.com/marcalexiei/eslint-plugin-zod/pull/57) [`fd12dcb`](https://github.com/marcalexiei/eslint-plugin-zod/commit/fd12dcbfaf63a6be90416184e0924d1c5895cadd) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-optional-and-default-together): add different message when `preferredMethod` !== `none`

## 1.5.1

### Patch Changes

- [#45](https://github.com/marcalexiei/eslint-plugin-zod/pull/45) [`caee00f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/caee00fc60cb29193ea90d696969dd9ab9ab96b6) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: simplify plugin type

  Refactor plugin `rules` object to use `Record<string, TSESLint.LooseRuleDefinition>` type.
  This eliminates the need to export rule options from individual rule files, fixing the `TS4023` TypeScript error:

  ```text
  Exported variable 'eslintPluginZodX' has or is using name 'Options' from external module "./src/rules/array-style" but cannot be named.
  ```

- [#50](https://github.com/marcalexiei/eslint-plugin-zod/pull/50) [`65f6dc8`](https://github.com/marcalexiei/eslint-plugin-zod/commit/65f6dc809179e444329e812fe4b8a9800478f9ca) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix: plugin type is incompatible with `eslint#defineConfig`

## 1.5.0

### Minor Changes

- [#41](https://github.com/marcalexiei/eslint-plugin-zod/pull/41) [`0e7b30a`](https://github.com/marcalexiei/eslint-plugin-zod/commit/0e7b30aeddacdcc37308dd741af5a280a6646214) Thanks [@SimonVadier](https://github.com/SimonVadier)! - feat(consistent-import-source): add support for `zod/mini` and `zod/v4-mini`

### Patch Changes

- [#40](https://github.com/marcalexiei/eslint-plugin-zod/pull/40) [`8dff683`](https://github.com/marcalexiei/eslint-plugin-zod/commit/8dff6836adbf9a22952a498f180c58d214404053) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-namespace-import): account for type imports

- [#36](https://github.com/marcalexiei/eslint-plugin-zod/pull/36) [`da86f6f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/da86f6f84cbb91cca411d281402d57a4c1fcd261) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: improve description meta

- [#43](https://github.com/marcalexiei/eslint-plugin-zod/pull/43) [`66f2ab5`](https://github.com/marcalexiei/eslint-plugin-zod/commit/66f2ab56674853d0fb580b2d153c990a1416088e) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(prefer-meta-last): Matching meta() from other packages

## 1.4.0

### Minor Changes

- [#26](https://github.com/marcalexiei/eslint-plugin-zod/pull/26) [`426005f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/426005f3ca646051309968ad38131a25908a3628) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(require-error-message): add new rule

### Patch Changes

- [#28](https://github.com/marcalexiei/eslint-plugin-zod/pull/28) [`5156928`](https://github.com/marcalexiei/eslint-plugin-zod/commit/5156928b8fe2713e193d1f7a8d46f3d031a0c09a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): some data returning methods are missing

- [#29](https://github.com/marcalexiei/eslint-plugin-zod/pull/29) [`2cf9d64`](https://github.com/marcalexiei/eslint-plugin-zod/commit/2cf9d64f641e00fc632151a93583cb2735eca900) Thanks [@marcalexiei](https://github.com/marcalexiei)! - fix(require-schema-suffix): ignore codec

## 1.3.0

### Minor Changes

- [#21](https://github.com/marcalexiei/eslint-plugin-zod/pull/21) [`530182d`](https://github.com/marcalexiei/eslint-plugin-zod/commit/530182d3d135aa85dc042ba322da551f23ae3f51) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(require-schema-suffix): add new rule

## 1.2.0

### Minor Changes

- [#19](https://github.com/marcalexiei/eslint-plugin-zod/pull/19) [`f2b43dd`](https://github.com/marcalexiei/eslint-plugin-zod/commit/f2b43dd52faba9253a2f8610d3c7ae30c9b6c73a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(consistent-import-source): add new rule

## 1.1.0

### Minor Changes

- [#15](https://github.com/marcalexiei/eslint-plugin-zod/pull/15) [`70057a3`](https://github.com/marcalexiei/eslint-plugin-zod/commit/70057a31517f17a0e24566e3782025aa1b47b7d4) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-empty-custom-schema): add new rule

- [#17](https://github.com/marcalexiei/eslint-plugin-zod/pull/17) [`978b12f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/978b12f04ae359bfdc2da504b249b9f13b8f272a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - docs: uniform rules documentation

## 1.0.2

### Patch Changes

- [`4ad66fc`](https://github.com/marcalexiei/eslint-plugin-zod/commit/4ad66fcaa29c0d214a0b204bec39a8ea21c45d2b) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: refine `.npmrc` (userland not affected)

## 1.0.1

### Patch Changes

- [`dccc798`](https://github.com/marcalexiei/eslint-plugin-zod/commit/dccc798bffad3300e1da7de4f48d73afa7696e22) Thanks [@marcalexiei](https://github.com/marcalexiei)! - chore: retry trusted publising

## 1.0.0

### Major Changes

- [`97b9d55`](https://github.com/marcalexiei/eslint-plugin-zod/commit/97b9d55ad27fea0d2e4e90653bacee4f38d1ddfd) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat!: initial release

### Minor Changes

- [`f2b3200`](https://github.com/marcalexiei/eslint-plugin-zod/commit/f2b3200344bbf673fb432fa991a0d6b48263f74a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-any): add new rule

- [`25e049f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/25e049fbcbb090c6b42e9bf43687a88ec2c05eb1) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(no-throw-in-refine): add new rule

- [`44f370f`](https://github.com/marcalexiei/eslint-plugin-zod/commit/44f370f4d9c7594c33ff19d48991072c3b1ed2fb) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(array-style): add new rule

- [`35ae1ad`](https://github.com/marcalexiei/eslint-plugin-zod/commit/35ae1ad6e9a8c2438afc17a6584bacd01334f5c7) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-namespace-import): add new rule

- [`bcedf76`](https://github.com/marcalexiei/eslint-plugin-zod/commit/bcedf76533b3efc2c1a20db7c50354f5f8ae262a) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-strict-object): add new rule

- [`aa189ea`](https://github.com/marcalexiei/eslint-plugin-zod/commit/aa189ea5f6a1da8f2cb79853842a2c5db60ce961) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-meta-last): new rule

- [`672f6ee`](https://github.com/marcalexiei/eslint-plugin-zod/commit/672f6ee368ad3dd9a762b68542a43f705dadf6bc) Thanks [@marcalexiei](https://github.com/marcalexiei)! - feat(prefer-meta): add new rule
