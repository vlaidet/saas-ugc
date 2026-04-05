import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const brandContactSelect = {
  id: true,
  date: true,
  channel: true,
  message: true,
  response: true,
} satisfies Prisma.BrandContactSelect;

const brandSelect = {
  id: true,
  name: true,
  niche: true,
  channel: true,
  profileUrl: true,
  email: true,
  notes: true,
  product: true,
  status: true,
  createdAt: true,
  contacts: {
    select: brandContactSelect,
    orderBy: { date: "asc" as const },
  },
} satisfies Prisma.BrandSelect;

export const getBrandsByUserId = async (userId: string) => {
  return prisma.brand.findMany({
    where: { userId },
    select: brandSelect,
    orderBy: { createdAt: "desc" },
  });
};

export type BrandWithContacts = Prisma.PromiseReturnType<
  typeof getBrandsByUserId
>[number];
