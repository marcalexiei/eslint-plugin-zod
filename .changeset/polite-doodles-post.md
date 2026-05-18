---
'eslint-plugin-zod-mini': minor
'eslint-plugin-zod': minor
'@eslint-zod/utils': minor
---

feat: add `no-throw-in-refine` to Zod Mini and extract a shared rule builder

The `no-throw-in-refine` create logic has been extracted into `@eslint-zod/utils` so both
`eslint-plugin-zod` and `eslint-plugin-zod-mini` use the same shared implementation.
