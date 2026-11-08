import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    // File unggahan disimpan di folder "media" pada root project (lokal).
    staticDir: path.resolve(dirname, '../../media'),
  },
}