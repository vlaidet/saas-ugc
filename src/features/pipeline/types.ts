export type BrandNiche =
  | "Skincare"
  | "Food"
  | "Électroménager"
  | "Puériculture"
  | "Voyage"
  | "Mode"
  | "Maison"
  | "Autre";
export type ContactChannel = "Instagram" | "Email" | "LinkedIn" | "Formulaire";
export type BrandStatus =
  | "À contacter"
  | "Contactée"
  | "En discussion"
  | "Deal signé"
  | "Refus"
  | "Blacklist";

export type ContactEntry = {
  id: string;
  date: Date | string;
  channel: string;
  message: string;
  response?: string | null;
};

export type Brand = {
  id: string;
  name: string;
  niche: string;
  channel: string;
  profileUrl?: string | null;
  email?: string | null;
  notes?: string | null;
  product?: string | null;
  status: string;
  contacts: ContactEntry[];
  createdAt: Date | string;
};

export type DateRangePreset =
  | "all"
  | "today"
  | "this_week"
  | "last_week"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom";

export type PipelineFilters = {
  niche: BrandNiche | "all";
  status: BrandStatus | "all";
  channel: ContactChannel | "all";
  search: string;
  datePreset: DateRangePreset;
  dateFrom: string;
  dateTo: string;
};

export type PipelineView = "kanban" | "list";
