"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const BrandSchema = z.object({
  name: z.string().min(1),
  niche: z.string().min(1),
  channel: z.string().min(1),
  profileUrl: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  notes: z.string().optional(),
  product: z.string().optional(),
  status: z.string().default("À contacter"),
});

export const createBrandAction = authAction
  .inputSchema(BrandSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const brand = await prisma.brand.create({
      data: {
        ...parsedInput,
        email: parsedInput.email || null,
        userId: user.id,
      },
    });
    return brand;
  });

export const updateBrandAction = authAction
  .inputSchema(
    z.object({
      id: z.string(),
      data: BrandSchema.partial(),
    }),
  )
  .action(async ({ parsedInput: { id, data }, ctx: { user } }) => {
    const existing = await prisma.brand.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Marque introuvable.");
    }

    return prisma.brand.update({
      where: { id },
      data: {
        ...data,
        email: data.email || null,
      },
    });
  });

export const deleteBrandAction = authAction
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const existing = await prisma.brand.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Marque introuvable.");
    }

    await prisma.brand.delete({ where: { id } });
    return { deleted: true };
  });

export const changeStatusAction = authAction
  .inputSchema(
    z.object({
      id: z.string(),
      status: z.string(),
    }),
  )
  .action(async ({ parsedInput: { id, status }, ctx: { user } }) => {
    const existing = await prisma.brand.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      throw new ActionError("Marque introuvable.");
    }

    return prisma.brand.update({
      where: { id },
      data: { status },
    });
  });

export const addContactAction = authAction
  .inputSchema(
    z.object({
      brandId: z.string(),
      date: z.string(),
      channel: z.string(),
      message: z.string().min(1),
      response: z.string().optional(),
    }),
  )
  .action(async ({ parsedInput, ctx: { user } }) => {
    const brand = await prisma.brand.findFirst({
      where: { id: parsedInput.brandId, userId: user.id },
    });

    if (!brand) {
      throw new ActionError("Marque introuvable.");
    }

    return prisma.brandContact.create({
      data: {
        brandId: parsedInput.brandId,
        date: new Date(parsedInput.date),
        channel: parsedInput.channel,
        message: parsedInput.message,
        response: parsedInput.response ?? null,
      },
    });
  });
