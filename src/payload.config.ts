// KONFIGURASI LOKAL (tanpa Figma Cloud) — PostgreSQL + penyimpanan file lokal.
// Simpan versi lama sebagai src/payload.config.figma.ts sebelum menimpa file ini.
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { en as adminLanguage } from '@payloadcms/translations/languages/en'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Conversations } from './collections/Conversations'
import { Messages } from './collections/Messages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const databaseURL = process.env.DATABASE_URL
const payloadSecret = process.env.PAYLOAD_SECRET

if (!databaseURL) throw new Error('DATABASE_URL belum diisi di file .env')
if (!payloadSecret) throw new Error('PAYLOAD_SECRET belum diisi di file .env')

export default buildConfig({
  secret: payloadSecret,
  db: postgresAdapter({
    pool: { connectionString: databaseURL },
    // Di mode development, tabel dibuat/disinkronkan otomatis (push).
    // Untuk produksi, gunakan migrasi: pnpm payload migrate:create
  }),
  editor: lexicalEditor(),
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    dashboard: {
      widgets: [],
      defaultLayout: [
        { widgetSlug: 'activity', width: 'full' },
        { widgetSlug: 'collections', width: 'full' },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en: adminLanguage },
  },
  collections: [Admins, Media, Folders, Tags, Users, Conversations, Messages],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  plugins: [mcpPlugin({})],
})