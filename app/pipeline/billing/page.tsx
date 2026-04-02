import { getRequiredUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import { getOrgActiveSubscription } from "@/lib/organizations/get-org-subscription";
import { AUTH_PLANS, getPlanFeatures } from "@/lib/auth/stripe/auth-plans";
import { Suspense } from "react";
import { BillingClient } from "./billing-client";

export const metadata = {
  title: "Abonnement",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BillingPage />
    </Suspense>
  );
}

async function BillingPage() {
  const user = await getRequiredUser();

  const member = await prisma.member.findFirst({
    where: { userId: user.id },
    select: {
      organization: {
        select: { id: true, slug: true, stripeCustomerId: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const orgId = member?.organization.id;
  const subscription = orgId ? await getOrgActiveSubscription(orgId) : null;

  const currentPlan = subscription?.plan ?? "free";
  const plans = AUTH_PLANS.map((plan) => ({
    name: plan.name,
    description: plan.description,
    price: plan.price,
    yearlyPrice: plan.yearlyPrice ?? 0,
    currency: plan.currency,
    isPopular: plan.isPopular ?? false,
    features: getPlanFeatures(plan),
  }));

  return (
    <BillingClient
      currentPlan={currentPlan}
      subscriptionStatus={subscription?.status ?? null}
      cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? null}
      plans={plans}
    />
  );
}
