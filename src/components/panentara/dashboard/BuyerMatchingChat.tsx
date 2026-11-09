'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage, startConversation } from '@/app/(frontend)/dashboard/buyer-matching/actions'

export type ChatContact = {
  id: string
  name: string
  role: 'petani' | 'pembeli'
  companyName?: string | null
  location?: string | null
  commodities?: string | null
}

export type ChatRoom = {
  id: string
  subject: string
  commodity?: string | null
  lastMessage?: string | null
  lastMessageAt?: string | null
  other: ChatContact
}

export type ChatMessage = {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  body: string
  createdAt: string
}

export type ContractType = 'Kontrak Rutin' | 'Off-taker Industri' | 'Spot Order' | 'Horeka Mitra'

export type BuyerCatalogItem = {
  id: string
  companyName: string
  companyType: string
  verifiedBadge: string
  commodity: string
  variety: string
  demandVolume: string
  contractType: ContractType
  targetPriceRange: string
  deliveryLocation: string
  deliveryTerms: string
  aiMatchScore: number
  matchReason: string
  qualityCriteria: string[]
  paymentTerms: string
  estimatedValue: string
  urgency: 'Mendesak' | 'Terbuka' | 'Segera Panen'
  suggestedOffer: string
  contactPerson: string
  recipientUserId?: string
}

export type FarmerSupplyItem = {
  id: string
  farmerName: string
  groupName: string
  location: string
  commodity: string
  variety: string
  projectedVolume: string
  harvestDate: string
  askingPrice: string
  farmSize: string
  qualityGrade: string
  aiMatchScore: number
  suggestedMessage: string
}

type Props = {
  currentUser: {
    id: string
    name: string
    role: 'petani' | 'pembeli'
  }
  contacts: ChatContact[]
  rooms: ChatRoom[]
  messages: ChatMessage[]
  isDemo?: boolean
}

type ContractFilter = 'Semua' | ContractType

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const formatTime = (value?: string | null) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

// Room lokal (dibuat di browser, belum tentu ada di database).
// ID room asli dari database berbentuk uuid dan tidak diawali "room-".
const isLocalRoomId = (id: string) => id.startsWith('room-')

// Room yang hanya simulasi: sesi demo atau kartu katalog statis. Tidak pernah disimpan ke database.
const isSimulatedRoomId = (id: string) => id.startsWith('room-catalog-') || id.startsWith('room-demo-')

const CURATED_BUYER_CATALOG: BuyerCatalogItem[] = [
  {
    id: 'catalog-buyer-segar',
    companyName: 'PT Segar Nusantara Retail',
    companyType: 'Jaringan Supermarket Modern',
    verifiedBadge: 'Mitra Prioritas Terverifikasi',
    commodity: 'Cabai Merah Keriting',
    variety: 'Varietas Kencana & Lado Grade A',
    demandVolume: '3,5 Ton / minggu',
    contractType: 'Kontrak Rutin',
    targetPriceRange: 'Rp 32.000 – Rp 35.000 / kg',
    deliveryLocation: 'Hub Kramat Jati, Jakarta Timur',
    deliveryTerms: 'Franco Gudang Pembeli',
    aiMatchScore: 98,
    matchReason: 'Kecocokan 98% dengan jadwal panen Cabai Merah Anda & kesesuaian mutu Grade A',
    qualityCriteria: [
      'Grade A Super (panjang 12-15 cm)',
      'Kadar air maks. 12%, kesegaran min. 90%',
      'Bebas bercak patek / antraknosa',
      'Kemasan krat plastik standar food grade',
    ],
    paymentTerms: 'H+2 setelah timbang & QC lolos via Escrow PanenTara',
    estimatedValue: 'Rp 115.500.000 / bulan',
    urgency: 'Mendesak',
    suggestedOffer:
      'Halo PT Segar Nusantara, kami memiliki pasokan Cabai Merah Keriting Grade A siap panen 3,5 Ton di Malang. Standar mutu sesuai spesifikasi Anda. Bisakah kita jadwalkan negosiasi pengiriman ke Kramat Jati?',
    contactPerson: 'Bambang Irawan (Procurement Manager)',
  },
  {
    id: 'catalog-buyer-berkah',
    companyName: 'CV Berkah Pangan Mandiri',
    companyType: 'Industri Bumbu & Saus Olahan',
    verifiedBadge: 'Off-taker Resmi Pabrik',
    commodity: 'Bawang Merah Bima Brebes',
    variety: 'Bima Curut & Tajuk Kering Simpan',
    demandVolume: '8 Ton / bulan',
    contractType: 'Off-taker Industri',
    targetPriceRange: 'Rp 26.000 – Rp 29.500 / kg',
    deliveryLocation: 'Kawasan Industri Kendal, Jawa Tengah',
    deliveryTerms: 'Franco Pabrik / Loco Gudang Tani',
    aiMatchScore: 94,
    matchReason: 'Kebutuhan bahan baku pabrik berskala besar cocok untuk kontrak musiman stabil',
    qualityCriteria: [
      'Kering simpan (kadar air < 15%)',
      'Diameter umbi 2,5 – 3,5 cm seragam',
      'Bebas busuk umbi dan bebas jamur fusarium',
      'Packing karung waring 50 kg berlabel',
    ],
    paymentTerms: 'DP 30% panen muat, pelunasan saat timbangan pabrik selesai',
    estimatedValue: 'Rp 220.000.000 / bulan',
    urgency: 'Terbuka',
    suggestedOffer:
      'Halo CV Berkah Pangan Mandiri, kami memiliki Bawang Merah Bima Brebes panen kering simpan dengan estimasi 8 Ton. Kami siap memenuhi spesifikasi mutu industri bumbu Anda. Apakah harga Rp 28.500/kg bisa disepakati?',
    contactPerson: 'Siti Rahmawati (Head of Supply Chain)',
  },
  {
    id: 'catalog-buyer-sayurindo',
    companyName: 'PT Sumber Sayur Indo',
    companyType: 'Aggregator & Eksportir Hortikultura',
    verifiedBadge: 'Eksportir Terakreditasi',
    commodity: 'Tomat Beef & Cherry',
    variety: 'Tomat Beef Servo & Cherry Ruby',
    demandVolume: '2 Ton / minggu',
    contractType: 'Kontrak Rutin',
    targetPriceRange: 'Rp 16.000 – Rp 19.500 / kg',
    deliveryLocation: 'Packing House Lembang, Bandung Barat',
    deliveryTerms: 'Franco Packing House',
    aiMatchScore: 91,
    matchReason: 'Standar pasar premium Singapura & Horeka dengan kepastian serap tinggi tiap minggu',
    qualityCriteria: [
      'Warna merah 70-80% (matang petik simpan)',
      'Bobot 120-150 gram/buah seragam',
      'Sertifikat GAP / Prima 3 diutamakan',
      'Bebas residu pestisida berlebih',
    ],
    paymentTerms: 'H+3 transfer bank resmi setelah sorting dan grading',
    estimatedValue: 'Rp 144.000.000 / bulan',
    urgency: 'Segera Panen',
    suggestedOffer:
      'Halo PT Sumber Sayur Indo, kebun kami di dataran tinggi siap panen Tomat Beef standar ekspor 2 Ton/minggu. Kami memiliki sertifikat GAP Prima 3. Mohon konfirmasi jadwal penerimaan di Lembang.',
    contactPerson: 'David Setiawan (Export Quality Officer)',
  },
  {
    id: 'catalog-buyer-agrofresh',
    companyName: 'Agro Fresh Mart Jawa Timur',
    companyType: 'Rantai Swalayan Regional (14 Cabang)',
    verifiedBadge: 'Supermarket Mitra Lokal',
    commodity: 'Jagung Manis Hibrida',
    variety: 'Talenta & Bonanza F1 Super',
    demandVolume: '2,5 Ton / 3 hari',
    contractType: 'Spot Order',
    targetPriceRange: 'Rp 7.800 – Rp 8.900 / kg',
    deliveryLocation: 'Pasar Induk Puspa Agro Sidoarjo, Jatim',
    deliveryTerms: 'Franco Gudang Puspa Agro',
    aiMatchScore: 89,
    matchReason: 'Jarak logistik sangat dekat (< 75 km) memungkinkan panen subuh kirim siang',
    qualityCriteria: [
      'Panen pagi jam 05.00–08.00 langsung kirim',
      'Tingkat kemanisan brix > 12',
      'Tongkol terisi penuh tanpa ompong',
      'Klobot hijau segar 2 lapis',
    ],
    paymentTerms: 'Cash on Delivery (COD) langsung saat timbang gudang',
    estimatedValue: 'Rp 65.000.000 / bulan',
    urgency: 'Mendesak',
    suggestedOffer:
      'Halo Agro Fresh Mart, kami memiliki lahan Jagung Manis Bonanza F1 di Malang siap panen 2,5 Ton per 3 hari dengan brix manis 13+. Kami siap antar langsung ke Puspa Agro.',
    contactPerson: 'Wahyu Hidayat (Regional Buyer Jatim)',
  },
  {
    id: 'catalog-buyer-logistik',
    companyName: 'PT Tani Berkah Logistik',
    companyType: 'Distributor Beras & Pangan Nasional',
    verifiedBadge: 'Distributor Pangan Resmi',
    commodity: 'Beras Premium Pandan Wangi',
    variety: 'Pandan Wangi Cianjur & Mentik Wangi',
    demandVolume: '15 Ton / bulan',
    contractType: 'Kontrak Rutin',
    targetPriceRange: 'Rp 13.800 – Rp 14.600 / kg',
    deliveryLocation: 'Pergudangan Cipinang, Jakarta Timur',
    deliveryTerms: 'Franco Gudang Cipinang',
    aiMatchScore: 86,
    matchReason: 'Kontrak jangka panjang pasokan ritel DKI Jakarta dengan kontinuitas terjamin',
    qualityCriteria: [
      'Derajat sosoh minimal 95%',
      'Butir patah (broken) maksimal 10%',
      'Wangi pandan alami tanpa pemutih & pengawet',
      'Kadar air teruji maksimal 14%',
    ],
    paymentTerms: 'Termin H+7 via transfer bank setelah inspeksi tera digital',
    estimatedValue: 'Rp 214.000.000 / bulan',
    urgency: 'Terbuka',
    suggestedOffer:
      'Halo PT Tani Berkah Logistik, penggilingan gabah kami siap menyediakan pasokan Beras Pandan Wangi murni 15 Ton per bulan dengan derajat sosoh 95% dan kadar air 13,5%. Mari kita sepakati kontrak pasokannya.',
    contactPerson: 'Indra Gunawan (Direktur Logistik)',
  },
  {
    id: 'catalog-buyer-horeka',
    companyName: 'Hotel & Resto Sentosa Group',
    companyType: 'Jaringan Hotel Bintang & Katering',
    verifiedBadge: 'Horeka Mitra Eksklusif',
    commodity: 'Jahe Merah & Bawang Putih',
    variety: 'Jahe Merah Super & Bawang Putih Tunggal',
    demandVolume: '1,2 Ton / 2 minggu',
    contractType: 'Horeka Mitra',
    targetPriceRange: 'Rp 29.000 – Rp 33.000 / kg',
    deliveryLocation: 'Central Kitchen Denpasar & Surabaya',
    deliveryTerms: 'Franco Dapur Sentral',
    aiMatchScore: 84,
    matchReason: 'Harga beli premium stabil untuk kebutuhan bahan baku minuman herbal & katering hotel',
    qualityCriteria: [
      'Rimpang jahe merah tua umur > 9 bulan',
      'Bersih dari tanah, bebas busuk rimpang',
      'Aroma tajam pedas khas jahe merah asli',
      'Kemasan jaring ventilasi 25 kg',
    ],
    paymentTerms: 'H+5 setelah invoice terverifikasi chef eksekutif',
    estimatedValue: 'Rp 37.000.000 / bulan',
    urgency: 'Terbuka',
    suggestedOffer:
      'Halo Sentosa Group, kebun kami memproduksi Jahe Merah rimpang tua umur 10 bulan dengan kadar minyak atsiri tinggi. Siap suplai rutin 1,2 Ton per 2 minggu ke Surabaya / Denpasar.',
    contactPerson: 'Chef Adrian (Executive Kitchen Coordinator)',
  },
]

const CURATED_FARMER_SUPPLIES: FarmerSupplyItem[] = [
  {
    id: 'farmer-makmur',
    farmerName: 'Budi Santoso',
    groupName: 'Kelompok Tani Makmur Subur',
    location: 'Karangploso, Malang, Jawa Timur',
    commodity: 'Cabai Merah Keriting',
    variety: 'Lado F1 Super',
    projectedVolume: '4 Ton',
    harvestDate: '15–20 November 2026 (Siap Panen)',
    askingPrice: 'Rp 32.500 / kg',
    farmSize: '2,5 Hektar',
    qualityGrade: 'Grade A Super (Sertifikat GAP Prima 3)',
    aiMatchScore: 98,
    suggestedMessage:
      'Halo Pak Budi, kami dari pihak pembeli berminat meninjau komoditas Cabai Merah Keriting 4 Ton di Malang. Apakah bisa kami jadwalkan visit kebun sebelum panen?',
  },
  {
    id: 'farmer-brebes',
    farmerName: 'H. Slamet Riyadi',
    groupName: 'Gapoktan Sumber Makmur Brebes',
    location: 'Larangan, Brebes, Jawa Tengah',
    commodity: 'Bawang Merah Bima Super',
    variety: 'Bima Curut Brebes Asli',
    projectedVolume: '12 Ton',
    harvestDate: '22–27 November 2026',
    askingPrice: 'Rp 27.000 / kg',
    farmSize: '6 Hektar (Gudang Instore Drying)',
    qualityGrade: 'Kering Simpan Super (Kadar Air 14%)',
    aiMatchScore: 95,
    suggestedMessage:
      'Halo Pak H. Slamet, kami butuh pasokan Bawang Merah Brebes 8-10 Ton untuk pabrik saus kami. Apakah harga penawaran Rp 27.000/kg franco pabrik bisa dinegosiasikan?',
  },
  {
    id: 'farmer-lembang',
    farmerName: 'Asep Saepudin',
    groupName: 'Tani Unggul Lembang Greenhouse',
    location: 'Cikole, Lembang, Jawa Barat',
    commodity: 'Tomat Beef & Paprika Merah',
    variety: 'Beef Servo & Red Bell Pepper',
    projectedVolume: '2 Ton / minggu (Panen Rutin)',
    harvestDate: 'Rutin Setiap Senin & Kamis',
    askingPrice: 'Rp 17.500 / kg',
    farmSize: '1,8 Hektar Smart Greenhouse',
    qualityGrade: 'Grade Ekspor (Mulus Bebas Pestisida Kimia)',
    aiMatchScore: 92,
    suggestedMessage:
      'Halo Kang Asep, kami dari jaringan supermarket ingin kontrak pasokan rutin Tomat Beef 2 Ton per minggu. Mohon informasi sampel dan kepastian pengiriman.',
  },
]

const COMMODITY_OPTIONS = ['Semua', 'Cabai Merah', 'Bawang Merah', 'Jagung', 'Tomat', 'Beras', 'Jahe']

export default function BuyerMatchingChat({
  currentUser,
  contacts,
  rooms: initialRooms,
  messages: initialMessages,
  isDemo = false,
}: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'catalog' | 'chat' | 'split'>('catalog')
  const [rooms, setRooms] = useState<ChatRoom[]>(initialRooms)
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0]?.id ?? '')
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<BuyerCatalogItem | null>(null)
  const [specModalItem, setSpecModalItem] = useState<BuyerCatalogItem | null>(null)

  // Search & filter state
  const [search, setSearch] = useState('')
  const [selectedCommodity, setSelectedCommodity] = useState('Semua')
  const [selectedContractType, setSelectedContractType] = useState<ContractFilter>('Semua')
  const [highMatchOnly, setHighMatchOnly] = useState(false)
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')
  const [isPending, startTransition] = useTransition()

  // Gabungkan data server dengan room lokal. Room lokal yang belum tersimpan (room-*)
  // dipertahankan, sehingga room yang baru dibuat tidak hilang saat data server diperbarui.
  useEffect(() => {
    setRooms((prev) => {
      const localOnly = prev.filter(
        (room) => isLocalRoomId(room.id) && !initialRooms.some((serverRoom) => serverRoom.id === room.id),
      )
      return [...localOnly, ...initialRooms]
    })
  }, [initialRooms])

  useEffect(() => {
    setMessages((prev) => {
      const localOnly = prev.filter(
        (message) => !initialMessages.some((serverMessage) => serverMessage.id === message.id),
      )
      return [...initialMessages, ...localOnly]
    })
  }, [initialMessages])

  // Pilih room pertama jika belum ada room yang aktif.
  useEffect(() => {
    if (!activeRoomId && rooms[0]?.id) {
      setActiveRoomId(rooms[0].id)
    }
  }, [rooms, activeRoomId])

  // Katalog: kartu statis + pembeli terdaftar dari database.
  const catalogDemands = useMemo(() => {
    const list = [...CURATED_BUYER_CATALOG]
    contacts
      .filter((contact) => contact.role === 'pembeli')
      .forEach((buyerUser) => {
        const displayName = buyerUser.companyName || buyerUser.name
        const alreadyExists = list.some(
          (item) => item.companyName.toLowerCase() === displayName.toLowerCase(),
        )
        if (!alreadyExists) {
          list.unshift({
            id: `db-buyer-${buyerUser.id}`,
            companyName: displayName,
            companyType: 'Pembeli Terdaftar PanenTara',
            verifiedBadge: 'Akun Terverifikasi',
            commodity: buyerUser.commodities || 'Cabai Merah & Bawang Merah',
            variety: 'Varietas Unggul Lokal',
            demandVolume: '2 Ton / minggu',
            contractType: 'Kontrak Rutin',
            targetPriceRange: 'Rp 31.000 – Rp 34.500 / kg',
            deliveryLocation: buyerUser.location || 'Malang, Jawa Timur',
            deliveryTerms: 'Franco Hub Distribusi',
            aiMatchScore: 96,
            matchReason: 'Mitra aktif di sistem dengan preferensi komoditas sesuai profil Anda',
            qualityCriteria: ['Mutu super siap pasar', 'Kadar air normal panen', 'Bebas cacat fisik parah'],
            paymentTerms: 'Escrow PanenTara H+1',
            estimatedValue: 'Rp 64.000.000 / bulan',
            urgency: 'Mendesak',
            suggestedOffer: `Halo ${buyerUser.name}, kami memiliki stok komoditas siap panen yang sesuai dengan kebutuhan Anda di ${buyerUser.location || 'daerah Anda'}. Mari bicarakan volume dan harga.`,
            contactPerson: buyerUser.name,
            recipientUserId: buyerUser.id,
          })
        }
      })
    return list
  }, [contacts])

  const filteredCatalog = useMemo(() => {
    const query = search.toLowerCase()
    return catalogDemands.filter((item) => {
      const matchQuery =
        !query ||
        [item.companyName, item.commodity, item.variety, item.deliveryLocation, item.companyType].some((text) =>
          text.toLowerCase().includes(query),
        )

      const matchCommodity =
        selectedCommodity === 'Semua' || item.commodity.toLowerCase().includes(selectedCommodity.toLowerCase())

      const matchContract = selectedContractType === 'Semua' || item.contractType === selectedContractType

      const matchScore = !highMatchOnly || item.aiMatchScore >= 90

      return matchQuery && matchCommodity && matchContract && matchScore
    })
  }, [catalogDemands, search, selectedCommodity, selectedContractType, highMatchOnly])

  const activeRoom = rooms.find((room) => room.id === activeRoomId)
  const activeMessages = messages.filter((message) => message.conversationId === activeRoomId)

  const currentRoomCatalogItem = useMemo(() => {
    if (selectedCatalogItem) return selectedCatalogItem
    if (!activeRoom) return null
    const partnerName = (activeRoom.other.companyName || activeRoom.other.name).toLowerCase()
    return (
      catalogDemands.find(
        (item) =>
          item.companyName.toLowerCase() === partnerName ||
          (activeRoom.commodity && item.commodity.toLowerCase().includes(activeRoom.commodity.toLowerCase())),
      ) || null
    )
  }, [activeRoom, selectedCatalogItem, catalogDemands])

  // Dipanggil saat tombol "Chat & Negosiasi Sekarang" ditekan.
  const handleStartChatFromCatalog = (item: BuyerCatalogItem) => {
    setSelectedCatalogItem(item)
    setDraft(item.suggestedOffer)
    setNotice('')

    // Jika room dengan pembeli ini sudah ada, langsung buka.
    const existingRoom = rooms.find(
      (room) =>
        room.other.companyName?.toLowerCase() === item.companyName.toLowerCase() ||
        room.other.name.toLowerCase() === item.companyName.toLowerCase() ||
        (item.recipientUserId !== undefined && room.other.id === item.recipientUserId),
    )

    if (existingRoom) {
      setActiveRoomId(existingRoom.id)
      setActiveTab('chat')
      return
    }

    // Buat room lokal dulu agar UI langsung responsif.
    const localRoomId = `room-${item.id}`
    const localRoom: ChatRoom = {
      id: localRoomId,
      subject: `Negosiasi ${item.commodity} (${item.demandVolume})`,
      commodity: item.commodity,
      lastMessage: item.suggestedOffer.slice(0, 80) + '...',
      lastMessageAt: new Date().toISOString(),
      other: {
        id: item.recipientUserId ?? item.id,
        name: item.contactPerson,
        role: 'pembeli',
        companyName: item.companyName,
        location: item.deliveryLocation,
        commodities: item.commodity,
      },
    }

    setRooms((prev) => [localRoom, ...prev])
    setActiveRoomId(localRoomId)
    setActiveTab('chat')

    // Kartu katalog statis hanya simulasi, tidak disimpan ke database.
    if (item.recipientUserId === undefined || isSimulatedRoomId(localRoomId)) return

    // Akun pembeli sungguhan: simpan room ke database, lalu ganti ID lokal dengan ID asli.
    startTransition(async () => {
      const result = await startConversation({
        recipientId: item.recipientUserId!,
        subject: `Negosiasi ${item.commodity}`,
        commodity: item.commodity,
        openingMessage: item.suggestedOffer,
      })

      if (!result.ok || !result.conversationId) {
        setNotice(result.message || 'Ruang chat belum dapat dibuat.')
        return
      }

      const realId = String(result.conversationId)
      setRooms((prev) => prev.map((room) => (room.id === localRoomId ? { ...room, id: realId } : room)))
      setMessages((prev) =>
        prev.map((message) =>
          message.conversationId === localRoomId ? { ...message, conversationId: realId } : message,
        ),
      )
      setActiveRoomId((current) => (current === localRoomId ? realId : current))
      router.refresh()
    })
  }

  const handleSendMessage = () => {
    if (!activeRoomId || !draft.trim()) return

    const text = draft.trim()
    const isSimulated = isDemo || isSimulatedRoomId(activeRoomId)

    // Room lokal milik akun pembeli sungguhan: simpan dulu ke database, lalu kirim pesan.
    if (isLocalRoomId(activeRoomId) && !isSimulated) {
      const pendingRoom = rooms.find((room) => room.id === activeRoomId)
      if (!pendingRoom) return

      const localId = pendingRoom.id
      setDraft('')
      setNotice('')

      startTransition(async () => {
        const created = await startConversation({
          recipientId: pendingRoom.other.id,
          subject: pendingRoom.subject,
          commodity: pendingRoom.commodity ?? undefined,
        })

        if (!created.ok || !created.conversationId) {
          setNotice(created.message || 'Ruang chat belum dapat dibuat.')
          setDraft(text)
          return
        }

        const realId = String(created.conversationId)
        setRooms((prev) => prev.map((room) => (room.id === localId ? { ...room, id: realId } : room)))
        setActiveRoomId((current) => (current === localId ? realId : current))

        const sent = await sendMessage({ conversationId: realId, body: text })
        if (!sent.ok) {
          setNotice(sent.message || 'Pesan gagal dikirim.')
          setDraft(text)
        }
        router.refresh()
      })
      return
    }

    const roomIdAtSend = activeRoomId
    const now = new Date().toISOString()
    setDraft('')
    setNotice('')

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: roomIdAtSend,
      senderId: currentUser.id,
      senderName: currentUser.name,
      body: text,
      createdAt: now,
    }

    setMessages((prev) => [...prev, userMessage])
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomIdAtSend ? { ...room, lastMessage: text.slice(0, 100), lastMessageAt: now } : room,
      ),
    )

    // Balasan simulasi hanya untuk sesi demo dan kartu katalog statis.
    if (isSimulated) {
      setTimeout(() => {
        const room = rooms.find((r) => r.id === roomIdAtSend)
        const partnerName = room?.other.companyName || room?.other.name || 'Mitra Pembeli'
        const autoReplyText =
          text.toLowerCase().includes('harga') || text.includes('Rp')
            ? `Terima kasih atas penawaran harganya, Pak ${currentUser.name.split(' ')[0]}. Kami pelajari skema harga tersebut. Jika mutu sesuai standar Grade A, kami siap sepakati MoU pasokan minggu ini. Kapan kami bisa jadwalkan tim QC ke lokasi?`
            : text.toLowerCase().includes('jadwal') || text.toLowerCase().includes('kirim')
              ? `Jadwal pengiriman tersebut sangat sesuai dengan slot bongkar muat di gudang kami. Mohon sertakan surat jalan dan pastikan packing krat terjaga dengan baik.`
              : `Pesan diterima dengan baik dari ${currentUser.name}. Spesifikasi komoditas ${room?.commodity || 'panen'} Anda sangat sesuai dengan kebutuhan kami. Mari kita lanjutkan ke penandatanganan kesepakatan kerjasama digital PanenTara.`

        const botReply: ChatMessage = {
          id: `reply-${Date.now()}`,
          conversationId: roomIdAtSend,
          senderId: room?.other.id || 'buyer-partner',
          senderName: partnerName,
          body: autoReplyText,
          createdAt: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, botReply])
        setRooms((prev) =>
          prev.map((r) =>
            r.id === roomIdAtSend
              ? { ...r, lastMessage: autoReplyText.slice(0, 100), lastMessageAt: new Date().toISOString() }
              : r,
          ),
        )
      }, 1200)
      return
    }

    // Room asli: simpan pesan ke database.
    startTransition(async () => {
      const res = await sendMessage({ conversationId: roomIdAtSend, body: text })
      if (!res.ok) {
        setNotice(res.message || 'Pesan gagal dikirim.')
      }
    })
  }

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7dc27e]">
            <span className="h-px w-7 bg-[#4fa05c]" />
            Katalog & Negosiasi Buyer Matching
            {isDemo && (
              <span className="ml-2 rounded-full border border-[#f5a623]/30 bg-[#f5a623]/15 px-2 py-0.5 text-[10px] font-bold text-[#f5a623]">
                Mode Demo
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl text-white">
            {currentUser.role === 'petani'
              ? 'Katalog Kebutuhan Pembeli & Ruang Chat Negosiasi'
              : 'Katalog Pasokan Petani & Ruang Chat Negosiasi'}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-white/50">
            Jelajahi permintaan resmi dari off-taker, supermarket, dan eksportir terverifikasi. Klik kartu katalog
            untuk langsung membuka ruang negosiasi chat privat dan menyepakati kontrak panen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-xl border border-[#4fa05c]/25 bg-[#122b17] px-3.5 py-2 text-[#7dc27e]">
            <span className="h-2 w-2 rounded-full bg-[#4fa05c]" />
            <span className="font-semibold text-white">{filteredCatalog.length}</span> Permintaan Terbuka
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-white/70">
            <span className="h-2 w-2 rounded-full bg-[#f5a623]" />
            <span className="font-semibold text-white">{rooms.length}</span> Percakapan Negosiasi
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 pb-4">
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 p-1 border border-white/8">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'catalog' ? 'bg-[#1e4226] text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9" y="2" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="2" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9" y="9" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Katalog Permintaan ({filteredCatalog.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'chat' ? 'bg-[#1e4226] text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 4.5A2.5 2.5 0 0 1 5.5 2h5A2.5 2.5 0 0 1 13 4.5v5a2.5 2.5 0 0 1-2.5 2.5H7.25L4.5 14v-2H3A2.5 2.5 0 0 1 .5 9.5v-5Z"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            Ruang Chat Negosiasi
            {rooms.length > 0 && (
              <span className="rounded-full bg-[#f5a623] px-1.5 py-0.5 text-[10px] font-extrabold text-[#0a1a0e]">
                {rooms.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`hidden lg:flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === 'split' ? 'bg-[#1e4226] text-white shadow-md' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1.5" y="2.5" width="5.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <rect x="9" y="2.5" width="5.5" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Tampilan Terpadu (Split)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHighMatchOnly(!highMatchOnly)}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
              highMatchOnly
                ? 'bg-[#122b17] border-[#4fa05c] text-[#7dc27e] font-semibold'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
          >
            <span>✨</span>
            <span>Kecocokan AI &gt; 90%</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {(activeTab === 'catalog' || activeTab === 'split') && (
        <div className="space-y-3 rounded-2xl border border-white/8 bg-[#0a1a0e] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.4" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pembeli, komoditas (Cabai, Bawang, Tomat), lokasi pengiriman..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#4fa05c]/60"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Tipe Kerjasama:</span>
              <select
                value={selectedContractType}
                onChange={(e) => setSelectedContractType(e.target.value as ContractFilter)}
                className="rounded-xl border border-white/10 bg-[#122b17] px-3 py-2 text-xs text-white outline-none focus:border-[#4fa05c]"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Kontrak Rutin">Kontrak Rutin</option>
                <option value="Off-taker Industri">Off-taker Industri</option>
                <option value="Spot Order">Spot Order</option>
                <option value="Horeka Mitra">Horeka Mitra</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-white/40 shrink-0">Komoditas:</span>
            {COMMODITY_OPTIONS.map((comm) => (
              <button
                key={comm}
                type="button"
                onClick={() => setSelectedCommodity(comm)}
                className={`shrink-0 rounded-lg px-3 py-1.5 transition-all ${
                  selectedCommodity === comm
                    ? 'bg-[#4fa05c] text-[#060e08] font-bold shadow'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {comm}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* TAB 1: KATALOG */}
        {activeTab === 'catalog' && (
          <div>
            {filteredCatalog.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center bg-[#0a1a0e]">
                <p className="text-base font-semibold text-white/70">Tidak ada permintaan pembeli yang cocok</p>
                <p className="mt-1 text-xs text-white/35">Coba ubah kata kunci pencarian atau reset filter komoditas.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('')
                    setSelectedCommodity('Semua')
                    setSelectedContractType('Semua')
                    setHighMatchOnly(false)
                  }}
                  className="mt-4 rounded-xl bg-[#1e4226] px-4 py-2 text-xs font-semibold text-[#7dc27e] hover:bg-[#285733]"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredCatalog.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-3xl border border-white/8 bg-[#0a1a0e] p-5 shadow-xl transition-all hover:border-[#4fa05c]/30 hover:shadow-black/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#122b17] text-sm font-extrabold text-[#7dc27e] ring-1 ring-[#4fa05c]/25">
                            {initials(item.companyName)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white leading-tight">{item.companyName}</h3>
                            <p className="text-xs text-white/40">{item.companyType}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 rounded-full bg-[#1e4226] border border-[#4fa05c]/30 px-2.5 py-1 text-[11px] font-bold text-[#7dc27e]">
                          <span>⚡</span>
                          <span>{item.aiMatchScore}%</span>
                        </div>
                      </div>

                      <p className="mt-3 text-[11px] leading-relaxed text-[#7dc27e]/80 bg-[#122b17]/50 rounded-xl p-2.5 border border-[#4fa05c]/15">
                        💡 {item.matchReason}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2.5 text-xs">
                        <div className="rounded-xl bg-white/4 p-2.5 border border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-white/35">Komoditas Dicari</span>
                          <p className="mt-0.5 font-bold text-white truncate">{item.commodity}</p>
                          <p className="text-[10px] text-white/40 truncate">{item.variety}</p>
                        </div>
                        <div className="rounded-xl bg-white/4 p-2.5 border border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-white/35">Target Volume</span>
                          <p className="mt-0.5 font-bold text-[#f5a623]">{item.demandVolume}</p>
                          <p className="text-[10px] text-white/40">{item.contractType}</p>
                        </div>
                        <div className="rounded-xl bg-white/4 p-2.5 border border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-white/35">Rentang Harga</span>
                          <p className="mt-0.5 font-bold text-[#7dc27e]">{item.targetPriceRange}</p>
                        </div>
                        <div className="rounded-xl bg-white/4 p-2.5 border border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-white/35">Titik Serah</span>
                          <p className="mt-0.5 font-medium text-white truncate">{item.deliveryLocation}</p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-white/5 pt-3">
                        <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-1.5">
                          Spesifikasi Kunci Mutu:
                        </p>
                        <ul className="space-y-1 text-xs text-white/60">
                          {item.qualityCriteria.slice(0, 2).map((crit, idx) => (
                            <li key={idx} className="flex items-center gap-1.5 truncate">
                              <span className="text-[#4fa05c]">•</span>
                              <span className="truncate">{crit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/8 pt-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-white/40 px-1">
                        <span>
                          Est. Nilai: <strong className="text-white/70">{item.estimatedValue}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSpecModalItem(item)}
                          className="text-[#7dc27e] hover:underline"
                        >
                          Detail Mutu & Kontrak ↗
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartChatFromCatalog(item)}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e4226] to-[#285733] hover:from-[#285733] hover:to-[#346e41] text-white py-2.5 px-4 text-xs font-bold transition-all shadow-lg shadow-black/20 border border-[#4fa05c]/30 disabled:opacity-60"
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path
                            d="M3 4.5A2.5 2.5 0 0 1 5.5 2h5A2.5 2.5 0 0 1 13 4.5v5a2.5 2.5 0 0 1-2.5 2.5H7.25L4.5 14v-2H3A2.5 2.5 0 0 1 .5 9.5v-5Z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                          />
                        </svg>
                        Chat & Negosiasi Sekarang
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pasokan petani */}
            <div className="mt-12 rounded-3xl border border-white/8 bg-[#0a1a0e] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white text-lg">Katalog Pasokan Petani Terverifikasi</h3>
                  <p className="text-xs text-white/45">
                    Kelompok tani siap panen dengan estimasi volume dan tanggal panen riil.
                  </p>
                </div>
                <span className="rounded-full bg-[#122b17] border border-[#4fa05c]/25 px-3 py-1 text-xs text-[#7dc27e]">
                  {CURATED_FARMER_SUPPLIES.length} Kelompok Tani Siap Panen
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {CURATED_FARMER_SUPPLIES.map((supply) => (
                  <div
                    key={supply.id}
                    className="rounded-2xl border border-white/5 bg-white/3 p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{supply.farmerName}</span>
                        <span className="text-[10px] text-[#7dc27e] font-bold bg-[#1e4226] px-2 py-0.5 rounded-full">
                          {supply.aiMatchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-white/40">
                        {supply.groupName} · {supply.location}
                      </p>

                      <div className="mt-3 space-y-1 text-xs">
                        <p className="text-white">
                          <strong className="text-white/40">Komoditas:</strong> {supply.commodity}
                        </p>
                        <p className="text-[#f5a623]">
                          <strong className="text-white/40">Siap Panen:</strong> {supply.projectedVolume} (
                          {supply.harvestDate})
                        </p>
                        <p className="text-[#7dc27e]">
                          <strong className="text-white/40">Harga Tawar:</strong> {supply.askingPrice}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setDraft(supply.suggestedMessage)
                        setActiveTab('chat')
                      }}
                      className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs py-2 font-semibold transition-colors"
                    >
                      Buka Chat dengan Petani
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 & 3: RUANG CHAT / SPLIT */}
        {(activeTab === 'chat' || activeTab === 'split') && (
          <div
            className={`grid overflow-hidden rounded-3xl border border-white/8 bg-[#0a1a0e] shadow-2xl ${
              activeTab === 'split'
                ? 'lg:grid-cols-[320px_minmax(0,1fr)_340px] min-h-[720px]'
                : 'lg:grid-cols-[340px_minmax(0,1fr)] min-h-[680px]'
            }`}
          >
            {/* Daftar room */}
            <aside className="border-b border-white/8 lg:border-b-0 lg:border-r flex flex-col">
              <div className="border-b border-white/8 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Percakapan Negosiasi</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="text-[11px] text-[#7dc27e] hover:underline"
                  >
                    + Dari Katalog
                  </button>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari ruang negosiasi..."
                  className="w-full rounded-xl border border-white/8 bg-white/5 py-2 px-3 text-xs text-white placeholder-white/30 outline-none focus:border-[#4fa05c]"
                />
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {rooms.length === 0 ? (
                  <div className="p-6 text-center text-xs text-white/40">
                    Belum ada percakapan aktif. Pilih pembeli dari katalog untuk memulai negosiasi.
                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="mt-3 block w-full rounded-xl bg-[#1e4226] text-[#7dc27e] py-2 font-semibold"
                    >
                      Buka Katalog Buyer
                    </button>
                  </div>
                ) : (
                  rooms.map((room) => {
                    const isActive = room.id === activeRoomId
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => {
                          setActiveRoomId(room.id)
                          setNotice('')
                        }}
                        className={`w-full rounded-2xl p-3 text-left transition-all ${
                          isActive ? 'bg-[#1e4226] text-white shadow' : 'hover:bg-white/5 text-white/70'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5a623] text-xs font-extrabold text-[#0a1a0e]">
                            {initials(room.other.companyName || room.other.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className="truncate text-xs font-bold text-white">
                                {room.other.companyName || room.other.name}
                              </p>
                              <span className="shrink-0 text-[10px] text-white/30">{formatTime(room.lastMessageAt)}</span>
                            </div>
                            <p className="text-[11px] text-[#7dc27e] font-medium truncate">
                              {room.commodity || room.subject}
                            </p>
                            <p className="truncate text-[11px] text-white/40 mt-0.5">
                              {room.lastMessage || 'Klik untuk membuka chat'}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </aside>

            {/* Ruang chat aktif */}
            <section className="flex flex-col min-h-[500px]">
              {activeRoom ? (
                <>
                  <header className="flex items-center justify-between border-b border-white/8 px-5 py-3.5 bg-[#0a1a0e]/90">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5a623] text-xs font-extrabold text-[#0a1a0e]">
                        {initials(activeRoom.other.companyName || activeRoom.other.name)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-sm font-bold text-white">
                            {activeRoom.other.companyName || activeRoom.other.name}
                          </h2>
                          <span className="rounded-full bg-[#122b17] border border-[#4fa05c]/30 px-2 py-0.5 text-[10px] text-[#7dc27e] font-medium">
                            Terverifikasi
                          </span>
                        </div>
                        <p className="text-[11px] text-white/40 truncate">
                          {activeRoom.subject} · {activeRoom.other.location || 'Indonesia'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors flex items-center gap-1.5"
                    >
                      <span>←</span>
                      <span>Lihat Katalog</span>
                    </button>
                  </header>

                  {currentRoomCatalogItem && (
                    <div className="border-b border-white/8 bg-[#122b17]/70 p-3.5 px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/40">Kebutuhan:</span>
                          <span className="font-bold text-white">{currentRoomCatalogItem.commodity}</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/40">Target Vol:</span>
                          <span className="font-bold text-[#f5a623]">{currentRoomCatalogItem.demandVolume}</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/40">Target Harga:</span>
                          <span className="font-bold text-[#7dc27e]">{currentRoomCatalogItem.targetPriceRange}</span>
                        </div>
                        <div className="h-3 w-px bg-white/10" />
                        <span className="rounded-full bg-[#1e4226] px-2 py-0.5 text-[10px] font-bold text-[#7dc27e]">
                          {currentRoomCatalogItem.aiMatchScore}% Match AI
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSpecModalItem(currentRoomCatalogItem)}
                        className="text-[11px] text-[#7dc27e] hover:underline font-medium"
                      >
                        Rincian Mutu ↗
                      </button>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-[radial-gradient(circle_at_top_right,rgba(30,66,38,0.18),transparent_40%)]">
                    <div className="mx-auto max-w-md rounded-xl border border-[#f5a623]/20 bg-[#f5a623]/8 p-2.5 text-center text-[11px] leading-relaxed text-white/50">
                      🔒 Percakapan ini dilindungi garansi transaksi PanenTara Escrow. Pastikan harga, volume panen,
                      dan jadwal serah-terima tertulis secara eksplisit.
                    </div>

                    {activeMessages.map((msg) => {
                      const isOwn = msg.senderId === currentUser.id
                      return (
                        <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 ${
                              isOwn
                                ? 'bg-[#1e4226] text-white rounded-br-none border border-[#4fa05c]/30'
                                : 'bg-white/6 text-white/90 rounded-bl-none border border-white/8'
                            }`}
                          >
                            {!isOwn && <p className="text-[10px] font-bold text-[#7dc27e] mb-1">{msg.senderName}</p>}
                            <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed">{msg.body}</p>
                            <p className="mt-1.5 text-right text-[9px] text-white/35">{formatTime(msg.createdAt)}</p>
                          </div>
                        </div>
                      )
                    })}

                    {activeMessages.length === 0 && (
                      <div className="py-16 text-center">
                        <p className="text-base font-semibold text-white/60">Ruang Negosiasi Baru</p>
                        <p className="mt-1 text-xs text-white/35 max-w-sm mx-auto">
                          Gunakan tombol penawaran cepat di bawah untuk mengajukan harga atau konfirmasi stok panen Anda.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/8 bg-[#0a1a0e] px-4 pt-2.5 pb-1 flex items-center gap-2 overflow-x-auto text-[11px]">
                    <span className="text-white/30 shrink-0">Tawar Cepat:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft(
                          'Kami mengajukan penawaran harga Rp 33.500/kg franco gudang untuk volume 3,5 Ton dengan standar mutu Grade A super. Apakah bisa disetujui?',
                        )
                      }
                      className="shrink-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 text-white/70 transition-colors"
                    >
                      💰 Ajukan Harga Rp 33.500/kg
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft('Stok komoditas 3,5 Ton kami sudah terkonfirmasi siap petik sesuai jadwal panen. Mutu mulus dan bebas hama.')
                      }
                      className="shrink-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 text-white/70 transition-colors"
                    >
                      📦 Konfirmasi Kesiapan Stok
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft('Kami siap mengirim pasokan tahap pertama pada hari Selasa depan via armada pick-up berpendingin.')
                      }
                      className="shrink-0 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 text-white/70 transition-colors"
                    >
                      🚚 Jadwalkan Kirim Selasa
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft(
                          'Dengan ini kami setuju mengikat MoU transaksi jual-beli panen ini sesuai volume dan harga kesepakatan di PanenTara.',
                        )
                      }
                      className="shrink-0 rounded-full bg-[#122b17] border border-[#4fa05c]/30 px-3 py-1 text-[#7dc27e] font-semibold transition-colors"
                    >
                      🤝 Sepakati Kontrak MoU
                    </button>
                  </div>

                  <div className="border-t border-white/8 p-3.5 bg-[#0a1a0e]">
                    {notice && <p className="mb-2 text-xs text-[#f5a623]">{notice}</p>}
                    <div className="flex items-end gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-2 focus-within:border-[#4fa05c]/50">
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        rows={1}
                        placeholder="Tulis pesan negosiasi, harga, atau volume komoditas..."
                        className="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-xs sm:text-sm text-white placeholder-white/25 outline-none leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={isPending || !draft.trim()}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f5a623] hover:bg-[#f7bd58] text-[#0a1a0e] transition-colors disabled:opacity-40"
                        aria-label="Kirim Pesan"
                      >
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path
                            d="m2 2 12 6-12 6 1.8-4.8 5.4-1.2-5.4-1.2L2 2Z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-1.5 flex justify-between px-1 text-[10px] text-white/25">
                      <span>Tekan Enter untuk kirim · Shift + Enter untuk baris baru</span>
                      <span>{draft.length}/2000</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center p-8 text-center">
                  <div className="max-w-sm">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#122b17] text-[#7dc27e] border border-[#4fa05c]/25">
                      🤝
                    </div>
                    <h3 className="font-semibold text-white text-lg">Pilih Permintaan dari Katalog</h3>
                    <p className="mt-1 text-xs text-white/40 leading-relaxed">
                      Klik kartu katalog pembeli untuk langsung membuka ruang chat negosiasi harga dan kontrak pasokan.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="mt-4 rounded-xl bg-[#1e4226] px-4 py-2 text-xs font-bold text-white hover:bg-[#285733]"
                    >
                      Buka Katalog Buyer Matching
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Panel rincian (hanya mode split) */}
            {activeTab === 'split' && (
              <aside className="hidden lg:flex flex-col border-l border-white/8 p-4 bg-[#07130a] overflow-y-auto text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                  Rincian Mitra & Penawaran
                </h4>
                {currentRoomCatalogItem ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-3.5">
                      <p className="text-white font-bold">{currentRoomCatalogItem.companyName}</p>
                      <p className="text-[11px] text-white/40">{currentRoomCatalogItem.companyType}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="rounded-full bg-[#1e4226] px-2 py-0.5 text-[10px] font-bold text-[#7dc27e]">
                          {currentRoomCatalogItem.aiMatchScore}% Cocok AI
                        </span>
                        <span className="text-[10px] text-white/40">{currentRoomCatalogItem.contractType}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-white/35 uppercase">Target Kebutuhan</span>
                        <p className="font-bold text-[#f5a623]">{currentRoomCatalogItem.demandVolume}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/35 uppercase">Rentang Harga Beli</span>
                        <p className="font-bold text-[#7dc27e]">{currentRoomCatalogItem.targetPriceRange}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/35 uppercase">Lokasi Bongkar</span>
                        <p className="text-white/80">{currentRoomCatalogItem.deliveryLocation}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-white/35 uppercase">Skema Pembayaran</span>
                        <p className="text-white/70">{currentRoomCatalogItem.paymentTerms}</p>
                      </div>
                    </div>

                    <div className="border-t border-white/8 pt-3">
                      <span className="text-[10px] text-white/35 uppercase font-semibold">Syarat Kualitas:</span>
                      <ul className="mt-1 space-y-1 text-[11px] text-white/60">
                        {currentRoomCatalogItem.qualityCriteria.map((c, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-[#4fa05c]">✓</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSpecModalItem(currentRoomCatalogItem)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white py-2 text-center text-xs font-semibold"
                    >
                      Lihat Dokumen Kontrak Lengkap
                    </button>
                  </div>
                ) : (
                  <div className="text-white/40 text-center py-10">
                    Pilih percakapan untuk melihat rincian permintaan pembeli.
                  </div>
                )}
              </aside>
            )}
          </div>
        )}
      </div>

      {/* Modal detail mutu & kontrak */}
      {specModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSpecModalItem(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-white/15 bg-[#0a1a0e] p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-white/8 pb-4">
              <div>
                <span className="rounded-full bg-[#1e4226] border border-[#4fa05c]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#7dc27e]">
                  {specModalItem.verifiedBadge}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{specModalItem.companyName}</h3>
                <p className="text-xs text-white/45">
                  {specModalItem.companyType} · {specModalItem.contactPerson}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSpecModalItem(null)}
                className="rounded-xl bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/4 p-3 border border-white/5">
                  <span className="text-[10px] text-white/35 uppercase">Komoditas & Varietas</span>
                  <p className="font-bold text-white text-sm mt-0.5">{specModalItem.commodity}</p>
                  <p className="text-white/50">{specModalItem.variety}</p>
                </div>
                <div className="rounded-xl bg-white/4 p-3 border border-white/5">
                  <span className="text-[10px] text-white/35 uppercase">Volume & Nilai Transaksi</span>
                  <p className="font-bold text-[#f5a623] text-sm mt-0.5">{specModalItem.demandVolume}</p>
                  <p className="text-white/50">{specModalItem.estimatedValue}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1.5">Standar Kualitas & Mutu Panen:</h4>
                <div className="rounded-xl border border-white/8 bg-white/3 p-3 space-y-1.5 text-white/70">
                  {specModalItem.qualityCriteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#4fa05c]" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-white/35 uppercase">Titik Pengiriman & Syarat Logistik:</span>
                  <p className="text-white mt-0.5 font-medium">
                    {specModalItem.deliveryLocation} ({specModalItem.deliveryTerms})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-white/35 uppercase">Ketentuan Pembayaran:</span>
                  <p className="text-white mt-0.5 font-medium">{specModalItem.paymentTerms}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/8 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSpecModalItem(null)}
                className="rounded-xl px-4 py-2 text-xs text-white/60 hover:text-white"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const item = specModalItem
                  setSpecModalItem(null)
                  handleStartChatFromCatalog(item)
                }}
                className="rounded-xl bg-[#f5a623] hover:bg-[#f7bd58] text-[#0a1a0e] font-bold px-5 py-2.5 text-xs transition-colors"
              >
                Mulai Chat & Ajukan Kontrak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}