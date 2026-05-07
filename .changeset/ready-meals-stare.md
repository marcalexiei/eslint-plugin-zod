---
'eslint-plugin-zod': major
---

feat!: remove `zod/prefer-namespace-import` rule

Use `zod/consistent-import` instead:

```diff
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslintPluginZod from 'eslint-plugin-zod';

  export default defineConfig(
    {
      plugins: {
        'zod-x': eslintPluginZodX,
      },
      rules: {
-       'zod/prefer-namespace-import': 'error',
+       'zod/consistent-import': 'error', // Uses 'namespace' syntax as default
      }
    }
  );
```
