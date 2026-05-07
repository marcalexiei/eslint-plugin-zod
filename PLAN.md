# Monorepo restructuring plan

## Goal

Convert `eslint-plugin-zod` into a pnpm monorepo with three packages:

| npm name                 | directory                         | description               |
| ------------------------ | --------------------------------- | ------------------------- |
| `eslint-plugin-zod`      | `plugins/eslint-plugin-zod/`      | existing plugin, renamed  |
| `eslint-plugin-zod-mini` | `plugins/eslint-plugin-zod-mini/` | new plugin for `zod/mini` |
| `@eslint-zod/utils`      | `packages/utils/`                 | shared utilities, public  |

Plugins are unscoped; utilities live under the `@eslint-zod` org scope.
This mirrors the `@eslint-react` convention.

The existing `eslint-plugin-zod` package on npm will be kept as a deprecated stub pointing to the new package name to preserve the migration path for existing users.

---

## Phase 1 — Monorepo scaffold ✅

- Add `pnpm-workspace.yaml` at the root:
  ```yaml
  packages:
    - 'plugins/*'
    - 'packages/*'
  ```
- Convert root `package.json` to a workspace root: remove `name`, `version`, `main`, `exports`; keep all dev deps (`vitest`, `typescript`, `prettier`, `eslint`, `tsdown`, `knip`, etc.)
- Create `plugins/` and `packages/` directories

---

## Phase 2 — TypeScript project references + `@eslint-zod/source` condition ✅

Root `tsconfig.json` becomes a references-only config (no emit):

```json
{
  "files": [],
  "references": [
    { "path": "packages/utils" },
    { "path": "plugins/eslint-plugin-zod" },
    { "path": "plugins/eslint-plugin-zod-mini" }
  ]
}
```

Each package gets `composite: true` and the custom condition in its `tsconfig.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "customConditions": ["@eslint-zod/source"]
  }
}
```

Each package's `package.json` exports expose the source condition:

```json
{
  "exports": {
    ".": {
      "@eslint-zod/source": "./src/index.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

Plugin packages reference utils:

```json
{
  "references": [{ "path": "../../packages/utils" }]
}
```

`tsc -b` at the root builds in dependency order and only recompiles changed packages.
The `@eslint-zod/source` condition means TypeScript resolves to `.ts` source files
during development without needing to build `utils` first.

---

## Phase 3 — Move existing plugin ✅

Move into `plugins/eslint-plugin-zod/`:

- `src/` → `plugins/eslint-plugin-zod/src/`
- `tests/` → `plugins/eslint-plugin-zod/tests/`
- `docs/` → `plugins/eslint-plugin-zod/docs/`
- `CHANGELOG.md` (belongs to this package's release history)
- Per-package `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`
- `package.json` — update `name` to `eslint-plugin-zod`, strip dev deps that now live at the root

`create-plugin-rule.ts` stays inside this package (not moved to utils). It will have
its own counterpart in `eslint-plugin-zod-mini`.

---

## Phase 4 — Extract shared utilities ✅

Create `packages/utils/` (`@eslint-zod/utils`, `private: false`, published to npm).

Move from `plugins/eslint-plugin-zod/src/utils/`:

- `detect-zod-schema-root-node.ts`
- `find-parent-schema-matching-condition.ts`
- `is-zod-import-source.ts`
- `track-zod-schema-imports.ts`
- `build-zod-chain-removal-fix.ts`
- `build-zod-chain-replacement-fix.ts`

**Rule implementations stay per-plugin.** `eslint-plugin-zod` tracks `zod` imports and
`eslint-plugin-zod-mini` tracks `zod/mini` imports — the factory logic differs between
plugins. Each plugin owns its complete rule set and uses the shared AST utilities from
`@eslint-zod/utils` to detect and manipulate nodes.

Update `eslint-plugin-zod` imports to use `@eslint-zod/utils`.

### Bundling

`@eslint-zod/utils` is **bundled into each plugin** at build time. Since it is a
workspace dependency, `tsdown` includes it automatically (workspace deps are not
external by default). Tree-shaking ensures each plugin only ships what it uses.
Users never need to install `@eslint-zod/utils` directly unless they are building
their own Zod ESLint rules.

---

## Phase 5 — New plugin scaffold ✅

Create `plugins/eslint-plugin-zod-mini/`:

- Own `package.json` (`name: "eslint-plugin-zod-mini"`), `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`
- Depends on `@eslint-zod/utils` (workspace)
- Own `create-plugin-rule.ts` (independent from zod's, detects `zod/mini` imports)
- Own rule implementations using shared AST utilities from `@eslint-zod/utils`
- zod-mini-specific rules added incrementally

### Additional changes made in this phase

- Removed `'all'` from `ZodImportAllowedSource` (was `'all' | 'zod' | 'zod-mini'`, now `'zod' | 'zod-mini'`). The `'all'` union is no longer needed now that each plugin is scoped to its own import source.
- Removed `recommendedMini` config from `eslint-plugin-zod`. Users of `zod/mini` should now use `eslint-plugin-zod-mini` directly.
- All `eslint-plugin-zod` rules updated from `createZodSchemaImportTrack('all')` to `createZodSchemaImportTrack('zod')`.
- `prefer-meta` rule in `eslint-plugin-zod-mini` reimplemented: in `zod/mini`, `.describe()` is a standalone function (`z.describe(...)`) not a chain method, so detection uses namespace/import tracking instead of `collectZodChainMethods`.
- READMEs created for both plugins; root README converted to monorepo overview.

---

## Phase 6 — CI/CD adjustments ✅

### Build

```bash
pnpm -r build   # respects workspace dep order
tsc -b          # type-only, incremental, respects project references
```

### Tests

`vitest.config.ts` stays per-package. Run all from root:

```bash
pnpm -r test
```

### Linting / formatting

`eslint.config.js` and Prettier config stay at the root — already work across workspaces.

### Docs

`eslint-doc-generator` runs per-plugin (not relevant for `utils`).
Each plugin has its own `.eslint-doc-generatorrc.js` (the tool does not traverse past `package.json` boundaries).

### Knip

`knip.config.ts` updated to be workspace-aware. `eslint` is suppressed per-plugin via `ignoreDependencies` (it is an optional peer used only for `satisfies` type checks). The CI matrix `eslint@${{ matrix.eslint }}` syntax is suppressed via `ignoreBinaries`.

### Changesets

No changes needed — changesets auto-discovers publishable packages from the workspace.

### CI matrix

No structural changes — existing Node/ESLint version matrix is preserved.
`pnpm -r` commands handle all packages in a single job.

### Release workflow

No changes needed — changesets handles per-package versioning and publishing.

---

## Remaining before merge

- [ ] Create a changeset for `eslint-plugin-zod` (major — removal of `recommendedMini` config)
- [ ] Create a changeset for `eslint-plugin-zod-mini` (initial release)
- [ ] Create a changeset for `@eslint-zod/utils` (initial release)
