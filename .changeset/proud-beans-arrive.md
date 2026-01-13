---
'eslint-plugin-zod': major
---

feat!: `eslint-plugin-zod-x` is now `eslint-plugin-zod`

---

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

## Using `eslint-plugin-zod`

### Supported ESLint and Zod versions

This release supports **ESLint 9** and **Zod 4** only.
If your project depends on an older versions, you must upgrade before adopting this version.

### Configuration compatibility

You are encouraged to use the `recommended` configuration, as shown in the README.

If the recommended configuration does not meet your requirements, the following table shows the equivalent rules between `eslint-plugin-zod-x` and `eslint-plugin-zod`:

- `prefer-enum` → `prefer-enum-over-literal-union`
- `require-strict` → `consistent-object-schema-type` with `allow: ['strict']`
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
