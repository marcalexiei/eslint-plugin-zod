# zod/prefer-top-level-string-formats

📝 Prefer top-level string format schemas over deprecated `z.string().<format>()` methods.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

## Rule Details

This rule prefers Zod 4's top-level string format APIs over chained `z.string().<format>()` calls.

It applies to these methods: `.base64()`, `.base64url()`, `.cidrv4()`, `.cidrv6()`, `.cuid()`, `.cuid2()`, `.date()`, `.datetime()`, `.duration()`, `.e164()`, `.email()`, `.emoji()`, `.guid()`, `.ipv4()`, `.ipv6()`, `.jwt()`, `.ksuid()`, `.nanoid()`, `.time()`, `.ulid()`, `.url()`, `.uuid()`, `.uuidv4()`, `.uuidv6()`, `.uuidv7()`, and `.xid()`.

Each deprecated chain is replaced by its corresponding top-level schema from the list above. Methods with the same name map directly to `z.<method>()`; `date()`, `datetime()`, `duration()`, and `time()` map to `z.iso.date()`, `z.iso.datetime()`, `z.iso.duration()`, and `z.iso.time()`.

## Options

This rule accepts an object with an optional `ignore` array.

Use `ignore` when you want to skip specific format methods:

```js
{
  rules: {
    'zod/prefer-top-level-string-formats': ['error', {
      ignore: ['email', 'url'],
    }],
  },
}
```

## Examples

### ❌ Invalid

```ts
const emailSchema = z.string().email();
const dateSchema = z.string().date();
const urlSchema = z.string().url();
```

### ✅ Valid

```ts
const emailSchema = z.email();
const dateSchema = z.iso.date();
const urlSchema = z.url();
```

### ✅ Valid With `ignore`

```ts
// eslint zod/prefer-top-level-string-formats: ['error', { ignore: ['email'] }]
const emailSchema = z.string().email();
const urlSchema = z.url();
```

## When Not To Use It

If you prefer the chained form or need to support an older Zod API, you can disable this rule or ignore specific methods.

## Further Reading

- [Zod - Top-level string formats](https://zod.dev/v4?id=top-level-string-formats)
