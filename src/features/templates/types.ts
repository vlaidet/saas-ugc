import type { BrandNiche, ContactChannel } from "@/features/pipeline/types";

export type MessageTemplate = {
  id: string;
  title: string;
  channel: ContactChannel;
  niche: BrandNiche;
  content: string;
  timesUsed: number;
  timesReplied: number;
  createdAt: string;
  updatedAt: string;
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
