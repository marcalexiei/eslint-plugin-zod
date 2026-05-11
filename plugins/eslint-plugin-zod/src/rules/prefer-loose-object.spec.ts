import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferLooseObject } from './prefer-loose-object.js';

const ruleTester = new RuleTester();

ruleTester.run(preferLooseObject.name, preferLooseObject, {
  valid: [
    {
      name: 'looseObject is valid',
      code: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() });
      `,
    },
    {
      name: 'strictObject is valid',
      code: dedent`
        import { z } from 'zod';
        z.strictObject({ a: z.string() });
      `,
    },
    {
      name: 'object is valid',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() });
      `,
    },
    {
      name: 'object with strict is valid for this rule',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).strict();
      `,
    },
    {
      name: 'passthrough on schema variable is valid',
      code: dedent`
        import { z } from 'zod';
        const schema = z.object({ a: z.string() });
        schema.passthrough();
      `,
    },
  ],
  invalid: [
    {
      name: 'prefer looseObject over object().passthrough()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).passthrough();
      `,
      output: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() });
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject over object().describe().passthrough()',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).describe("desc").passthrough();
      `,
      output: dedent`
        import { z } from 'zod';
        z.looseObject({ a: z.string() }).describe("desc");
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'prefer looseObject for nested object schema',
      code: dedent`
        import { z } from 'zod';
        z.object({ nested: z.object({ a: z.string() }).passthrough() });
      `,
      output: dedent`
        import { z } from 'zod';
        z.object({ nested: z.looseObject({ a: z.string() }) });
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'passthrough with unexpected argument is reported without fix',
      code: dedent`
        import { z } from 'zod';
        z.object({ a: z.string() }).passthrough({ message: 'Custom message' });
      `,
      output: null,
      errors: [{ messageId: 'preferLooseObject' }],
    },
    {
      name: 'named imports',
      code: dedent`
        import { object, string } from 'zod';
        object({ a: string() }).passthrough();
      `,
      errors: [{ messageId: 'preferLooseObject' }],
    },
  ],
});
