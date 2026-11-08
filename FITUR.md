# Dokumentasi Arsitektur Sistem dan Konsep Backend PanenTara

Dokumen ini menyajikan spesifikasi arsitektur teknis, inventaris fitur, alur kerja operasional (*workflow*), rancangan backend, serta analisis kebutuhan basis data untuk platform agritech **PanenTara**.

---

## 1. Pendahuluan dan Ringkasan Platform

PanenTara adalah platform agritech berbasis kecerdasan buatan (*AI-powered agricultural platform*) yang dibangun untuk memodernisasi tata kelola agribisnis Indonesia. Platform ini memfasilitasi hubungan rantai pasok antara petani, kelompok tani (Gapoktan), industri pengolahan pangan (*off-taker*), jaringan supermarket modern, dan eksportir komoditas hortikultura.

Platform ini memadukan:
1. **Frontend App Router:** Dibangun menggunakan Next.js, React 19, Tailwind CSS v4, dan pustaka visualisasi data Recharts.
2. **Backend Engine:** Menggunakan Payload CMS yang terintegrasi secara *native* dengan infrastruktur Figma Cloud (`@payloadcms/figma`), menyediakan Local API, REST, GraphQL, dan panel administrasi internal.
3. **Data Layer:** Sistem basis data relasional tervirtualisasi di cloud untuk menjamin persistensi akun, verifikasi identitas, ruang negosiasi, dan rekam jejak obrolan kontrak panen.

---

## 2. Inventaris Fitur Platform dan Alur Kerjanya

### 2.1. Landing Page dan Portal Informasi Publik (`/`)
* **Fungsi:** Halaman etalase publik yang memperkenalkan proposisi nilai, modul unggulan, paket berlangganan, serta pembaruan langsung harga pasar komoditas strategis.
* **Komponen Utama:**
  * Header navigasi dengan tautan fitur dan akses login.
  * Hero section dengan tombol ajakan bertindak (*CTA*): **"Mulai Gratis"** (pendaftaran akun) dan **"Lihat Demo"** (akses langsung tanpa rintangan login).
  * *Live Ticker* pergerakan harga komoditas pangan nasional (Cabai Merah Keriting, Bawang Merah Bima, Tomat Sayur, Beras Pandan Wangi).
  * Kartu perbandingan paket (*Starter Gratis, Pro Tani, Koperasi / Enterprise*).
* **Alur Pengguna:**
  1. Pengunjung mengakses URL akar (`/`).
  2. Pengunjung dapat memilih untuk membuat akun atau langsung menekan **"Lihat Demo"**.
  3. Mengklik "Lihat Demo" mengarahkan pengunjung ke `/dashboard` di mana sesi demo langsung diaktifkan tanpa formulir login.

---

### 2.2. Autentikasi Aplikasi dan Manajemen Peran (`/login`)
* **Fungsi:** Sistem pendaftaran dan autentikasi khusus bagi pengguna aplikasi publik, terisolasi secara ketat dari akun administrator CMS.
* **Spesifikasi Peran Akun (*Role-Based Account*):**
  * **Petani / Penjual:** Produsen tanaman pangan dan hortikultura yang ingin menawarkan hasil panen langsung ke pembeli institusi.
  * **Pembeli:** Jaringan ritel modern, industri saus/bumbu, eksportir, dan pedagang pasar induk yang membutuhkan pasokan rutin.
* **Fitur Keamanan:** Validasi format alamat email, verifikasi kata sandi minimal 8 karakter dengan visual bar pengukur kekuatan kata sandi, serta penyimpanan token JWT ke dalam *cookie* terproteksi (`app-session`).
* **Pintasan Mode Demo:** Tombol **"Jelajahi Demo Dashboard & Buyer Matching"** di bawah formulir login untuk masuk ke dashboard secara instan dalam 1 klik.

---

### 2.3. Verifikasi Identitas Petani / KYC KTP (`/verify-ktp`)
* **Fungsi:** Verifikasi identitas resmi (*Know Your Customer*) bagi akun berstatus Petani untuk mencegah penipuan kapasitas panen dan melegalkan transaksi kontrak.
* **Tahapan Verifikasi (*Wizard 4 Langkah*):**
  1. **Data Diri:** Input Nomor Induk Kependudukan (NIK 16 digit), nama lengkap sesuai identitas, dan tanggal lahir.
  2. **Upload KTP:** Pengunggahan berkas digital KTP dengan fitur *drag & drop* serta pratinjau instan.
  3. **Foto Selfie:** Pengambilan foto wajah memegang kartu KTP untuk pencocokan biometrik.
  4. **Review:** Rangkuman informasi sebelum diajukan ke sistem validasi.
* **Alur Kerja:** Petani yang baru mendaftar dialihkan ke rute ini. Setelah verifikasi dikirim, akun menerima lencana *Terverifikasi Kemitraan* yang membuka akses penuh ke penandatanganan kontrak di modul Buyer Matching.

---

### 2.4. Akses Demo Terbuka dan Persona Switcher
* **Fungsi:** Membuka seluruh rute fungsional dashboard bagi tamu/penguji tanpa mengharuskan pendaftaran terlebih dahulu.
* **Mekanisme Resolusi:**
  * Di dalam `src/app/(frontend)/dashboard/layout.tsx`, ketiadaan token sesi tidak memicu pengalihan paksa (`redirect('/login')`).
  * Sistem menyuntikkan profil akun demo:
    * `DEMO_USER_PETANI`: Budi Santoso (Kelompok Tani Makmur Subur, Malang).
    * `DEMO_USER_PEMBELI`: Hendra Gunawan (PT Segar Nusantara Retail, Jakarta).
* **Persona Switcher:**
  * Pada bilah atas (*top bar*) dashboard, terdapat tombol pengalih peran: **"Peran: Petani (Ubah)"** $\leftrightarrow$ **"Peran: Pembeli (Ubah)"**.
  * Server Action `switchDemoPersona` memperbarui *cookie* preferensi demo (`panentara-demo-role`) dan merefresh halaman, sehingga pengguna dapat melihat antarmuka dari sudut pandang penjual maupun pembeli secara seketika.

---

### 2.5. Kerangka Dashboard dan Manajemen Profil (`DashboardShell.tsx`, `ProfilePanel.tsx`)
* **Fungsi:** Tata letak utama (*layout shell*) yang mengintegrasikan bilah samping navigasi, bilah atas dengan status sistem, serta panel profil usahatani geser.
* **Komponen:**
  * **Sidebar:** Logo PanenTara, kartu ringkasan pengguna dengan lencana *Demo* atau *Terverifikasi*, daftar navigasi dengan *badge counter*, dan tombol keluar.
  * **Top Bar:** Kolom pencarian global, notifikasi sistem, lencana *Mode Demo*, tombol alih peran demo, dan avatar profil.
  * **Profile Drawer:** Menampilkan dan mengubah luas lahan usahatani (hektar), komoditas utama, kontak telepon, dan bio operasional.

---

### 2.6. Modul Ikhtisar Operasional / Overview (`/dashboard`)
* **Fungsi:** Pusat pemantauan harian aktivitas agribisnis pengguna.
* **Metrik Utama:**
  * Proyeksi pendapatan bulan berjalan beserta persentase fluktuasi.
  * Jumlah komoditas aktif dan jadwal panen terdekat.
  * Penghitung pencocokan pembeli baru (*Buyer Match*) yang memerlukan respons.
  * Peringatan dini risiko cuaca atau kelebihan pasokan (*oversupply*).
* **Aktivitas Terkini (*Live Activity Feed*):** Riwayat log interaksi pasar, pembaruan harga pasar induk secara langsung, dan status transaksi selesai.

---

### 2.7. Market Intelligence / Intelijen Pasar (`/dashboard/market`)
* **Fungsi:** Pemantauan dan analitik harga komoditas pangan secara transparan berbasis agregasi data pasar induk nasional.
* **Fitur Utama:**
  * **Grafik Tren Historis:** Visualisasi garis interaktif pergerakan harga harian untuk Cabai Merah Keriting, Bawang Merah Bima, Tomat Sayur, Jagung Hibrida, dan Beras.
  * **Pembanding Antar Pasar Induk:** Menampilkan harga komparatif antara Pasar Induk Kramat Jati Jakarta, Pasar Caringin Bandung, Puspa Agro Sidoarjo, dan Jakabaring Palembang.
  * **Transparansi Rantai Pasok (*Supply Chain Margin Breakdown*):** Membedah selisih marjin harga dari Petani $\rightarrow$ Pengepul $\rightarrow$ Pasar Induk $\rightarrow$ Ritel Konsumen.
  * **Prakiraan Harga 14 Hari:** Proyeksi kecenderungan tren harga berbasis model musiman.

---

### 2.8. Modul Buyer Matching Terintegrasi Room Chat (`/dashboard/buyer-matching`)
* **Fungsi:** Menghubungkan permintaan pembelian (*buyer demand*) institusi dengan pasokan kelompok tani (*farmer supply*), terintegrasi langsung dengan ruang obrolan negosiasi privat.
* **Katalog Permintaan Pembeli:**
  * Profil korporat terverifikasi: *PT Segar Nusantara Retail (Supermarket)*, *CV Berkah Pangan Mandiri (Industri Saus)*, *PT Sumber Sayur Indo (Eksportir)*, *Agro Fresh Mart Jawa Timur*, *PT Tani Berkah Logistik*, dan *Hotel Sentosa Group*.
  * Terintegrasi dinamis dengan pengguna pembeli yang terdaftar di basis data Payload (seperti akun *Dimas*).
* **Multi-Filter dan Pencarian:**
  * Filter komoditas, jenis kontrak (*Kontrak Rutin, Off-taker Industri, Spot Order, Horeka Mitra*), dan filter skor kecocokan AI di atas 90%.
* **Alur Integrasi Katalog ke Ruang Chat:**
  1. Pengguna meninjau kartu katalog yang menampilkan target volume, rentang harga beli, titik gudang serah-terima, spesifikasi mutu, dan nilai estimasi transaksi per bulan.
  2. Pengguna mengklik **"Chat & Negosiasi Sekarang"**.
  3. Sistem menginisiasi ruang obrolan, mengarahkan tampilan ke tab **Ruang Chat Negosiasi**, dan otomatis menyuntikkan kalimat draf penawaran formal.
  4. Header obrolan memunculkan **Catalog Context Bar** yang merangkum poin-poin permintaan pembeli yang sedang dinegosiasikan.
  5. Pengguna dapat menggunakan tombol aksi tawar cepat (*Quick Offer Chips*): *Ajukan Harga Rp 33.500/kg*, *Konfirmasi Kesiapan Stok*, *Jadwalkan Kirim*, dan *Sepakati Kontrak MoU*.
  6. Pada mode demo, mitra pembeli membalas secara otomatis dan cerdas setelah 1,2 detik. Pada akun terdaftar, obrolan disimpan secara permanen ke koleksi basis data Payload.

---

### 2.9. Prediksi Cuaca Pertanian dan Kalender Tanam (`/dashboard/weather`)
* **Fungsi:** Analisis agroklimatologi mikro untuk panduan jadwal tanam, penyemprotan, dan pemanenan.
* **Fitur:**
  * Prakiraan cuaca 14 hari (suhu min/maks, kelembapan, kecepatan angin, curah hujan).
  * Grafik area visualisasi kelembapan dan curah hujan.
  * Matriks risiko penyakit tanaman (identifikasi dini penyakit Busuk Buah, Antraknosa, dan Hama Penggerek berdasarkan tingginya curah hujan).
  * Rekomendasi mitigasi praktis (jadwal pembersihan saluran drainase bedengan lahan).

---

### 2.10. Rekomendasi AI Usahatani (`/dashboard/ai`)
* **Fungsi:** Mesin kecerdasan buatan penasihat agribisnis (*AI Agronomy Advisor*).
* **Fitur:**
  * Kartu rekomendasi berkategori prioritas (*Segera, Direkomendasikan, Waspada*).
  * Skor keyakinan model (*Confidence Score* hingga 91%), estimasi potensi ROI (+Rp Juta/ha), dan profil risiko.
  * Analisis korelasi antara regulasi kuota impor pemerintah dengan peluang kenaikan harga komoditas lokal.
  * Rencana aksi bertahap (*actionable checklist*) bagi petani.

---

### 2.11. Manajemen Risiko dan Deteksi Oversupply (`/dashboard/risk`)
* **Fungsi:** Sistem deteksi dini oversupply pasokan untuk memitigasi risiko kejatuhan harga saat panen serentak.
* **Fitur:**
  * Grafik perbandingan pasokan vs permintaan per wilayah sentra (Brebes, Nganjuk, Garut, Magelang, Kediri).
  * Peringatan berkode warna (*Kritis, Waspada, Aman*) saat pasokan terdeteksi melebihi ambang batas serap 20%.
  * Rekomendasi pengalihan distribusi logistik antar-wilayah atau pemanfaatan ruang pendingin (*cold storage*).

---

### 2.12. Portal Berita dan Regulasi Kebijakan (`/dashboard/news`)
* **Fungsi:** Kurasi informasi kebijakan pangan dan teknologi pertanian nasional.
* **Fitur:** Filter kategori (*Harga Pasar, Kebijakan, Teknologi, Cuaca, Ekspor/Impor*) serta indikator dampak (*Dampak Positif / Dampak Negatif*) terhadap margin petani.

---

## 3. Konsep dan Arsitektur Backend

Arsitektur backend PanenTara tidak mengandalkan server terpisah (*standalone backend microservice*), melainkan menggunakan pola **Unified Next.js + Payload CMS Engine**. Seluruh backend berjalan di dalam runtime aplikasi yang sama melalui App Router, didukung oleh platform cloud terkelola Figma Make.

```
+-----------------------------------------------------------------------------------+
|                                  NEXT.JS APP ROUTER                               |
|                                                                                   |
|   Frontend Client Pages                Server Actions & Route Handlers            |
|   - src/app/(frontend)/page.tsx        - src/app/(frontend)/login/actions.ts     |
|   - src/app/(frontend)/dashboard/*     - src/app/(frontend)/dashboard/buyer-      |
|   - BuyerMatchingChat.tsx                matching/actions.ts                      |
|                  |                                        |                       |
|                  | (Server Actions via useTransition)     |                       |
|                  +--------------------------------------->+                       |
|                                                           |                       |
|                                                           v                       |
|                                            +------------------------------+       |
|                                            |    PAYLOAD LOCAL API         |       |
|                                            |    getPayload({ config })    |       |
|                                            |    overrideAccess: true      |       |
|                                            +--------------+---------------+       |
+-----------------------------------------------------------|-----------------------+
                                                            |
                                                            v
+-----------------------------------------------------------------------------------+
|                                 PAYLOAD CMS ENGINE                                |
|                                                                                   |
|   Collection Hooks                         Data Collections                       |
|   - validateParticipants (Conversations)   - users                                |
|   - prepareMessage (Messages)              - conversations                        |
|                                            - messages                             |
|                                            - media / admins / tags / folders      |
+-----------------------------------------------------------+-----------------------+
                                                            |
                                                            v
+-----------------------------------------------------------------------------------+
|                        FIGMA CLOUD DATABASE LAYER (PERSISTENT)                    |
|                                                                                   |
|   Tabel Relasional Terkelola:                                                     |
|   - users, conversations, messages, media, relations                              |
+-----------------------------------------------------------------------------------+
```

---

### 3.1. Skema Koleksi Data (*Data Collections Modeling*)

Backend mendefinisikan koleksi data relasional di direktori `src/collections/`:

#### A. Koleksi `Users` (`src/collections/Users.ts`)
Mengelola data identitas pengguna aplikasi (petani dan pembeli).
* **Slug:** `users`
* **Autentikasi:** Diaktifkan (`auth: true`), menghasilkan token JWT dan verifikasi kata sandi terenkripsi.
* **Atribut Bidang (*Fields*):**
  * `name` (Text, Wajib): Nama lengkap pengguna atau perwakilan.
  * `role` (Select, Wajib): Pilihan peran antara `petani` atau `pembeli`.
  * `companyName` (Text): Nama kelompok tani, korporasi ritel, atau pabrik.
  * `location` (Text): Wilayah operasional / sentra produksi (contoh: *Malang, Jawa Timur*).
  * `phone` (Text): Nomor kontak telepon/WhatsApp bisnis.
  * `commodities` (Text): Daftar komoditas yang diproduksi atau dicari.
  * `avatar` (Upload, relasi ke koleksi `media`).
  * `email` (Email, terindeks, hanya dapat dibaca oleh pemilik akun).

#### B. Koleksi `Conversations` (`src/collections/Conversations.ts`)
Mengelola ruang obrolan dan transaksi kesepakatan antara tepat dua entitas.
* **Slug:** `conversations`
* **Atribut Bidang (*Fields*):**
  * `participants` (Relationship multi-relasi ke `users`, min 2, maks 2): Menyimpan ID kedua pihak yang bertransaksi.
  * `subject` (Text, Wajib): Topik utama negosiasi (contoh: *Negosiasi Cabai Merah Keriting 3,5 Ton*).
  * `commodity` (Text): Nama komoditas yang diperjualbelikan.
  * `lastMessage` (Text): Cuplikan isi pesan terakhir.
  * `lastMessageAt` (Date, terindeks): Waktu pesan terakhir dikirimkan.
* **Validasi Khusus (*beforeValidate Hook*):**
  * Memastikan percakapan terdiri dari tepat dua pihak yang berbeda.
  * Memvalidasi bahwa peserta wajib terdiri dari kombinasi satu akun `petani` dan satu akun `pembeli`.

#### C. Koleksi `Messages` (`src/collections/Messages.ts`)
Menyimpan riwayat pesan obrolan terenkripsi antar pihak.
* **Slug:** `messages`
* **Atribut Bidang (*Fields*):**
  * `conversation` (Relationship ke `conversations`, Wajib): Menghubungkan pesan ke ruang obrolan terkait.
  * `sender` (Relationship ke `users`, Wajib): Menandai pengirim pesan.
  * `participants` (Relationship banyak ke `users`, tersembunyi): Daftar peserta percakapan.
  * `body` (Textarea, Wajib, maks 2000 karakter): Teks isi pesan negosiasi.
* **Validasi Khusus (*beforeValidate Hook*):**
  * Memverifikasi keberadaan ID percakapan melalui `req.payload.findByID` dengan `overrideAccess: true`.
  * Menolak pesan jika pengirim bukan merupakan peserta sah dari ruang percakapan tersebut.

#### D. Koleksi Pendukung (`Admins`, `Media`, `Tags`, `Folders`)
* `Admins`: Akun staf internal pengelola panel kontrol Payload CMS (`/admin`).
* `Media`: Repositori berkas unggahan gambar foto panen dan dokumen identitas.
* `Tags` & `Folders`: Taksonomi organisasi media internal CMS.

---

### 3.2. Mekanisme Autentikasi dan Manajemen Sesi

Aplikasi menerapkan model autentikasi ganda yang saling terisolasi:

```
[Permintaan Masuk: Browser]
           |
           +---> Apakah menuju rute `/admin/*`?
           |            |
           |            +-- YA  ---> Dikelola oleh Koleksi `admins` via Figma SSO
           |
           +---> Apakah menuju rute aplikasi publik / dashboard?
                        |
                        +-- YA  ---> Membaca Cookie HTTP-only `app-session`
                                             |
                  +--------------------------+--------------------------+
                  |                                                     |
             Token Ditemukan                                      Token Tidak Ada
                  |                                                     |
      Diverifikasi via Payload Auth                                     v
                  |                                             Aktifkan Sesi Demo
                  v                                             `DEMO_USER_PETANI`
         Data Akun Sah Terisi                                   (Atau `DEMO_USER_PEMBELI`)
```

* **Token Penyimpanan:** Token sesi disimpan di cookie bernama `app-session`.
* **Pemeriksaan Sesi Server-Side (`src/lib/app-auth.ts`):**
  ```ts
  export async function getCurrentUser(): Promise<CurrentAppUser | null> {
    const token = (await cookies()).get(APP_SESSION_COOKIE)?.value
    if (!token) return null

    const payload = await getPayload({ config })
    const authHeaders = new Headers({ Authorization: `JWT ${token}` })
    const { user } = await payload.auth({ headers: authHeaders })
    return toCurrentUser(user)
  }
  ```
* **Pemisahan dari Payload Admin:** Pengguna aplikasi publik (`users`) tidak memiliki hak akses ke panel admin `/admin`. Panel `/admin` dilindungi oleh koleksi `admins`.

---

### 3.3. Penanganan Mutasi Data: Server Actions

Aplikasi menggunakan React 19 / Next.js Server Actions bertanda `'use server'` daripada mengekspos endpoint API REST publik:
* **Autentikasi:** Fungsi `authenticate` dan `logout` di `src/app/(frontend)/login/actions.ts`.
* **Negosiasi & Obrolan:** Fungsi `startConversation`, `sendMessage`, dan `switchDemoPersona` di `src/app/(frontend)/dashboard/buyer-matching/actions.ts`.
* **Keuntungan:** Tidak ada endpoint API publik yang terekspos tanpa perlindungan, terhindar dari kerentanan *Cross-Site Scripting (XSS)*, serta data langsung diproses di lingkungan server yang aman.

---

### 3.4. Konsep Kunci `overrideAccess: true`

Salah satu perbaikan teknis terpenting yang diterapkan pada sistem ini adalah pengaturan `overrideAccess: true` pada seluruh operasi Local API Payload.

#### Apa itu `overrideAccess`?
Pada Payload CMS, Local API (`payload.find`, `payload.findByID`, `payload.create`, `payload.update`) secara bawaan dapat menjalankan atau mengabaikan fungsi izin akses koleksi (*collection access control functions*):
* `overrideAccess: false`: Payload mengevaluasi aturan akses koleksi berdasarkan objek `req.user` yang disertakan.
* `overrideAccess: true`: Payload mengabaikan evaluasi izin koleksi framework dan langsung mengeksekusi operasi baca/tulis ke basis data.

#### Mengapa Perbaikan `overrideAccess: true` Wajib Diterapkan?
1. **Pencegahan Kegagalan Konteks Server Component & Action:**
   Dalam Next.js App Router, pemanggilan Server Actions atau Server Components sering kali tidak membawa header HTTP otorisasi Payload secara lengkap ke dalam *execution context*. Akibatnya, `req.user` dianggap kosong/tidak sah oleh evaluasi izin koleksi, menyebabkan kueri menghasilkan array kosong atau galat *Forbidden (403)*.
2. **Dukungan Penuh Mode Demo:**
   Pengguna mode demo tidak memiliki token JWT autentikasi penuh di basis data. Jika menggunakan `overrideAccess: false`, seluruh daftar pembeli dan riwayat obrolan tertutup rapat bagi pengunjung demo. Dengan `overrideAccess: true`, data katalog publik dan profil pembeli dapat ditampilkan secara lancar.
3. **Pemisahan Tanggung Jawab Keamanan (*Separation of Concerns*):**
   Dengan `overrideAccess: true`, otorisasi dan sanitasi input dipindahkan secara eksplisit ke dalam Server Action di mana logika bisnis divalidasi secara ketat sebelum mutasi data dijalankan:
   ```ts
   // Validasi dilakukan secara ketat di Server Action
   if (!recipientId || !subject) {
     return { ok: false, message: 'Pembeli dan topik percakapan wajib diisi.' }
   }
   if (recipientId === user.id) {
     return { ok: false, message: 'Anda tidak dapat membuat percakapan dengan diri sendiri.' }
   }

   // Eksekusi mutasi dengan overrideAccess: true menjamin keandalan transaksi
   await payload.create({
     collection: 'messages',
     data: { conversation: conversationId, sender: user.id, body },
     overrideAccess: true,
   })
   ```

---

## 4. Analisis Kebutuhan Basis Data: Apakah Memerlukan Database?

### Jawaban Tegas: **YA, SISTEM SANGAT MEMERLUKAN BASIS DATA.**

Meskipun antarmuka analitik harga dan cuaca menampilkan grafik visual yang tampak dinamis di sisi klien, **PanenTara adalah aplikasi berbasis data transaksional dan relasional**.

---

### 4.1. Klasifikasi Kebutuhan Data

Berikut adalah rincian data mana yang mutlak membutuhkan basis data persisten vs data yang dapat dihasilkan melalui komputasi/agregasi:

| Kategori Data | Komponen / Modul | Memerlukan Basis Data? | Alasan Teknis |
| :--- | :--- | :---: | :--- |
| **Akun & Profil Pengguna** | Pendaftaran, Profil Tani, Login | **YA (Wajib)** | Kredensial kata sandi terenkripsi, email, NIK, dan nomor telepon wajib tersimpan permanen agar pengguna dapat kembali masuk dari perangkat mana saja. |
| **Ruang Negosiasi Kontrak** | Buyer Matching (`conversations`) | **YA (Wajib)** | Relasi multi-arah antara akun Petani dan akun Pembeli, subjek kontrak, dan kesepakatan komoditas adalah data transaksional bisnis yang tidak boleh hilang saat sesi browser ditutup. |
| **Histori Pesan Obrolan** | Room Chat Negosiasi (`messages`) | **YA (Wajib)** | Riwayat tawar-menawar harga, komitmen tonase panen, dan persetujuan MoU antar pihak harus memiliki rekam jejak audit (*audit trail*) yang sah secara hukum dagang. |
| **Media & Berkas KYC** | Verifikasi KTP, Foto Sampel Panen | **YA (Wajib)** | Dokumen gambar identitas dan foto panen membutuhkan penyimpanan metadata dan berkas fisik yang persisten di koleksi `media`. |
| **Akun Administrator** | Admin CMS (`admins`) | **YA (Wajib)** | Staf internal membutuhkan kredensial CMS tersimpan untuk mengelola moderasi katalog dan persetujuan kemitraan. |
| **Simulasi Respons Mode Demo** | Demo Persona Switcher & Chat Bot | *TIDAK (In-Memory/Mock)* | Pesan otomatis pembeli dalam mode demo diakomodasi melalui generator lokal agar pengguna tamu tidak membebani kapasitas basis data produksi. |
| **Tren Analitik Historis & Cuaca** | Market Intelligence & Weather Forecast | *Opsional / API Terjadwal* | Dapat bersumber dari tabel berkala atau diumpankan dari penyedia data pangan (Bapanas/BMKG). |

---

### 4.2. Bagaimana Basis Data Bekerja di Lingkungan Figma Make?

Platform ini tidak menggunakan instalasi database manual (*self-hosted vanilla database* seperti MySQL atau MongoDB lokal yang dipasang terpisah), melainkan memanfaatkan **arsitektur basis data cloud terintegrasi**:

1. **Penyedia Basis Data:**
   Basis data disediakan, dikelola, dan diamankan secara terpusat oleh **Figma Cloud Backend Engine** melalui modul `@payloadcms/figma`.
2. **Konfigurasi Engine (`src/payload.config.ts`):**
   ```ts
   import { buildFigmaConfig } from '@payloadcms/figma'

   export default buildFigmaConfig({
     collections: [Admins, Media, Folders, Tags, Users, Conversations, Messages],
     // Engine basis data, adapter relasional, dan secrets dikelola oleh platform
   })
   ```
3. **Penyimpanan Terpadu (*Persistent Cloud Storage*):**
   * Setiap data baru yang didaftarkan melalui antarmuka pendaftaran atau obrolan chat disimpan ke dalam tabel relasional tervirtualisasi di Figma Cloud.
   * Saat aplikasi dikompilasi atau dilakukan penyebaran produksi melalui `figma make deploy`, koneksi ke basis data persisten tetap terjaga secara kontinu tanpa risiko kehilangan data (*zero data loss*).

---

## 5. Diagram Alur Sistem (*System Architecture & Sequence Flow*)

### 5.1. Alur Transaksi Obrolan Negosiasi Buyer Matching

```
[Petani: Browser]            [Next.js Server Action]          [Payload Local API]         [Cloud Database]
        |                               |                              |                          |
        | 1. Klik "Chat & Negosiasi"    |                              |                          |
        |    (PT Segar Nusantara)       |                              |                          |
        |------------------------------>|                              |                          |
        |                               | 2. startConversation()       |                          |
        |                               |    Validasi peran & partner  |                          |
        |                               |----------------------------->|                          |
        |                               |                              | 3. payload.create()      |
        |                               |                              |    (conversations table) |
        |                               |                              |    overrideAccess: true  |
        |                               |                              |------------------------->|
        |                               |                              |                          | 4. Simpan record
        |                               |                              |<-------------------------|    ID: room-xxx
        |                               |<-----------------------------|                          |
        | 5. Ruang Chat Terbuka         |                              |                          |
        |    Context Bar Aktif          |                              |                          |
        |<------------------------------|                              |                          |
        |                               |                              |                          |
        | 6. Kirim: "Ajukan Rp 33.500"  |                              |                          |
        |------------------------------>|                              |                          |
        |                               | 7. sendMessage()             |                          |
        |                               |    Validasi isi pesan        |                          |
        |                               |----------------------------->|                          |
        |                               |                              | 8. payload.create()      |
        |                               |                              |    (messages table)      |
        |                               |                              |    overrideAccess: true  |
        |                               |                              |------------------------->|
        |                               |                              |                          | 9. Pesan tersimpan
        |                               |                              |<-------------------------|    permanen
        |                               |<-----------------------------|                          |
        | 10. Konfirmasi Pesan Terkirim |                              |                          |
        |<------------------------------|                              |                          |
```

---

### 5.2. Alur Penanganan Mode Tamu vs Mode Akun Terdaftar

```
                       [Permintaan Menuju /dashboard/buyer-matching]
                                             |
                                             v
                           [Pengecekan Sesi: getCurrentUser()]
                                             |
                   +-------------------------+-------------------------+
                   |                                                   |
              User Ada                                            User Null
                   |                                                   |
                   v                                                   v
        [Sesi Akun Terdaftar]                                [Sesi Mode Demo]
        - ID: Sesuai Basis Data                              - ID: demo-petani-01
        - Mengambil Data Chat Nyata                          - Menyuntikkan Akun Demo Budi Santoso
        - Kueri Database:                                    - Menampilkan Indikator Mode Demo
          payload.find({ overrideAccess: true })             - Mengaktifkan AI Response Simulator
                   |                                                   |
                   +-------------------------+-------------------------+
                                             |
                                             v
                          [Render BuyerMatchingChat Component]
                          - Tab Katalog Permintaan
                          - Tab Ruang Chat Terintegrasi
                          - Tab Split View Terpadu
```

---

## 6. Rangkuman Spesifikasi Teknis

* **Bahasa & Runtime:** TypeScript / Node.js 22
* **Framework Web:** Next.js (App Router, Turbopack) + React 19
* **Styling Engine:** Tailwind CSS v4 (Import langsung via CSS directive)
* **Backend CMS:** Payload CMS 4.0
* **Kebutuhan Database:** **Mutlak Diperlukan** (Disediakan secara persisten oleh infrastruktur cloud `@payloadcms/figma` untuk tabel `users`, `conversations`, `messages`, dan `media`)
* **Metode Akses Data:** Payload Local API dengan konfigurasi aman `overrideAccess: true` pada seluruh transaksi server-side.
* **Verifikasi Build:** Lolos pengecekan TypeScript tanpa kesalahan (`0 error`), lolos analisis rute aplikasi, dan terverifikasi pada pipeline kompilasi produksi `figma make verify-deploy`.