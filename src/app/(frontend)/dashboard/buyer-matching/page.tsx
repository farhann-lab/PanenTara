import config from '@payload-config'
import { getPayload } from 'payload'
import BuyerMatchingChat, {
  type ChatContact,
  type ChatMessage,
  type ChatRoom,
} from '@/components/panentara/dashboard/BuyerMatchingChat'
import { getCurrentUser, getDemoUser } from '@/lib/app-auth'

export default async function BuyerMatchingPage() {
  const sessionUser = await getCurrentUser()
  const user = sessionUser || (await getDemoUser())
  const isDemo = !sessionUser

  const payload = await getPayload({ config })

  // Daftar kontak (hanya field non-sensitif yang diteruskan ke klien, lihat toContact).
  const contactResult = await payload.find({
    collection: 'users',
    where: user.role ? { role: { not_equals: user.role } } : {},
    limit: 100,
    sort: 'name',
    overrideAccess: true,
  })

  // Percakapan & pesan HANYA untuk akun terdaftar, dan dibatasi oleh aturan akses
  // koleksi (hanya peserta). Tamu mode demo memakai simulasi di sisi klien, jadi
  // tidak boleh menerima data obrolan milik pengguna lain.
  const requestUser = sessionUser ? (sessionUser as never) : undefined
  const [conversationDocs, messageDocs] = sessionUser
    ? await Promise.all([
        payload
          .find({
            collection: 'conversations',
            sort: '-lastMessageAt',
            depth: 1,
            limit: 100,
            user: requestUser,
            overrideAccess: false,
          })
          .then((result) => result.docs),
        payload
          .find({
            collection: 'messages',
            sort: 'createdAt',
            depth: 1,
            limit: 500,
            user: requestUser,
            overrideAccess: false,
          })
          .then((result) => result.docs),
      ])
    : [[], []]

  const toContact = (value: (typeof contactResult.docs)[number]): ChatContact => ({
    id: String(value.id),
    name: value.name,
    role: value.role,
    companyName: value.companyName,
    location: value.location,
    commodities: value.commodities,
  })

  const contacts = contactResult.docs.map(toContact)
  const contactMap = new Map(contacts.map((contact) => [contact.id, contact]))

  const rooms: ChatRoom[] = conversationDocs.flatMap((conversation) => {
    const otherValue = conversation.participants.find(
      (participant) =>
        String(typeof participant === 'object' ? participant.id : participant) !== user.id,
    )
    if (!otherValue) return []

    const otherId = String(typeof otherValue === 'object' ? otherValue.id : otherValue)
    const expanded =
      typeof otherValue === 'object' ? toContact(otherValue) : contactMap.get(otherId)
    if (!expanded) return []

    return [
      {
        id: String(conversation.id),
        subject: conversation.subject,
        commodity: conversation.commodity,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        other: expanded,
      },
    ]
  })

  const messages: ChatMessage[] = messageDocs.map((message) => {
    const sender = typeof message.sender === 'object' ? message.sender : null
    const conversationId =
      typeof message.conversation === 'object' ? message.conversation.id : message.conversation

    return {
      id: String(message.id),
      conversationId: String(conversationId),
      senderId: String(sender?.id ?? message.sender),
      senderName: sender?.name ?? 'Pengguna PanenTara',
      body: message.body,
      createdAt: message.createdAt,
    }
  })

  return (
    <BuyerMatchingChat
      currentUser={{ id: user.id, name: user.name, role: user.role }}
      contacts={contacts}
      rooms={rooms}
      messages={messages}
      isDemo={isDemo}
    />
  )
}