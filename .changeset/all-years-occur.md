---
'eslint-plugin-zod': major
---

feat!: remove `zod/require-schema-suffix` rule

Use `zod/require-schema-suffix` instead:

```diff
  // eslint.config.js
  import { defineConfig } from 'eslint/config';
  import eslintPluginZod from 'eslint-plugin-zod';

  export default defineConfig(
    {
      plugins: {
        zod: eslintPluginZod,
      },
      rules: {
-       'zod/require-schema-suffix': 'error',
+       'zod/consistent-schema-var-name': 'error',
      }
    }
  );
```
