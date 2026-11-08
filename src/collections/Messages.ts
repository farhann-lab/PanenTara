import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'

type AppUser = {
  id: string | number
  collection?: string
}

const getAppUser = (value: unknown): AppUser | null => {
  const user = value as AppUser | null
  return user?.collection === 'users' ? user : null
}

const participantAccess: Access = ({ req }) => {
  const user = getAppUser(req.user)
  return user ? { participants: { contains: user.id } } : false
}

const prepareMessage: CollectionBeforeValidateHook = async ({ data, req }) => {
  const user = getAppUser(req.user)
  const conversationId =
    typeof data?.conversation === 'object' &&
    data.conversation !== null &&
    'id' in data.conversation
      ? data.conversation.id
      : data?.conversation

  if (!user || req.context.chatAction !== true || !conversationId) {
    throw new Error('Pesan hanya dapat dikirim melalui ruang chat PanenTara.')
  }

  const conversation = await req.payload.findByID({
    collection: 'conversations',
    id: conversationId,
    overrideAccess: true,
  })

  const participantIds = conversation.participants.map((participant) =>
    typeof participant === 'object' ? participant.id : participant,
  )

  if (!participantIds.some((id) => String(id) === String(user.id))) {
    throw new Error('Anda bukan peserta percakapan ini.')
  }

  const body = typeof data?.body === 'string' ? data.body.trim() : ''
  if (!body || body.length > 2000) {
    throw new Error('Pesan harus berisi 1–2.000 karakter.')
  }

  return {
    ...data,
    body,
    participants: participantIds,
    sender: user.id,
  }
}

export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: {
    hidden: true,
    useAsTitle: 'body',
  },
  access: {
    create: ({ req }) => Boolean(getAppUser(req.user) && req.context.chatAction === true),
    delete: () => false,
    read: participantAccess,
    update: () => false,
  },
  hooks: {
    beforeValidate: [prepareMessage],
  },
  fields: [
    {
      name: 'conversation',
      type: 'relationship',
      relationTo: 'conversations',
      required: true,
      index: true,
      access: {
        create: ({ req }) => req.context.chatAction === true,
        update: () => false,
      },
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: {
        create: ({ req }) => req.context.chatAction === true,
        update: () => false,
      },
    },
    {
      name: 'participants',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      index: true,
      admin: {
        hidden: true,
      },
      access: {
        create: ({ req }) => req.context.chatAction === true,
        update: () => false,
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      maxLength: 2000,
    },
  ],
  timestamps: true,
  versions: false,
}
