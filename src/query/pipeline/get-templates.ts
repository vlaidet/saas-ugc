import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const templateSelect = {
  id: true,
  title: true,
  channel: true,
  niche: true,
  content: true,
  timesUsed: true,
  timesReplied: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MessageTemplateSelect;

const customVariableSelect = {
  id: true,
  key: true,
  label: true,
  placeholder: true,
} satisfies Prisma.CustomVariableSelect;

export const getTemplatesByUserId = async (userId: string) => {
  return prisma.messageTemplate.findMany({
    where: { userId },
    select: templateSelect,
    orderBy: { createdAt: "desc" },
  });
};

export const getCustomVariablesByUserId = async (userId: string) => {
  return prisma.customVariable.findMany({
    where: { userId },
    select: customVariableSelect,
    orderBy: { createdAt: "asc" },
  });
};

export type TemplateWithStats = Prisma.PromiseReturnType<
  typeof getTemplatesByUserId
>[number];
