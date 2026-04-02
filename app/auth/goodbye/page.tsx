import { SiteConfig } from "@/site-config";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Compte supprimé | ${SiteConfig.title}`,
  description:
    "Votre compte a été supprimé avec succès. Merci d'avoir utilisé notre service.",
};

export default function GoodbyePage() {
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
        <div className="mb-4 flex justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#ECFDF5" }}
          >
            <CheckCircle className="h-7 w-7" style={{ color: "#059669" }} />
          </div>
        </div>
        <h1 className="text-xl font-bold" style={{ color: "#3D2314" }}>
          Compte supprimé
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#A89880" }}>
          Votre compte a été supprimé avec succès. Nous sommes désolés de vous
          voir partir.
        </p>
      </div>

      <div className="border-t pt-6" style={{ borderColor: "#EDE0D0" }}>
        <div className="flex flex-col gap-3 text-center">
          <p className="text-sm" style={{ color: "#6B4226" }}>
            Votre compte et toutes les données associées ont été définitivement
            supprimés.
          </p>
          <p className="text-sm" style={{ color: "#6B4226" }}>
            Si vous changez d&apos;avis, vous pouvez créer un nouveau compte à
            tout moment.
          </p>
          <Link
            href="/auth/signup"
            className="mt-2 inline-block cursor-pointer rounded-xl px-6 py-2.5 text-center text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
            style={{
              backgroundColor: "#C4621D",
              boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
            }}
          >
            Créer un nouveau compte
          </Link>
        </div>
      </div>
    </div>
  );
}
