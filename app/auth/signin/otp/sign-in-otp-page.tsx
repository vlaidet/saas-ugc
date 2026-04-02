"use client";

import { authClient } from "@/lib/auth-client";
import { getCallbackUrl } from "@/lib/auth/auth-utils";
import { Loader } from "@/components/nowts/loader";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SignInOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    const verifyOtp = async () => {
      if (!email || !otp) {
        toast.error("Paramètres manquants");
        window.location.href = "/auth/signin?error=missing-params";
        return;
      }

      try {
        await authClient.signIn.emailOtp({
          email,
          otp,
        });

        toast.success("Connexion réussie");
        const redirectUrl = getCallbackUrl(callbackUrl ?? "/pipeline");
        window.location.href = redirectUrl;
      } catch {
        toast.error("Code invalide ou expiré");
        window.location.href = "/auth/signin?error=invalid-otp";
      }
    };

    void verifyOtp();
  }, [email, otp, callbackUrl]);

  return (
    <div
      className="rounded-2xl bg-white p-8 text-center"
      style={{
        border: "1px solid #EDE0D0",
        boxShadow:
          "0 4px 24px rgba(61,35,20,0.08), 0 1px 4px rgba(61,35,20,0.04)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader className="size-8" style={{ color: "#C4621D" }} />
        <p className="text-sm" style={{ color: "#6B4226" }}>
          Vérification en cours...
        </p>
      </div>
    </div>
  );
}
