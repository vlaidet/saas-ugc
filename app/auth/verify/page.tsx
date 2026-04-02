import { SiteConfig } from "@/site-config";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Vérification | ${SiteConfig.title}`,
  description: "Vérifiez votre adresse email pour finaliser votre inscription.",
};

export default function VerificationCard() {
  return (
    <div
      className="rounded-2xl bg-white p-8"
      style={{
        border: "1px solid #EDE0D0",
        boxShadow:
          "0 4px 24px rgba(61,35,20,0.08), 0 1px 4px rgba(61,35,20,0.04)",
      }}
    >
      <div className="mb-5 flex justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#FEF3EB" }}
        >
          <Mail className="h-7 w-7" style={{ color: "#C4621D" }} />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-xl font-bold" style={{ color: "#3D2314" }}>
          Vérifiez votre email
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#A89880" }}>
          Un lien de vérification a été envoyé à votre adresse email
        </p>
      </div>

      <div
        className="mt-6 rounded-xl p-4"
        style={{
          backgroundColor: "#FAF6F1",
          border: "1px solid #EDE0D0",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "#3D2314" }}>
          Consultez votre boîte de réception
        </p>
        <p className="mt-1 text-xs" style={{ color: "#6B4226" }}>
          Pour finaliser la création de votre compte, ouvrez l&apos;email de
          vérification et cliquez sur le lien.
        </p>
      </div>

      <p className="mt-4 text-xs" style={{ color: "#A89880" }}>
        Si vous ne trouvez pas l&apos;email, vérifiez votre dossier spam ou
        demandez un nouveau lien.
      </p>

      <div
        className="mt-6 border-t pt-4 text-center"
        style={{ borderColor: "#EDE0D0" }}
      >
        <p className="text-xs" style={{ color: "#A89880" }}>
          Un problème ? Contactez notre équipe support.
        </p>
      </div>
    </div>
  );
}
