'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { getCurrentUser, getDemoUser, setDemoRole } from '@/lib/app-auth'

export type ChatActionResult = {
  ok: boolean
  message: string
  conversationId?: string
}

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

export async function switchDemoPersona(role: 'petani' | 'pembeli'): Promise<{ ok: boolean }> {
  await setDemoRole(role)
  return { ok: true }
}

export async function startConversation(input: {
  recipientId: string
  subject: string
  commodity?: string
  openingMessage?: string
}): Promise<ChatActionResult> {
  const user = (await getCurrentUser()) || (await getDemoUser())
  if (!user) return { ok: false, message: 'Silakan masuk untuk memulai percakapan.' }

  const recipientId = cleanText(input.recipientId, 100)
  const subject = cleanText(input.subject, 140)
  const commodity = cleanText(input.commodity, 80)
  const openingMessage = cleanText(input.openingMessage, 2000)

  if (!recipientId || !subject) {
    return { ok: false, message: 'Pembeli dan topik percakapan wajib diisi.' }
  }
  if (recipientId === user.id) {
    return { ok: false, message: 'Anda tidak dapat membuat percakapan dengan diri sendiri.' }
  }

  // Demo / Catalog room fallback for instant demo feedback
  const isDemoMode = user.id.startsWith('demo-') || recipientId.startsWith('catalog-') || recipientId.startsWith('demo-')
  if (isDemoMode) {
    const syntheticRoomId = recipientId.startsWith('catalog-')
      ? `room-${recipientId}`
      : `room-demo-${recipientId}`
    return {
      ok: true,
      message: 'Ruang negosiasi siap digunakan.',
      conversationId: syntheticRoomId,
    }
  }

  const payload = await getPayload({ config })

  try {
    const recipient = await payload.findByID({
      collection: 'users',
      id: recipientId,
      overrideAccess: true,
    })

    if (recipient.role === user.role) {
      return { ok: false, message: 'Ruang chat harus menghubungkan petani dan pembeli.' }
    }

    const existing = await payload.find({
      collection: 'conversations',
      where: {
        and: [{ participants: { contains: user.id } }, { participants: { contains: recipientId } }],
      },
      limit: 1,
      overrideAccess: true,
    })

    let conversationId = existing.docs[0]?.id

    if (!conversationId) {
      const conversation = await payload.create({
        collection: 'conversations',
        data: {
          participants: [user.id, recipientId],
          subject,
          commodity: commodity || undefined,
          lastMessage: openingMessage || undefined,
          lastMessageAt: openingMessage ? new Date().toISOString() : undefined,
        },
        context: { chatAction: true },
        overrideAccess: true,
      })
      conversationId = conversation.id
    }

    if (openingMessage) {
      await payload.create({
        collection: 'messages',
        data: {
          conversation: conversationId,
          sender: user.id,
          participants: [user.id, recipientId],
          body: openingMessage,
        },
        context: { chatAction: true },
        overrideAccess: true,
      })
    }

    return {
      ok: true,
      message: existing.docs[0] ? 'Percakapan dibuka kembali.' : 'Ruang chat berhasil dibuat.',
      conversationId: String(conversationId),
    }
  } catch {
    return { ok: false, message: 'Ruang chat belum dapat dibuat. Silakan coba lagi.' }
  }
}

export async function sendMessage(input: {
  conversationId: string
  body: string
}): Promise<ChatActionResult> {
  const user = (await getCurrentUser()) || (await getDemoUser())
  if (!user) return { ok: false, message: 'Sesi Anda berakhir. Silakan masuk kembali.' }

  const conversationId = cleanText(input.conversationId, 100)
  const body = cleanText(input.body, 2000)
  if (!conversationId || !body) {
    return { ok: false, message: 'Pesan tidak boleh kosong.' }
  }

  // Demo room fallback
  const isDemoMessage = user.id.startsWith('demo-') || conversationId.startsWith('room-') || conversationId.startsWith('demo-')
  if (isDemoMessage) {
    return { ok: true, message: 'Pesan terkirim (Mode Demo).', conversationId }
  }

  const payload = await getPayload({ config })

  try {
    const conversation = await payload.findByID({
      collection: 'conversations',
      id: conversationId,
      overrideAccess: true,
    })

    const participants = conversation.participants.map((participant) =>
      typeof participant === 'object' ? participant.id : participant,
    )

    await payload.create({
      collection: 'messages',
      data: {
        conversation: conversation.id,
        sender: user.id,
        participants,
        body,
      },
      context: { chatAction: true },
      overrideAccess: true,
    })

    await payload.update({
      collection: 'conversations',
      id: conversation.id,
      data: {
        lastMessage: body.slice(0, 240),
        lastMessageAt: new Date().toISOString(),
      },
      context: { chatAction: true },
      overrideAccess: true,
    })

    return { ok: true, message: 'Pesan terkirim.', conversationId }
  } catch {
    return { ok: false, message: 'Pesan gagal dikirim. Silakan coba lagi.' }
  }
}
