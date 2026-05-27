import type { InvitationData } from './types';

export const DEFAULT_INVITATION_DATA: InvitationData = {
  id: '',
  title: 'Undangan Pernikahan Putri & Budi',
  message:
    'Dengan memohon rahmat dan ridha Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir.',
  bride: {
    nickname: 'Putri',
    fullName: 'NUR PUTRI RAHAYU',
    birthOrder: 'Putri pertama dari',
    father: 'Bapak Sudarsono',
    mother: 'Ibu Sri Wahyuni',
  },
  groom: {
    nickname: 'Budi',
    fullName: 'BUDI SANTOSO',
    birthOrder: 'Putra pertama dari',
    father: 'Bapak Suparman',
    mother: 'Ibu Siti Aminah',
  },
  ceremony: {
    date: '2026-07-26',
    time: '08:00',
    locationName: 'Kediaman Mempelai Wanita',
    address: 'Jl. Contoh No. 1 RT. 01 RW. 01 Kel. Contoh Kec. Contoh Kota',
    mapsUrl: 'https://maps.app.goo.gl/contoh',
  },
  reception: {
    date: '2026-07-26',
    time: '13:00',
    locationName: 'Kediaman Mempelai Wanita',
    address: 'Jl. Contoh No. 1 RT. 01 RW. 01 Kel. Contoh Kec. Contoh Kota',
    mapsUrl: 'https://maps.app.goo.gl/contoh',
  },
  loveStory: [
    {
      date: '1 Januari 2025',
      title: 'Pertemuan Pertama',
      content:
        'Pertemuan pertama yang tidak pernah disangka akan terjadi melalui rekan sejawat tanpa disangka menjadi cerita kami.',
    },
    {
      date: '1 Juni 2026',
      title: 'Komitmen Awal',
      content:
        'Setelah menjalani hubungan selama setahun dan menemukan kecocokan, akhirnya kami memutuskan untuk menjalin hubungan ke jenjang yang lebih serius.',
    },
    {
      date: '26 Juli 2026',
      title: 'Pernikahan',
      content:
        'Kami melangsungkan pernikahan sebagai langkah untuk membawa hubungan ini ke jenjang yang lebih serius untuk hidup dan menua bersama.',
    },
  ],
  gift: {
    bankName: 'BCA',
    accountNumber: '0000000000',
    accountName: 'NUR PUTRI RAHAYU',
    ewalletProvider: '',
    ewalletNumber: '',
    ewalletName: '',
  },
};
