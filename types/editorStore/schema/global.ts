import { z } from 'zod'

import { GlobalStore } from '../global'

const schema: z.ZodDefault<z.ZodType<GlobalStore>> = z
  .object({
    lastWorkspacePaths: z.array(z.string()),
  })
  .default({
    lastWorkspacePaths: [],
  })

export default schema
