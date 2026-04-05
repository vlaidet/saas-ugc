import type { BrandNiche, ContactChannel } from "@/features/pipeline/types";

export type MessageTemplate = {
  id: string;
  title: string;
  channel: string;
  niche: string;
  content: string;
  timesUsed: number;
  timesReplied: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type TemplateFilters = {
  channel: ContactChannel | "all";
  niche: BrandNiche | "all";
  search: string;
};

export type TemplateSortBy = "responseRate" | "timesUsed" | "newest";

export type TemplateVariable =
  | "nom_marque"
  | "produit"
  | "niche"
  | "prenom_creatrice";

export type CustomVariable = {
  key: string;
  label: string;
  placeholder: string;
};
