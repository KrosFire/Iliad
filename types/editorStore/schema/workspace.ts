import { Direction, FileEncodings, KnownLanguages } from '~/types'
import { z } from 'zod'

import { OpenedDirectory, WorkspaceStore } from '../workspace'

const fileSystemSchema: z.ZodType<OpenedDirectory> = z.object({
  path: z.string(),
  name: z.string(),
  parent: z.string(),
  open: z.boolean(),
  openedChildren: z.lazy(() => fileSystemSchema.array()),
})

const schema: z.ZodDefault<z.ZodType<WorkspaceStore>> = z
  .object({
    workspace: z.string().nullable(),
    files: z.record(
      z.string(),
      z.object({
        id: z.string(),
        path: z.string(),
        title: z.string(),
        dir: z.string(),
        lang: z.nativeEnum(KnownLanguages).nullable(),
        encoding: z.nativeEnum(FileEncodings),
        editorContent: z.string(),
        removed: z.boolean(),
        saved: z.boolean(),
      }),
    ),
    windows: z.record(
      z.string(),
      z.discriminatedUnion('__typename', [
        z.object({
          __typename: z.literal('ContainerWindow'),
          id: z.string(),
          children: z.array(z.string()),
          parent: z.string().nullable(),
          direction: z.nativeEnum(Direction),
        }),
        z.object({
          __typename: z.literal('TabsWindow'),
          id: z.string(),
          tabs: z.array(
            z.object({
              __typename: z.enum(['FileTab', 'PageTab']),
              id: z.string(),
            }),
          ),
          parent: z.string().nullable(),
          active: z.number(),
        }),
      ]),
    ),
    active: z.string().nullable(),
    fileSystem: fileSystemSchema.nullable(),
    selectedFsNodes: z.array(
      z.object({
        __typename: z.enum(['FileSystemFile', 'FileSystemDirectory']),
        path: z.string(),
        mass: z.boolean(),
      }),
    ),
    lastSelectedFsNode: z.string().nullable(),
  })
  .default({
    workspace: null,
    files: {},
    windows: {},
    active: null,
    fileSystem: null,
    selectedFsNodes: [],
    lastSelectedFsNode: null,
  })

export default schema
