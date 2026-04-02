import { SocialProviders } from "@/lib/auth";
import { getUser } from "@/lib/auth/auth-user";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignInProviders } from "./sign-in-providers";

export const metadata: Metadata = {
  title: `Connexion | ${SiteConfig.title}`,
  description: "Connectez-vous à votre compte pour accéder à votre pipeline.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthSignInPage />
    </Suspense>
  );
}

async function AuthSignInPage() {
  const user = await getUser();

  if (user) {
    redirect("/pipeline");
  }

  const providers = Object.keys(SocialProviders ?? {});

  return (
    <div
      className="rounded-2xl bg-white p-8"
      style={{
        border: "1px solid #EDE0D0",
        boxShadow:
          "0 4px 24px rgba(61,35,20,0.08), 0 1px 4px rgba(61,35,20,0.04)",
      }}
    >
      <div className="mb-6 text-center">
        <h1 className="text-xl font-bold" style={{ color: "#3D2314" }}>
          Bon retour parmi nous
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#A89880" }}>
          Connectez-vous pour accéder à votre pipeline
        </p>
      </div>

      <SignInProviders providers={providers} />
    </div>
  );
}
