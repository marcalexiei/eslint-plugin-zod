---
'eslint-plugin-zod': major
---

feat!: split `zod-mini` rules in a separate plugin

`eslint-plugin-zod` now only applies to `zod`, `zod/v4`, and `zod/v3` imports.
Rules no longer fire on `zod/mini` or `zod/v4-mini` imports.

If you were using `eslint-plugin-zod` to lint Zod Mini schemas, install the new dedicated plugin:

```shell
npm i --save-dev eslint-plugin-zod-mini
```

Then replace `configs.recommendedMini` with the new plugin's `configs.recommended`:

```diff
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslint from '@eslint/js';
  import eslintPluginZod from 'eslint-plugin-zod';
+ import eslintPluginZodMini from 'eslint-plugin-zod-mini';

  export default defineConfig(
    eslint.configs.recommended,
    eslintPluginZod.configs.recommended,
-   eslintPluginZod.configs.recommendedMini,
+   eslintPluginZodMini.configs.recommended,
  );
```
