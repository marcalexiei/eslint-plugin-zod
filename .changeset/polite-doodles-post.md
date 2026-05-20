---
'eslint-plugin-zod-mini': minor
---

feat(rule-builders): add `no-throw-in-refine`

The `no-throw-in-refine` create logic has been extracted into `@eslint-zod/utils` so both
`eslint-plugin-zod` and `eslint-plugin-zod-mini` use the same shared implementation.
