"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { stripe } from "@/lib/stripe";

const getUserOrg = async (userId: string) => {
  const member = await prisma.member.findFirst({
    where: { userId },
    select: {
      organization: {
        select: {
          id: true,
          slug: true,
          stripeCustomerId: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!member?.organization) {
    throw new ActionError("Aucune organisation trouvée");
  }

  return member.organization;
};

export const openBillingPortalAction = authAction.action(
  async ({ ctx: { user } }) => {
    const org = await getUserOrg(user.id);

    if (!org.stripeCustomerId) {
      throw new ActionError("Aucun compte Stripe associé");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: org.stripeCustomerId,
      return_url: `${getServerUrl()}/pipeline/billing`,
    });

    if (!session.url) {
      throw new ActionError("Impossible de créer la session Stripe");
    }

    return { url: session.url };
  },
);
