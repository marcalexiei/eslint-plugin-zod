import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithSafe } from './no-number-schema-with-safe.js';

const ruleTester = new RuleTester();

ruleTester.run('no-number-schema-with-safe', noNumberSchemaWithSafe, {
  valid: [
    {
      name: 'z.int()',
      code: dedent`
        import * as z from 'zod';
        z.int();
      `,
    },
  ],
  invalid: [
    {
      name: 'z.number().safe()',
      code: dedent`
        import * as z from 'zod';
        z.number().safe();
      `,
      errors: [{ messageId: 'useInt' }],
      output: dedent`
        import * as z from 'zod';
        z.int();
      `,
    },
    {
      name: 'z.number().safe with message',
      code: dedent`
        import * as z from 'zod';
        z.number().safe('nope');
      `,
      errors: [{ messageId: 'useInt' }],
      output: dedent`
        import * as z from 'zod';
        z.int('nope');
      `,
    },
    {
      name: 'named import number().safe() — no fix',
      code: dedent`
        import { number } from 'zod';
        number().safe();
      `,
      errors: [{ messageId: 'useInt' }],
      output: null,
    },
  ],
});
