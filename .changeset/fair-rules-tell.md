---
'eslint-plugin-zod': minor
---

feat: add new `prefer-top-level-string-formats` rule

The new `zod/prefer-top-level-string-formats` rule consolidates deprecated `z.string().<format>()` checks into a single rule.

### Migration from `no-string-schema-with-uuid`

```diff
  // eslint.config.js
  rules: {
-   'zod/no-string-schema-with-uuid': 'error',
+   'zod/prefer-top-level-string-formats': 'error',
  }
```

If you rely on the `recommended` config, no manual change is needed. The config has been updated automatically.

`zod/no-string-schema-with-uuid` is now deprecated and will be removed in a future major release.
