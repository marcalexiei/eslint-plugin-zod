import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noPromiseSchema } from './no-promise-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noPromiseSchema.name, noPromiseSchema, {
  valid: [
    {
      name: 'namespace import with regular schema',
      code: dedent`
        import * as z from 'zod';
        z.string();
      `,
    },
    {
      name: 'default import with regular schema',
      code: dedent`
        import z from 'zod';
        z.string();
      `,
    },
    {
      name: 'named import with regular schema',
      code: dedent`
        import { string } from 'zod';
        string();
      `,
    },
    {
      name: 'named z import with regular schema',
      code: dedent`
        import { z } from 'zod';
        z.string();
      `,
    },
    {
      name: 'unrelated promise helper',
      code: dedent`
        import promise from 'something-else';
        promise(z.string());
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.promise(z.string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'default import',
      code: dedent`
        import z from 'zod';
        z.promise(z.string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'named import',
      code: dedent`
        import { promise, string } from 'zod';
        promise(string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'aliased named import',
      code: dedent`
        import { promise as zodPromise, string } from 'zod';
        zodPromise(string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.promise(z.string());
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'promise schema with chain method',
      code: dedent`
        import * as z from 'zod';
        z.promise(z.string()).optional();
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
    {
      name: 'promise schema inside object',
      code: dedent`
        import * as z from 'zod';
        z.object({ payload: z.promise(z.string()) });
      `,
      errors: [{ messageId: 'noPromiseSchema' }],
      output: null,
    },
  ],
});
