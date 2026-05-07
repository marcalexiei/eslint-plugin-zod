# Monorepo restructuring plan

## Goal

Convert `eslint-plugin-zod` into a pnpm monorepo with three packages:

| npm name | directory | description |
|---|---|---|
| `eslint-plugin-zod` | `plugins/eslint-plugin-zod/` | existing plugin, renamed |
| `eslint-plugin-zod-mini` | `plugins/eslint-plugin-zod-mini/` | new plugin for `zod/mini` |
| `@eslint-zod/utils` | `packages/utils/` | shared utilities, public |

Plugins are unscoped; utilities live under the `@eslint-zod` org scope.
This mirrors the `@eslint-react` convention.

The existing `eslint-plugin-zod` package on npm will be kept as a deprecated stub pointing to the new package name to preserve the migration path for existing users.

---

## Phase 1 — Monorepo scaffold

- Add `pnpm-workspace.yaml` at the root:
  ```yaml
  packages:
    - "plugins/*"
    - "packages/*"
  ```
- Convert root `package.json` to a workspace root: remove `name`, `version`, `main`, `exports`; keep all dev deps (`vitest`, `typescript`, `prettier`, `eslint`, `tsdown`, `knip`, etc.)
- Create `plugins/` and `packages/` directories

---

## Phase 2 — TypeScript project references + `@eslint-zod/source` condition

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

## Phase 3 — Move existing plugin

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

## Phase 4 — Extract shared utilities

Create `packages/utils/` (`@eslint-zod/utils`, `private: false`, published to npm).

Move from `plugins/eslint-plugin-zod/src/utils/`:

- `detect-zod-schema-root-node.ts`
- `find-parent-schema-matching-condition.ts`
- `is-zod-import-source.ts`
- `track-zod-schema-imports.ts`
- `build-zod-chain-removal-fix.ts`
- `build-zod-chain-replacement-fix.ts`

The **14 universal rules** (rules that apply to both `zod` and `zod/mini`) also move
here as raw rule factory functions — no `createPluginRule` wrapper, just the `create`
logic. Each plugin wraps them with its own `createPluginRule` and registers them.

Universal rules (from README):

- `consistent-import`
- `consistent-import-source`
- `consistent-object-schema-type`
- `consistent-schema-output-type-style`
- `consistent-schema-var-name`
- `no-any-schema`
- `no-empty-custom-schema`
- `no-unknown-schema`
- `prefer-meta`
- `prefer-namespace-import`
- `require-brand-type-parameter`
- `require-error-message`
- `require-schema-suffix`
- `schema-error-property-style`

Update `eslint-plugin-zod` imports to use `@eslint-zod/utils`.

### Bundling

`@eslint-zod/utils` is **bundled into each plugin** at build time. Since it is a
workspace dependency, `tsdown` includes it automatically (workspace deps are not
external by default). Tree-shaking ensures each plugin only ships what it uses.
Users never need to install `@eslint-zod/utils` directly unless they are building
their own Zod ESLint rules.

---

## Phase 5 — New plugin scaffold

Create `plugins/eslint-plugin-zod-mini/`:

- Own `package.json` (`name: "eslint-plugin-zod-mini"`), `tsconfig.json`, `tsdown.config.ts`, `vitest.config.ts`
- Depends on `@eslint-zod/utils` (workspace)
- Own `create-plugin-rule.ts` (independent from zod's, may diverge)
- Re-exports universal rules from `@eslint-zod/utils`, wrapped with its own `createPluginRule`
- zod-mini-specific rules added incrementally

---

## Phase 6 — CI/CD adjustments

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

### Knip

Update `knip.config.ts` to be workspace-aware.

### Changesets

Update `.changeset/config.json` to list all three publishable packages.
`@eslint-zod/utils` is public so changesets tracks it like the plugins.

### CI matrix

No structural changes — existing Node/ESLint version matrix is preserved.
`pnpm -r` commands handle all packages in a single job.

### Release workflow

No changes needed — changesets handles per-package versioning and publishing.

