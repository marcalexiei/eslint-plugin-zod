import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noStringSchemaWithUuid } from './no-string-schema-with-uuid.js';

const ruleTester = new RuleTester();

ruleTester.run('no-string-schema-with-uuid', noStringSchemaWithUuid, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { uuid } from 'zod';
        uuid();
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'uuid + chain method',
      code: dedent`
        import * as z from 'zod';
        z.uuid().optional();
      `,
    },
    {
      name: 'string without .uuid()',
      code: dedent`
        import * as z from 'zod';
        z.string().optional();
      `,
    },
    {
      name: 'unrelated to zod',
      code: 'something.string().uuid()',
    },
    {
      name: 'nested valid usage',
      code: dedent`
        import * as z from 'zod';
        z.object({ id: z.uuid(), name: z.string() });
      `,
    },
  ],
  invalid: [
    {
      name: 'string + uuid (namespace import)',
      code: `
        import * as z from 'zod';
        z.string().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: `
        import * as z from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'string + uuid (named import)',
      code: `
        import { string } from 'zod';
        string().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: null,
    },
    {
      name: 'string + uuid (named z import)',
      code: `
        import { z } from 'zod';
        z.string().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: `
        import { z } from 'zod';
        z.uuid();
      `,
    },
    {
      name: 'string + uuid + other method',
      code: `
        import * as z from 'zod';
        z.string().uuid().optional();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: `
        import * as z from 'zod';
        z.uuid().optional();
      `,
    },
    {
      name: 'string + other method + uuid',
      code: `
        import * as z from 'zod';
        z.string().optional().uuid();
      `,
      errors: [{ messageId: 'useUuid' }],
      output: `
        import * as z from 'zod';
        z.uuid().optional();
      `,
    },
    {
      name: 'nested in object',
      code: `
        import * as z from 'zod';
        z.object({ id: z.string().uuid() });
      `,
      errors: [{ messageId: 'useUuid' }],
      output: `
        import * as z from 'zod';
        z.object({ id: z.uuid() });
      `,
    },
  ],
});
