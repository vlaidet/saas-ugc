"use client";

import { LoadingButton } from "@/features/form/submit-button";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import {
  CreditCard,
  Check,
  Sparkles,
  Crown,
  Zap,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { openBillingPortalAction } from "./billing.action";

type Plan = {
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  currency: string;
  isPopular: boolean;
  features: string[];
};

type BillingClientProps = {
  currentPlan: string;
  subscriptionStatus: string | null;
  cancelAtPeriodEnd: boolean | null;
  plans: Plan[];
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  active: { label: "Actif", color: "#059669", bg: "#ECFDF5" },
  trialing: { label: "Essai gratuit", color: "#D97706", bg: "#FFFBEB" },
  past_due: { label: "Paiement en retard", color: "#DC2626", bg: "#FEF2F2" },
  canceled: { label: "Annulé", color: "#6B7280", bg: "#F3F4F6" },
};

const PLAN_ICONS: Record<string, React.ElementType> = {
  free: Zap,
  pro: Sparkles,
  ultra: Crown,
};

export function BillingClient({
  currentPlan,
  subscriptionStatus,
  cancelAtPeriodEnd,
  plans,
}: BillingClientProps) {
  const portalMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(openBillingPortalAction());
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const currentPlanData = plans.find((p) => p.name === currentPlan);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: "#FAF6F1" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex flex-shrink-0 items-center gap-3 px-6 py-3"
        style={{
          backgroundColor: "rgba(250,246,241,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #EDE0D0",
        }}
      >
        <SidebarTrigger className="flex-shrink-0" />
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#C4621D" }}
          >
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1
              className="text-base leading-none font-bold"
              style={{ color: "#3D2314" }}
            >
              Abonnement
            </h1>
            <p
              className="mt-0.5 text-xs leading-none"
              style={{ color: "#A89880" }}
            >
              Gérez votre plan et votre facturation
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
          <div className="flex flex-col gap-8">
            {/* Current plan banner */}
            <section
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, #3D2314 0%, #6B4226 100%)",
                boxShadow: "0 4px 24px rgba(61,35,20,0.2)",
              }}
            >
              {/* Subtle pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }}
              />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    {(() => {
                      const PlanIcon = PLAN_ICONS[currentPlan] ?? Zap;
                      return <PlanIcon className="h-6 w-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">
                      Plan actuel
                    </p>
                    <p className="text-xl font-bold text-white capitalize">
                      {currentPlan}
                    </p>
                    {subscriptionStatus && (
                      <div className="mt-1.5 flex items-center gap-2">
                        {(() => {
                          const config = STATUS_CONFIG[subscriptionStatus];
                          return (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-medium"
                              style={{
                                backgroundColor: config.bg,
                                color: config.color,
                              }}
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: config.color }}
                              />
                              {config.label}
                            </span>
                          );
                        })()}
                        {cancelAtPeriodEnd && (
                          <span className="text-xs text-amber-300">
                            Sera annulé en fin de période
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-white">
                    {currentPlanData?.price ?? 0}€
                  </p>
                  <p className="text-sm text-white/50">/mois</p>
                  {currentPlan !== "free" && (
                    <LoadingButton
                      variant="outline"
                      size="sm"
                      className="mt-3 cursor-pointer border-white/20 bg-white/10 text-white hover:bg-white/20"
                      loading={portalMutation.isPending}
                      onClick={() => portalMutation.mutate()}
                    >
                      Gérer l&apos;abonnement
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </LoadingButton>
                  )}
                </div>
              </div>
            </section>

            {/* Plans grid */}
            <div>
              <h2
                className="mb-4 text-sm font-semibold"
                style={{ color: "#3D2314" }}
              >
                Plans disponibles
              </h2>

              <div className="grid gap-5 md:grid-cols-3">
                {plans.map((plan) => {
                  const isCurrent = plan.name === currentPlan;
                  const PlanIcon = PLAN_ICONS[plan.name] ?? Zap;

                  return (
                    <div
                      key={plan.name}
                      className="relative flex flex-col rounded-2xl bg-white p-5 transition-all duration-200"
                      style={{
                        border: isCurrent
                          ? "2px solid #C4621D"
                          : "1px solid #EDE0D0",
                        boxShadow: isCurrent
                          ? "0 4px 16px rgba(196,98,29,0.12)"
                          : "0 1px 3px rgba(61,35,20,0.04)",
                      }}
                    >
                      {/* Popular badge */}
                      {plan.isPopular && !isCurrent && (
                        <div
                          className="absolute -top-2.5 left-4 rounded-lg px-2.5 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: "#C4621D" }}
                        >
                          Populaire
                        </div>
                      )}

                      {/* Current badge */}
                      {isCurrent && (
                        <div
                          className="absolute -top-2.5 left-4 rounded-lg px-2.5 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: "#C4621D" }}
                        >
                          Actuel
                        </div>
                      )}

                      {/* Header */}
                      <div className="mb-4 flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: isCurrent ? "#FEF3EB" : "#F5F0EB",
                          }}
                        >
                          <PlanIcon
                            className="h-5 w-5"
                            style={{
                              color: isCurrent ? "#C4621D" : "#A89880",
                            }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-sm font-bold capitalize"
                            style={{ color: "#3D2314" }}
                          >
                            {plan.name}
                          </p>
                          <p
                            className="text-xs leading-tight"
                            style={{ color: "#A89880" }}
                          >
                            {plan.description}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-5">
                        <span
                          className="text-3xl font-bold"
                          style={{ color: "#3D2314" }}
                        >
                          {plan.price}€
                        </span>
                        <span className="text-sm" style={{ color: "#A89880" }}>
                          /mois
                        </span>
                        {plan.yearlyPrice > 0 && (
                          <p
                            className="mt-0.5 text-xs"
                            style={{ color: "#A89880" }}
                          >
                            ou {plan.yearlyPrice}€/an
                          </p>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="mb-5 flex flex-1 flex-col gap-2.5">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm"
                            style={{ color: "#6B4226" }}
                          >
                            <div
                              className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full"
                              style={{
                                backgroundColor: isCurrent
                                  ? "#FEF3EB"
                                  : "#F5F0EB",
                              }}
                            >
                              <Check
                                className="h-2.5 w-2.5"
                                style={{
                                  color: isCurrent ? "#C4621D" : "#A89880",
                                }}
                              />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      {isCurrent ? (
                        <button
                          disabled
                          className="w-full cursor-default rounded-xl py-2.5 text-sm font-semibold"
                          style={{
                            backgroundColor: "#F5F0EB",
                            color: "#A89880",
                          }}
                        >
                          Plan actuel
                        </button>
                      ) : (
                        <button
                          onClick={() => portalMutation.mutate()}
                          disabled={portalMutation.isPending}
                          className="w-full cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                          style={
                            plan.isPopular
                              ? {
                                  backgroundColor: "#C4621D",
                                  color: "#FFFFFF",
                                  boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
                                }
                              : {
                                  backgroundColor: "transparent",
                                  color: "#6B4226",
                                  border: "1px solid #EDE0D0",
                                }
                          }
                        >
                          {plan.price === 0
                            ? "Passer au gratuit"
                            : "Choisir ce plan"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
