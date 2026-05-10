---
'@eslint-zod/utils': minor
---

feat: remove `detectZodSchemaRootNode` from export

This is technically a breaking change, but since this package is only used by the plugin within this repository, I'm releasing it as a minor version.

If you were relying on the previous behavior, feel free to open an issue and I’ll cut a follow-up release to restore compatibility.
