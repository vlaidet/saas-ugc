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

export const STATUS_COLORS: Record<
  BrandStatus,
  { bg: string; text: string; border: string; topBorder: string }
> = {
  "À contacter": {
    bg: "#F3F4F6",
    text: "#374151",
    border: "#D1D5DB",
    topBorder: "#9CA3AF",
  },
  Contactée: {
    bg: "#DBEAFE",
    text: "#1D4ED8",
    border: "#BFDBFE",
    topBorder: "#3B82F6",
  },
  "En discussion": {
    bg: "#FEF3C7",
    text: "#D97706",
    border: "#FDE68A",
    topBorder: "#F59E0B",
  },
  "Deal signé": {
    bg: "#D1FAE5",
    text: "#065F46",
    border: "#A7F3D0",
    topBorder: "#10B981",
  },
  Refus: {
    bg: "#FEE2E2",
    text: "#991B1B",
    border: "#FECACA",
    topBorder: "#EF4444",
  },
  Blacklist: {
    bg: "#F3F4F6",
    text: "#111827",
    border: "#9CA3AF",
    topBorder: "#374151",
  },
};

export const NICHE_COLORS: Record<BrandNiche, string> = {
  Skincare: "#EC4899",
  Food: "#F97316",
  Électroménager: "#3B82F6",
  Puériculture: "#A855F7",
  Voyage: "#14B8A6",
  Mode: "#F43F5E",
  Maison: "#F59E0B",
  Autre: "#6B7280",
};

export const FOLLOWUP_DAYS = 7;
