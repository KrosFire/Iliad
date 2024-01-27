import { Schema } from 'electron-store'

import { KNOWN_LANGUAGES } from '../../fileExtensions/Languages'
import { WorkspaceStore } from '../workspace'

const workspaceSchema = (workspacePath: string): Schema<WorkspaceStore> => ({
  workspace: {
    type: ['string', 'null'],
    default: 'home-window',
  },
  files: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      path: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      dir: {
        type: 'string',
      },
      lang: {
        type: 'string',
        enum: KNOWN_LANGUAGES,
      },
      encoding: {
        type: 'string',
      },
      editorContent: {
        type: 'string',
      },
      removed: {
        type: 'boolean',
      },
      saved: {
        type: 'boolean',
      },
    },
    default: {},
  },
  windows: {
    type: 'object',
    patternProperties: {
      '.+': {
        type: 'object',
        properties: {
          __typename: {
            type: 'string',
            enum: ['ContainerWindow', 'TabsWindow'],
          },
          id: {
            type: 'string',
          },
          tabs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                __typename: {
                  type: 'string',
                  enum: ['FileTab', 'PageTab'],
                },
                id: {
                  type: 'string',
                },
              },
            },
          },
          children: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          parent: {
            type: ['string', 'null'],
          },
          active: {
            type: 'number',
          },
        },
      },
    },
    default: {
      'home-window': {
        __typename: 'TabsWindow',
        id: 'home-window',
        tabs: [
          {
            __typename: 'PageTab',
            id: 'Home',
          },
        ],
        active: 0,
        parent: null,
      },
    },
  },
  active: {
    type: ['string', 'null'],
    default: null,
  },
  fileSystem: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      parent: {
        type: 'string',
      },
      open: {
        type: 'boolean',
      },
      openedChildren: {
        type: 'array',
      },
    },
    default: {
      path: workspacePath,
      openedChildren: [],
    },
  },
  selectedFsNodes: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        __typename: {
          type: 'string',
          enum: ['FileSystemFile', 'FileSystemDirectory'],
        },
        path: {
          type: 'string',
        },
        mass: {
          type: 'boolean',
        },
      },
    },
    default: [],
  },
  lastSelectedFsNode: {
    type: ['string', 'null'],
    default: null,
  },
})

export default workspaceSchema
