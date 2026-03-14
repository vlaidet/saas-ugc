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
  date: string; // ISO string
  channel: ContactChannel;
  message: string;
  response?: string;
};

export type Brand = {
  id: string;
  name: string;
  niche: BrandNiche;
  channel: ContactChannel;
  profileUrl?: string;
  email?: string;
  notes?: string;
  status: BrandStatus;
  contacts: ContactEntry[];
  createdAt: string; // ISO string
};

export type PipelineFilters = {
  niche: BrandNiche | "all";
  status: BrandStatus | "all";
  channel: ContactChannel | "all";
  search: string;
};

export type PipelineView = "kanban" | "list";
