import type {
  CustomVariable,
  MessageTemplate,
  TemplateVariable,
} from "./types";

export const VARIABLE_CONFIG: Record<
  TemplateVariable,
  { label: string; placeholder: string; example: string }
> = {
  nom_marque: {
    label: "Nom de la marque",
    placeholder: "Ex: L'Oréal",
    example: "GlowSkin",
  },
  produit: {
    label: "Produit",
    placeholder: "Ex: Sérum vitamine C",
    example: "Sérum éclat",
  },
  niche: {
    label: "Niche",
    placeholder: "Ex: Skincare",
    example: "Skincare",
  },
  prenom_creatrice: {
    label: "Prénom créatrice",
    placeholder: "Ex: Elsa",
    example: "Elsa",
  },
};

/** Regex pour extraire les variables {{...}} du contenu */
export const VARIABLE_REGEX = /\{\{(\w+)\}\}/g;

/** Seuils pour la barre de progression du taux de réponse */
export const RATE_THRESHOLDS = {
  low: 10,
  high: 30,
} as const;

/** Couleurs de la barre selon le taux */
export function getRateColor(rate: number): string {
  if (rate < RATE_THRESHOLDS.low) return "#DC2626";
  if (rate < RATE_THRESHOLDS.high) return "#C4621D";
  return "#059669";
}

/** Calcule le taux de réponse */
export function getResponseRate(
  timesUsed: number,
  timesReplied: number,
): number {
  if (timesUsed === 0) return 0;
  return Math.round((timesReplied / timesUsed) * 100);
}

/** Extrait les noms de variables uniques d'un contenu */
export function extractVariables(content: string): string[] {
  const matches = content.matchAll(VARIABLE_REGEX);
  const unique = new Set<string>();
  for (const match of matches) {
    unique.add(match[1]);
  }
  return [...unique];
}

/** Génère une clé de variable à partir d'un label (ex: "Budget Maximum" → "budget_maximum") */
export function formatVariableKey(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

/** Récupère la config d'une variable (défaut, custom, ou auto-générée) */
export function getVariableConfig(
  key: string,
  customVariables: CustomVariable[],
): { label: string; placeholder: string } {
  if (key in VARIABLE_CONFIG) {
    const config = VARIABLE_CONFIG[key as TemplateVariable];
    return { label: config.label, placeholder: config.placeholder };
  }

  const custom = customVariables.find((v) => v.key === key);
  if (custom) {
    return { label: custom.label, placeholder: custom.placeholder };
  }

  const autoLabel = key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    label: autoLabel,
    placeholder: `Valeur de ${autoLabel.toLowerCase()}`,
  };
}

/** Remplace les variables par des valeurs */
export function renderTemplate(
  content: string,
  values: Record<string, string>,
): string {
  return content.replace(
    VARIABLE_REGEX,
    (_, key: string) => values[key] ?? `{{${key}}}`,
  );
}

/** Templates mockés pré-remplis */
export const MOCK_TEMPLATES: Omit<
  MessageTemplate,
  "id" | "createdAt" | "updatedAt"
>[] = [
  {
    title: "DM Instagram — Généraliste",
    channel: "Instagram",
    niche: "Skincare",
    content:
      "Bonjour 👋 J'ai découvert {{nom_marque}} sur Instagram et vos produits m'ont tout de suite parlé. Je suis Elsa, créatrice UGC spécialisée en {{niche}}.\nJe crée du contenu authentique que vous pouvez utiliser directement sur vos réseaux ou en publicité.\nÇa vous intéresse qu'on en discute ? 🎬",
    timesUsed: 47,
    timesReplied: 18,
  },
  {
    title: "Email Cold Outreach",
    channel: "Email",
    niche: "Skincare",
    content:
      "Objet : Contenu UGC pour {{nom_marque}} — collaboration ?\n\nBonjour,\nJe m'appelle {{prenom_creatrice}}, créatrice de contenu UGC spécialisée en {{niche}}.\nJe crée des vidéos authentiques pensées pour convertir, utilisables en organique ou en ads.\nJ'ai remarqué que {{nom_marque}} pourrait bénéficier de ce type de contenu pour engager davantage votre audience.\nSeriez-vous disponible pour un échange rapide ?\nÀ bientôt,",
    timesUsed: 32,
    timesReplied: 11,
  },
  {
    title: "Relance J+7",
    channel: "Instagram",
    niche: "Skincare",
    content:
      "Bonjour 👋 Je me permets de revenir vers vous suite à mon message de la semaine dernière concernant une collaboration UGC pour {{nom_marque}}.\nEst-ce que c'est quelque chose qui pourrait vous intéresser ?\nJe reste disponible si vous avez des questions 😊",
    timesUsed: 25,
    timesReplied: 9,
  },
];
