"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProviderButton } from "./provider-button";
import { SignInCredentialsAndEmailOTP } from "./sign-in-credentials-and-email-otp";

export const SignInProviders = ({
  providers,
  callbackUrl,
}: {
  providers: string[];
  callbackUrl?: string;
}) => {
  const searchParams = useSearchParams();
  const callbackUrlParams = searchParams.get("callbackUrl");

  callbackUrl ??= callbackUrlParams as string;

  return (
    <div className="flex flex-col gap-5">
      <SignInCredentialsAndEmailOTP callbackUrl={callbackUrl} />

      {providers.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-px flex-1" style={{ backgroundColor: "#EDE0D0" }} />
          <span className="text-xs font-medium" style={{ color: "#A89880" }}>
            ou continuer avec
          </span>
          <div className="h-px flex-1" style={{ backgroundColor: "#EDE0D0" }} />
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        {providers.includes("google") && (
          <ProviderButton providerId="google" callbackUrl={callbackUrl} />
        )}
        {providers.includes("github") && (
          <ProviderButton providerId="github" callbackUrl={callbackUrl} />
        )}
      </div>

      <p className="text-center text-xs" style={{ color: "#A89880" }}>
        Pas encore de compte ?{" "}
        <Link
          href={`/auth/signup?callbackUrl=${callbackUrl}`}
          className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "#C4621D" }}
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
};
