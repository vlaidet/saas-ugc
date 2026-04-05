"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MessageTemplateSchema = z.object({
  title: z.string().min(1),
  channel: z.string().min(1),
  niche: z.string().min(1),
  content: z.string().min(1),
});

export const createTemplateAction = authAction
  .inputSchema(MessageTemplateSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const template = await prisma.messageTemplate.create({
      data: {
        ...parsedInput,
        userId: user.id,
        timesUsed: 0,
        timesReplied: 0,
      },
    });
    return template;
  });

export const updateTemplateAction = authAction
  .inputSchema(
    z.object({
      id: z.string(),
      data: MessageTemplateSchema.partial(),
    }),
  )
  .action(async ({ parsedInput: { id, data }, ctx: { user } }) => {
    const existing = await prisma.messageTemplate.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Modèle de message introuvable.");
    }

    return prisma.messageTemplate.update({
      where: { id },
      data,
    });
  });

export const deleteTemplateAction = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const existing = await prisma.messageTemplate.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Modèle de message introuvable.");
    }

    await prisma.messageTemplate.delete({ where: { id } });
    return { deleted: true };
  });

export const duplicateTemplateAction = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const original = await prisma.messageTemplate.findFirst({
      where: { id, userId: user.id },
    });

    if (!original) {
      throw new ActionError("Modèle de message introuvable.");
    }

    const copy = await prisma.messageTemplate.create({
      data: {
        title: `${original.title} (copie)`,
        channel: original.channel,
        niche: original.niche,
        content: original.content,
        userId: user.id,
        timesUsed: 0,
        timesReplied: 0,
      },
    });

    return copy;
  });

export const incrementUsedAction = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const existing = await prisma.messageTemplate.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Modèle de message introuvable.");
    }

    return prisma.messageTemplate.update({
      where: { id },
      data: { timesUsed: { increment: 1 } },
    });
  });

export const incrementRepliedAction = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const existing = await prisma.messageTemplate.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Modèle de message introuvable.");
    }

    return prisma.messageTemplate.update({
      where: { id },
      data: { timesReplied: { increment: 1 } },
    });
  });

const CustomVariableSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  placeholder: z.string().min(1),
});

export const addCustomVariableAction = authAction
  .inputSchema(CustomVariableSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const variable = await prisma.customVariable.upsert({
      where: { userId_key: { userId: user.id, key: parsedInput.key } },
      update: {
        label: parsedInput.label,
        placeholder: parsedInput.placeholder,
      },
      create: {
        ...parsedInput,
        userId: user.id,
      },
    });
    return variable;
  });

export const deleteCustomVariableAction = authAction
  .inputSchema(z.object({ key: z.string() }))
  .action(async ({ parsedInput: { key }, ctx: { user } }) => {
    const existing = await prisma.customVariable.findFirst({
      where: { userId: user.id, key },
    });

    if (!existing) {
      throw new ActionError("Variable personnalisée introuvable.");
    }

    await prisma.customVariable.delete({
      where: { userId_key: { userId: user.id, key } },
    });
    return { deleted: true };
  });
