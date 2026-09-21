export type OrderStatus = "pending" | "paid" | "failed";
export type InvitationStatus = "draft" | "published";
export type Attendance = "hadir" | "tidak_hadir";

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  template_id: string;
  status: OrderStatus;
  midtrans_order_id: string;
  amount: number;
  created_at: string;
}

export interface InvitationEvent {
  name: string; // contoh: "Akad Nikah", "Resepsi"
  date: string; // ISO date, contoh: "2026-10-10"
  startTime: string; // "08:00"
  endTime: string; // "11:00"
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
}

export interface InvitationData {
  groomName: string;
  groomFullName: string;
  groomParents: string;
  brideName: string;
  brideFullName: string;
  brideParents: string;
  coverPhotoUrl: string;
  events: InvitationEvent[];
  loveStory: string;
  galleryUrls: string[];
  musicUrl: string;
  rsvpEnabled: boolean;
  guestBookEnabled: boolean;
}

export const emptyInvitationData: InvitationData = {
  groomName: "",
  groomFullName: "",
  groomParents: "",
  brideName: "",
  brideFullName: "",
  brideParents: "",
  coverPhotoUrl: "",
  events: [
    {
      name: "Akad Nikah",
      date: "",
      startTime: "",
      endTime: "",
      venueName: "",
      venueAddress: "",
      mapsUrl: "",
    },
  ],
  loveStory: "",
  galleryUrls: [],
  musicUrl: "",
  rsvpEnabled: true,
  guestBookEnabled: true,
};

export interface Invitation {
  id: string;
  order_id: string;
  user_id: string;
  template_id: string;
  slug: string;
  data: InvitationData;
  status: InvitationStatus;
  created_at: string;
  updated_at: string;
}

export interface RsvpResponse {
  id: string;
  invitation_id: string;
  guest_name: string;
  attendance: Attendance;
  guest_count: number;
  message: string | null;
  created_at: string;
}
