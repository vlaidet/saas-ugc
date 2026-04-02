"use client";

import { Logo } from "@/components/nowts/logo";
import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

const ProviderData: Record<
  string,
  { icon: ReactNode; name: string; label: string }
> = {
  github: {
    icon: <Logo name="github" size={16} />,
    name: "Github",
    label: "Continuer avec Github",
  },
  google: {
    icon: <Logo name="google" size={16} />,
    name: "Google",
    label: "Continuer avec Google",
  },
};

type ProviderButtonProps = {
  providerId: "github" | "google";
  callbackUrl?: string;
};

export const ProviderButton = (props: ProviderButtonProps) => {
  const { data: lastUsedProvider } = useQuery({
    queryKey: ["lastUsedLoginMethod"],
    queryFn: () => {
      return authClient.getLastUsedLoginMethod();
    },
    initialData: undefined,
    staleTime: Infinity,
  });

  const signInMutation = useMutation({
    mutationFn: async () => {
      await authClient.signIn.social({
        provider: props.providerId,
        callbackURL: getCallbackUrl(props.callbackUrl ?? "/pipeline"),
      });
    },
  });

  const data = ProviderData[props.providerId];
  const isLastUsed = lastUsedProvider === props.providerId;

  return (
    <div className="relative w-full">
      {isLastUsed && (
        <span
          className="absolute -top-2 -right-2 z-10 rounded-lg px-2 py-0.5 text-[10px] font-semibold"
          style={{
            backgroundColor: "#FEF3EB",
            color: "#C4621D",
            border: "1px solid #C4621D20",
          }}
        >
          Dernière utilisée
        </span>
      )}
      <LoadingButton
        loading={signInMutation.isPending}
        className="w-full cursor-pointer rounded-xl text-sm font-medium transition-all hover:shadow-sm"
        variant="outline"
        size="lg"
        onClick={() => signInMutation.mutate()}
        style={{
          borderColor: "#EDE0D0",
          color: "#3D2314",
          backgroundColor: "white",
        }}
      >
        {data.icon}
        <span className="ml-2">{data.label}</span>
      </LoadingButton>
    </div>
  );
};
