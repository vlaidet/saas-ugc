import type { Brand } from "./types";

const today = new Date();
const daysAgo = (days: number) =>
  new Date(today.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

export const MOCK_BRANDS: Brand[] = [
  {
    id: "brand-001",
    name: "Laneige",
    niche: "Skincare",
    channel: "Instagram",
    profileUrl: "https://instagram.com/laneige_fr",
    status: "À contacter",
    contacts: [],
    createdAt: daysAgo(30),
  },
  {
    id: "brand-002",
    name: "Danone",
    niche: "Food",
    channel: "Email",
    email: "partnerships@danone.fr",
    status: "Contactée",
    contacts: [
      {
        id: "contact-001",
        date: daysAgo(12),
        channel: "Email",
        message: "Demande de collaboration influenceur",
        response: "Merci pour votre intérêt, nous étudions votre profil",
      },
    ],
    createdAt: daysAgo(45),
  },
  {
    id: "brand-003",
    name: "De'Longhi France",
    niche: "Électroménager",
    channel: "LinkedIn",
    profileUrl: "https://linkedin.com/company/delonghi-france",
    status: "En discussion",
    contacts: [
      {
        id: "contact-002",
        date: daysAgo(5),
        channel: "Email",
        message: "Appel avec le responsable marketing",
        response:
          "Partenariat intéressant, nous reviendrons avec une offre formelle",
      },
    ],
    createdAt: daysAgo(20),
  },
  {
    id: "brand-004",
    name: "Babymoov",
    niche: "Puériculture",
    channel: "Formulaire",
    email: "contact@babymoov.com",
    status: "Deal signé",
    contacts: [
      {
        id: "contact-003",
        date: daysAgo(2),
        channel: "Email",
        message: "Contrat signé pour 3 contenus vidéo",
        response: "Deal confirmé ! Envoi des livrables le 15 du mois",
      },
    ],
    createdAt: daysAgo(60),
  },
  {
    id: "brand-005",
    name: "Air France",
    niche: "Voyage",
    channel: "Instagram",
    profileUrl: "https://instagram.com/airfrance",
    status: "Contactée",
    contacts: [
      {
        id: "contact-004",
        date: daysAgo(15),
        channel: "Instagram",
        message: "Demande DM pour partenariat voyage",
      },
    ],
    createdAt: daysAgo(50),
  },
  {
    id: "brand-006",
    name: "ASOS",
    niche: "Mode",
    channel: "Email",
    email: "influencer@asos.com",
    status: "Refus",
    contacts: [
      {
        id: "contact-005",
        date: daysAgo(25),
        channel: "Email",
        message: "Demande de partenariat mode",
        response: "Merci, mais nous ne collaborons pas pour cette période",
      },
    ],
    createdAt: daysAgo(55),
  },
  {
    id: "brand-007",
    name: "Nespresso",
    niche: "Food",
    channel: "LinkedIn",
    profileUrl: "https://linkedin.com/company/nespresso",
    status: "À contacter",
    contacts: [],
    createdAt: daysAgo(8),
  },
  {
    id: "brand-008",
    name: "Maisons du Monde",
    niche: "Maison",
    channel: "Email",
    email: "influencer.relations@maisonsdumonde.com",
    status: "Blacklist",
    contacts: [
      {
        id: "contact-006",
        date: daysAgo(90),
        channel: "Email",
        message: "Proposition de partenariat",
        response: "Pas de suivi - problèmes de communication",
      },
    ],
    createdAt: daysAgo(100),
  },
  {
    id: "brand-009",
    name: "Clarins",
    niche: "Skincare",
    channel: "Formulaire",
    email: "partnerships@clarins.fr",
    status: "Contactée",
    contacts: [
      {
        id: "contact-007",
        date: daysAgo(10),
        channel: "Email",
        message: "Envoi du média kit et rate card",
      },
    ],
    createdAt: daysAgo(35),
  },
  {
    id: "brand-010",
    name: "Dyson",
    niche: "Électroménager",
    channel: "Instagram",
    profileUrl: "https://instagram.com/dyson_fr",
    status: "En discussion",
    contacts: [
      {
        id: "contact-008",
        date: daysAgo(3),
        channel: "Instagram",
        message: "Appel en visio scheduling",
        response: "RDV confirmé le 20 mars pour détails contrat",
      },
    ],
    createdAt: daysAgo(25),
  },
];
