---
'eslint-plugin-zod': minor
---

feat(consistent-schema-name): add new rule

The new `zod/consistent-schema-name` rule replaces `zod/require-schema-suffix` and supports enforcing both a prefix (`before`) and/or a suffix (`after`) on Zod schema variable names.

The default behavior is identical to `require-schema-suffix`: it enforces an `'Schema'` suffix.

### Migration from `require-schema-suffix`

```diff
  // eslint.config.js
  rules: {
-   'zod/require-schema-suffix': 'error',
+   'zod/consistent-schema-name': 'error',
  }
```

If you rely on the `recommended` or `recommendedMini` configs, no manual changes are needed — both configs have been updated automatically.

`zod/require-schema-suffix` is now deprecated and will be removed in a future major release.
