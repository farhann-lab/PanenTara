import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

type AppUser = {
  id: string | number
  collection?: string
  role?: 'petani' | 'pembeli'
}

const getAppUser = (value: unknown): AppUser | null => {
  const user = value as AppUser | null
  return user?.collection === 'users' ? user : null
}

const participantAccess: Access = ({ req }) => {
  const user = getAppUser(req.user)
  return user ? { participants: { contains: user.id } } : false
}

const validateParticipants: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const user = getAppUser(req.user)
  const participantIds: unknown[] = Array.isArray(data?.participants)
    ? data.participants
    : Array.isArray(originalDoc?.participants)
      ? originalDoc.participants
      : []

  if (!user || req.context.chatAction !== true) {
    throw new Error('Percakapan hanya dapat dibuat melalui ruang chat PanenTara.')
  }

  const normalizedIds = participantIds.map((participant) =>
    typeof participant === 'object' && participant !== null && 'id' in participant
      ? String(participant.id)
      : String(participant),
  )

  if (
    normalizedIds.length !== 2 ||
    new Set(normalizedIds).size !== 2 ||
    !normalizedIds.includes(String(user.id))
  ) {
    throw new Error('Percakapan harus memiliki tepat dua peserta, termasuk akun Anda.')
  }

  const participants = await Promise.all(
    normalizedIds.map((id) =>
      req.payload.findByID({
        collection: 'users',
        id,
        overrideAccess: true,
      }),
    ),
  )

  const roles = new Set(participants.map((participant) => participant.role))
  if (!roles.has('petani') || !roles.has('pembeli')) {
    throw new Error('Ruang chat hanya dapat dibuat antara petani dan pembeli.')
  }

  return operation === 'create' ? { ...data, participants: normalizedIds } : data
}

export const Conversations: CollectionConfig = {
  slug: 'conversations',
  admin: {
    hidden: true,
    useAsTitle: 'subject',
  },
  access: {
    create: ({ req }) => Boolean(getAppUser(req.user) && req.context.chatAction === true),
    delete: () => false,
    read: participantAccess,
    update: ({ req }) => {
      const user = getAppUser(req.user)
      return user && req.context.chatAction === true
        ? { participants: { contains: user.id } }
        : false
    },
  },
  hooks: {
    beforeValidate: [validateParticipants],
  },
  fields: [
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      minRows: 2,
      maxRows: 2,
      index: true,
      access: {
        create: ({ req }) => req.context.chatAction === true,
        update: () => false,
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      maxLength: 140,
    },
    {
      name: 'commodity',
      type: 'text',
      maxLength: 80,
    },
    {
      name: 'lastMessage',
      type: 'text',
      maxLength: 240,
      access: {
        create: ({ req }) => req.context.chatAction === true,
        update: ({ req }) => req.context.chatAction === true,
      },
    },
    {
      name: 'lastMessageAt',
      type: 'date',
      index: true,
      access: {
        create: ({ req }) => req.context.chatAction === true,
        update: ({ req }) => req.context.chatAction === true,
      },
    },
  ],
  timestamps: true,
  versions: false,
}
