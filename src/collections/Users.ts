import type { Access, CollectionConfig, FieldAccess, Where } from 'payload'

type AppUser = {
  id: string | number
  collection?: string
  role?: 'petani' | 'pembeli'
}

const appUser = (value: unknown): AppUser | null => {
  const user = value as AppUser | null
  return user?.collection === 'users' ? user : null
}

const readOwnEmail: FieldAccess = ({ id, req }) => {
  const user = appUser(req.user)
  return Boolean(user && String(user.id) === String(id))
}

const readProfiles: Access = ({ req }) => {
  const user = appUser(req.user)
  if (!user) return false
  if (!user.role) return { id: { equals: user.id } }

  const where: Where = {
    or: [{ id: { equals: user.id } }, { role: { not_equals: user.role } }],
  }
  return where
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    hidden: true,
    useAsTitle: 'name',
  },
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  access: {
    create: ({ req }) => req.context.publicRegistration === true,
    delete: () => false,
    read: readProfiles,
    update: ({ req }) => {
      const user = appUser(req.user)
      return user ? { id: { equals: user.id } } : false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 100,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Petani / Penjual', value: 'petani' },
        { label: 'Pembeli', value: 'pembeli' },
      ],
      access: {
        create: ({ req }) => req.context.publicRegistration === true,
        update: () => false,
      },
    },
    {
      name: 'companyName',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'location',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'phone',
      type: 'text',
      maxLength: 30,
    },
    {
      name: 'commodities',
      type: 'text',
      maxLength: 240,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'email',
      type: 'email',
      access: {
        read: readOwnEmail,
      },
      admin: {
        hidden: true,
      },
    },
  ],
  versions: false,
}
