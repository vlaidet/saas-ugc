import type { BrandNiche, BrandStatus, ContactChannel } from "./types";

export const NICHES: BrandNiche[] = [
  "Skincare",
  "Food",
  "Électroménager",
  "Puériculture",
  "Voyage",
  "Mode",
  "Maison",
  "Autre",
];

export const CHANNELS: ContactChannel[] = [
  "Instagram",
  "Email",
  "LinkedIn",
  "Formulaire",
];

export const STATUSES: BrandStatus[] = [
  "À contacter",
  "Contactée",
  "En discussion",
  "Deal signé",
  "Refus",
  "Blacklist",
];

export const NICHE_COLORS: Record<BrandNiche, string> = {
  Skincare: "#C17B8A",
  Food: "#C4813A",
  Électroménager: "#5F8FBA",
  Puériculture: "#8F6AB0",
  Voyage: "#3D9E8E",
  Mode: "#B05E82",
  Maison: "#A88B28",
  Autre: "#7A7A7A",
};

export const STATUS_CONFIG: Record<
  BrandStatus,
  { dot: string; bg: string; text: string; border: string }
> = {
  "À contacter": {
    dot: "#9CA3AF",
    bg: "#F5F0EB",
    text: "#6B4226",
    border: "#C9BEB2",
  },
  Contactée: {
    dot: "#3B82F6",
    bg: "#EFF6FF",
    text: "#1D4ED8",
    border: "#60A5FA",
  },
  "En discussion": {
    dot: "#D97706",
    bg: "#FFFBEB",
    text: "#92400E",
    border: "#FCD34D",
  },
  "Deal signé": {
    dot: "#059669",
    bg: "#ECFDF5",
    text: "#065F46",
    border: "#34D399",
  },
  Refus: {
    dot: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
    border: "#FCA5A5",
  },
  Blacklist: {
    dot: "#374151",
    bg: "#F3F4F6",
    text: "#374151",
    border: "#9CA3AF",
  },
};

export const STATUS_COLORS: Record<
  BrandStatus,
  { bg: string; text: string; border: string; topBorder: string }
> = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [
    k,
    { bg: v.bg, text: v.text, border: v.dot, topBorder: v.border },
  ]),
) as Record<
  BrandStatus,
  { bg: string; text: string; border: string; topBorder: string }
>;

export const FOLLOWUP_DAYS = 7;

export const CHANNEL_CONFIG: Record<
  ContactChannel,
  { gradient: string; textColor: string }
> = {
  Instagram: {
    gradient: "linear-gradient(135deg, #833AB4 0%, #C13584 50%, #E1306C 100%)",
    textColor: "white",
  },
  LinkedIn: {
    gradient: "linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)",
    textColor: "white",
  },
  Email: {
    gradient: "linear-gradient(135deg, #C4621D 0%, #E8843A 100%)",
    textColor: "white",
  },
  Formulaire: {
    gradient: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
    textColor: "white",
  },
};
