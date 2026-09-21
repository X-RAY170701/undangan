import type { LucideIcon } from "lucide-react";
import { Crown, Gem, Heart, Leaf, Mountain, Sparkles, Star } from "lucide-react";

export type TemplateLayout =
  | "classic"
  | "modern-split"
  | "organic"
  | "ornate-frame"
  | "editorial-split"
  | "scrapbook"
  | "gate"
  | "3d-starlight";

export interface WeddingTheme {
  slug: string;
  /** structural composition of Cover/CoupleInfo/Gallery/EventDetail — this is what makes
   * templates feel like different designs, not just different colors */
  layout: TemplateLayout;
  headingFont: string;
  /** used for the big couple names on the cover */
  namesFont: string;
  eyebrow: string;
  icon: LucideIcon;
  iconWrap: string;
  cover: {
    bgClass: string;
    overlay: string;
    eyebrowText: string;
    dateText: string;
  };
  ampersand: string;
  photoRing: string;
  countdownBox: string;
  altSectionBg: string;
  headingText: string;
  detail: {
    sectionBg: string;
    heading: string;
    cardBg: string;
    cardTitle: string;
    cardMuted: string;
    cardStrong: string;
    linkBorder: string;
  };
  guestBookCard: string;
  footerText: string;
  /** shows a click-to-open 3D envelope intro + batik border accents before the invitation content */
  envelopeIntro?: boolean;
}

type RGB = readonly [number, number, number];

/**
 * Setiap tema pada dasarnya cuma butuh 1 warna aksen + beberapa turunan shade-nya —
 * sisanya (kartu kaca-buram, glow, border, hover) SELALU memakai formula yang sama.
 * Sebelum di-refactor, tiap tema menyalin ulang ~15 baris className nyaris identik,
 * yang bikin gampang "drift" (mis. adat-jawa kepakai amber-400 di satu tempat tapi
 * amber-500 di tempat lain tanpa maksud apa pun). Sekarang formulanya cuma ada SATU
 * sumber kebenaran (`buildAccent`), tiap tema tinggal isi token warnanya saja.
 */
interface AccentConfig {
  /** shade utama: border kartu, ampersand, hover:bg tombol solid. Mis. "amber-400". */
  border: string;
  /** shade lebih terang: eyebrow & judul section. Mis. "amber-300". */
  heading: string;
  /** shade tombol/link teks default. Mis. "amber-200". */
  link: string;
  /** shade paling terang: judul di dalam kartu. Mis. "amber-100". */
  cardTitle: string;
  /** rgb dari `border`, dipakai untuk shadow glow rgba() — harus senada. */
  rgb: RGB;
  /** warna teks saat hover di atas tombol solid ber-background `border` (kontras gelap). */
  hoverText: string;
  /** override untuk kasus non-generik (mis. teks redup di atas background yang berwarna). */
  cardMuted?: string;
  footerText?: string;
}

function glassCard(border: string, borderOpacity: number, rgb: RGB, shadowOpacity = 0.5) {
  const [r, g, b] = rgb;
  return `border-${border}/${borderOpacity} bg-white/[0.05] backdrop-blur-sm sm:backdrop-blur-xl shadow-[0_0_40px_-15px_rgba(${r},${g},${b},${shadowOpacity})]`;
}

function buildAccent(cfg: AccentConfig) {
  const [r, g, b] = cfg.rgb;
  return {
    ampersand: `text-${cfg.border}`,
    eyebrowText: `text-${cfg.heading}`,
    detailHeading: `text-${cfg.heading}`,
    countdownBox: glassCard(cfg.border, 25, cfg.rgb),
    photoRing: `border-${cfg.border}/40 bg-white/5`,
    cardBg: glassCard(cfg.border, 20, cfg.rgb),
    cardTitle: `text-${cfg.cardTitle}`,
    cardMuted: cfg.cardMuted ?? "text-neutral-400",
    cardStrong: "text-white",
    linkBorder: `border-${cfg.border}/50 text-${cfg.link} hover:bg-${cfg.border} hover:text-${cfg.hoverText} hover:shadow-[0_0_20px_-2px_rgba(${r},${g},${b},0.6)]`,
    guestBookCard: `border-${cfg.border}/15 bg-white/[0.05] backdrop-blur-sm sm:backdrop-blur-xl`,
    footerText: cfg.footerText ?? "text-neutral-500",
  };
}

/** Field yang SELALU sama di semua tema (dicek: semua 8 tema memang memakai nilai
 * ini tanpa pengecualian) — konstanta, bukan lagi ditulis ulang tiap tema. */
const headingText = "text-neutral-50";
const detailSectionBg = "bg-black";

export const themes: Record<string, WeddingTheme> = {
  elegant: (() => {
    const accent = buildAccent({
      border: "amber-400",
      heading: "amber-300",
      link: "amber-200",
      cardTitle: "amber-100",
      rgb: [251, 191, 36],
      hoverText: "neutral-950",
    });
    return {
      slug: "elegant",
      layout: "classic",
      headingFont: "font-playfair",
      namesFont: "font-space-grotesk",
      eyebrow: "The Wedding Of",
      icon: Sparkles,
      iconWrap: "bg-gradient-to-br from-amber-300 to-amber-500 text-neutral-950",
      cover: {
        bgClass: "bg-gradient-to-br from-neutral-950 via-[#1a1409] to-black",
        overlay: "linear-gradient(180deg, rgba(10,8,4,0.2) 0%, rgba(3,2,1,0.88) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-amber-100/80",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#0a0805]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
  "modern-minimalist": (() => {
    // Satu-satunya tema "monokrom" — aksennya putih polos, jadi tier teksnya
    // (ampersand/eyebrow/judul) dioverride pakai skala abu-abu, bukan turunan
    // langsung dari `border` (yang kalau dipakai apa adanya jadi "text-white"
    // di semua tempat dan kehilangan hierarki).
    const accent = buildAccent({
      border: "white",
      heading: "neutral-300",
      link: "neutral-200",
      cardTitle: "neutral-100",
      rgb: [255, 255, 255],
      hoverText: "neutral-900",
    });
    return {
      slug: "modern-minimalist",
      layout: "modern-split",
      headingFont: "font-space-grotesk",
      namesFont: "font-space-grotesk",
      eyebrow: "TOGETHER WITH THEIR FAMILIES",
      icon: Sparkles,
      iconWrap: "bg-white text-neutral-950",
      cover: {
        bgClass: "bg-gradient-to-br from-neutral-950 to-black",
        overlay: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)",
        eyebrowText: "text-neutral-300",
        dateText: "text-neutral-300",
      },
      ampersand: "text-neutral-300",
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#0a0a0a]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: "text-neutral-100",
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
  "rustic-garden": (() => {
    const accent = buildAccent({
      border: "emerald-400",
      heading: "emerald-300",
      link: "emerald-200",
      cardTitle: "emerald-100",
      rgb: [16, 185, 129],
      hoverText: "neutral-950",
    });
    return {
      slug: "rustic-garden",
      layout: "organic",
      headingFont: "font-cormorant",
      namesFont: "font-space-grotesk",
      eyebrow: "Together With Their Families",
      icon: Leaf,
      iconWrap: "bg-gradient-to-br from-emerald-300 to-teal-400 text-neutral-950",
      cover: {
        bgClass: "bg-gradient-to-br from-neutral-950 via-[#04120c] to-black",
        overlay: "linear-gradient(180deg, rgba(4,18,12,0.2) 0%, rgba(2,8,6,0.88) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-emerald-100/80",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#050e0a]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
  "royal-luxury": (() => {
    // Background cover-nya biru dongker (bukan hitam netral seperti tema lain),
    // jadi teks redup/footer sengaja diberi tint indigo supaya senada — bukan drift.
    const accent = buildAccent({
      border: "yellow-400",
      heading: "yellow-300",
      link: "yellow-200",
      cardTitle: "yellow-100",
      rgb: [250, 204, 21],
      hoverText: "indigo-950",
      cardMuted: "text-indigo-200/70",
      footerText: "text-indigo-300/50",
    });
    return {
      slug: "royal-luxury",
      layout: "ornate-frame",
      headingFont: "font-cinzel",
      namesFont: "font-cinzel",
      eyebrow: "The Wedding Of",
      icon: Crown,
      iconWrap: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-indigo-950",
      cover: {
        bgClass: "bg-gradient-to-br from-indigo-950 via-[#0a0a1a] to-black",
        overlay: "linear-gradient(180deg, rgba(10,10,30,0.2) 0%, rgba(3,3,10,0.88) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-yellow-100/80",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#07070f]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
  "romantic-blush": (() => {
    const accent = buildAccent({
      border: "rose-400",
      heading: "rose-300",
      link: "rose-200",
      cardTitle: "rose-100",
      rgb: [244, 114, 182],
      hoverText: "neutral-950",
    });
    return {
      slug: "romantic-blush",
      layout: "scrapbook",
      headingFont: "font-cormorant",
      namesFont: "font-space-grotesk",
      eyebrow: "The Wedding Of",
      icon: Heart,
      iconWrap: "bg-gradient-to-br from-rose-300 to-pink-400 text-neutral-950",
      cover: {
        bgClass: "bg-gradient-to-br from-neutral-950 via-[#160910] to-black",
        overlay: "linear-gradient(180deg, rgba(30,10,20,0.2) 0%, rgba(8,3,6,0.88) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-rose-100/80",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#0f070a]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
  "heritage-maroon": (() => {
    const accent = buildAccent({
      border: "red-400",
      heading: "red-300",
      link: "red-200",
      cardTitle: "red-100",
      rgb: [239, 68, 68],
      hoverText: "neutral-950",
    });
    return {
      slug: "heritage-maroon",
      layout: "editorial-split",
      headingFont: "font-playfair",
      namesFont: "font-space-grotesk",
      eyebrow: "The Wedding Of",
      icon: Gem,
      iconWrap: "bg-gradient-to-br from-red-400 to-red-600 text-neutral-950",
      cover: {
        bgClass: "bg-gradient-to-br from-neutral-950 via-[#170505] to-black",
        overlay: "linear-gradient(180deg, rgba(30,5,5,0.2) 0%, rgba(8,2,2,0.88) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-red-100/80",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#0e0505]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
  "adat-jawa": (() => {
    // FIX konsistensi: sebelum refactor, countdownBox memakai border amber-400
    // sementara photoRing & detail.cardBg memakai amber-500 — beda tanpa alasan.
    // Disatukan ke amber-500 (dipakai 2 dari 3 tempat sebelumnya).
    const accent = buildAccent({
      border: "amber-500",
      heading: "amber-300",
      link: "amber-200",
      cardTitle: "amber-100",
      rgb: [217, 119, 6],
      hoverText: "neutral-950",
    });
    return {
      slug: "adat-jawa",
      layout: "gate",
      headingFont: "font-playfair",
      namesFont: "font-playfair",
      eyebrow: "Manten Kagungan Damel",
      icon: Mountain,
      iconWrap: "bg-gradient-to-br from-amber-300 to-amber-600 text-neutral-950",
      cover: {
        bgClass: "bg-gradient-to-br from-neutral-950 via-[#140d05] to-black",
        overlay: "linear-gradient(180deg, rgba(25,15,5,0.2) 0%, rgba(6,4,1,0.88) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-amber-100/80",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#0c0803]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
      envelopeIntro: true,
    };
  })(),
  "starlight-3d": (() => {
    // Sengaja 1 tingkat lebih terang (amber-300 sbg border, bukan amber-400
    // seperti elegant/adat-jawa) karena latar 3D-nya jauh lebih gelap/pekat
    // (#05040a) dan warnanya harus senada dengan partikel emas di StarlightScene.
    const accent = buildAccent({
      border: "amber-300",
      heading: "amber-200",
      link: "amber-200",
      cardTitle: "amber-100",
      rgb: [252, 211, 77],
      hoverText: "neutral-950",
    });
    return {
      slug: "starlight-3d",
      layout: "3d-starlight",
      headingFont: "font-cormorant",
      namesFont: "font-cinzel",
      eyebrow: "The Wedding Of",
      icon: Star,
      iconWrap: "bg-gradient-to-br from-amber-200 to-yellow-500 text-neutral-950",
      cover: {
        bgClass: "bg-[#05040a]",
        overlay: "linear-gradient(180deg, rgba(5,4,10,0.1) 0%, rgba(5,4,10,0.9) 100%)",
        eyebrowText: accent.eyebrowText,
        dateText: "text-amber-100/70",
      },
      ampersand: accent.ampersand,
      countdownBox: accent.countdownBox,
      photoRing: accent.photoRing,
      altSectionBg: "bg-[#07050f]",
      headingText,
      detail: {
        sectionBg: detailSectionBg,
        heading: accent.detailHeading,
        cardBg: accent.cardBg,
        cardTitle: accent.cardTitle,
        cardMuted: accent.cardMuted,
        cardStrong: accent.cardStrong,
        linkBorder: accent.linkBorder,
      },
      guestBookCard: accent.guestBookCard,
      footerText: accent.footerText,
    };
  })(),
};

/** Plain-data subset of a theme, safe to pass into "use client" components
 * (the `icon` component reference can't cross the server/client boundary). */
export type ThemeStyle = Omit<WeddingTheme, "icon">;

export const defaultTheme = themes.elegant;

export function getTheme(slug: string | null | undefined): WeddingTheme {
  if (!slug) return defaultTheme;
  return themes[slug] ?? defaultTheme;
}
