# zod/no-string-schema-with-uuid

📝 Disallow usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule aims to prevent the usage of `z.string().uuid()` in favor of the dedicated `z.uuid()` schema from Zod’s [string formats API](https://zod.dev/api#uuids).

## Examples

### ❌ Invalid

```ts
const schema = z.string().uuid();
const schemaWithOtherMethods = z.string().optional().uuid();
```

### ✅ Valid

```ts
const schema = z.uuid();
const schemaWithOtherMethods = z.uuid().optional();
```

## When Not To Use It

If you prefer the chained form or need to support an older Zod API, you can disable this rule.

## Further Reading

- [Zod - UUIDs](https://zod.dev/api#uuids)
