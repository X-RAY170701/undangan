import type { InvitationData, RsvpResponse } from "@/types/invitation";

export const sampleInvitationData: InvitationData = {
  groomName: "Raka",
  groomFullName: "Raka Pratama",
  groomParents: "Bpk. Hendra & Ibu Sari",
  brideName: "Ayu",
  brideFullName: "Ayu Kirana",
  brideParents: "Bpk. Wibowo & Ibu Rina",
  coverPhotoUrl: "https://picsum.photos/seed/undangan-cover/1200/1600",
  events: [
    {
      name: "Akad Nikah",
      date: "2026-12-12",
      startTime: "08:00",
      endTime: "10:00",
      venueName: "Masjid Al-Ikhlas",
      venueAddress: "Jl. Melati No. 10, Jakarta Selatan",
      mapsUrl: "",
    },
    {
      name: "Resepsi",
      date: "2026-12-12",
      startTime: "11:00",
      endTime: "14:00",
      venueName: "Grand Ballroom Hotel Mulia",
      venueAddress: "Jl. Asia Afrika, Jakarta",
      mapsUrl: "",
    },
  ],
  loveStory:
    "Kami bertemu pertama kali di bangku kuliah, tahun 2018. Dari teman sekelompok tugas, perlahan tumbuh rasa yang lebih dari sekadar pertemanan.\n\nSetelah 5 tahun bersama melewati suka dan duka, kami memutuskan untuk melangkah ke jenjang yang lebih serius.",
  galleryUrls: [
    "https://picsum.photos/seed/undangan-1/600/600",
    "https://picsum.photos/seed/undangan-2/600/600",
    "https://picsum.photos/seed/undangan-3/600/600",
  ],
  musicUrl: "",
  rsvpEnabled: true,
  guestBookEnabled: true,
};

export const sampleRsvpResponses: RsvpResponse[] = [
  {
    id: "sample-1",
    invitation_id: "preview",
    guest_name: "Dina Marlina",
    attendance: "hadir",
    guest_count: 2,
    message: "Selamat menempuh hidup baru, semoga bahagia selalu! 🎉",
    created_at: new Date().toISOString(),
  },
  {
    id: "sample-2",
    invitation_id: "preview",
    guest_name: "Budi Santoso",
    attendance: "hadir",
    guest_count: 1,
    message: "Barakallahu lakuma, selamat ya!",
    created_at: new Date().toISOString(),
  },
];
