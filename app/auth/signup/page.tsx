import { Loader } from "@/components/nowts/loader";
import { getUser } from "@/lib/auth/auth-user";
import { SiteConfig } from "@/site-config";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignUpCredentialsForm } from "./sign-up-credentials-form";

export const metadata: Metadata = {
  title: `Inscription | ${SiteConfig.title}`,
  description: "Créez votre compte pour commencer à gérer votre pipeline.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AuthSignUpPage />
    </Suspense>
  );
}

async function AuthSignUpPage() {
  const user = await getUser();

  if (user) {
    redirect("/pipeline");
  }

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
          Créer un compte
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#A89880" }}>
          Quelques informations pour commencer
        </p>
      </div>

      <Suspense fallback={<Loader />}>
        <SignUpCredentialsForm />
      </Suspense>

      <p className="mt-5 text-center text-xs" style={{ color: "#A89880" }}>
        Déjà un compte ?{" "}
        <Link
          href="/auth/signin"
          className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "#C4621D" }}
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
