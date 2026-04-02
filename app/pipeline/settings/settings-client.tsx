"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Settings,
  User,
  Mail,
  Lock,
  AlertTriangle,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AvatarUpload from "@/features/images/avatar-upload";
import { uploadUserImageAction } from "@/features/images/upload-image.action";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";

type SettingsClientProps = {
  defaultValues: {
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
  };
};

export function SettingsClient({ defaultValues }: SettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(defaultValues.name);
  const [image, setImage] = useState(defaultValues.image);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.updateUser({
          name,
          image,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Profil mis à jour");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.set("files", file);
      return resolveActionResult(uploadUserImageAction({ formData }));
    },
    onSuccess: (data) => {
      setImage(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.sendVerificationEmail({
          email: defaultValues.email,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Email de vérification envoyé");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
            <Settings className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1
              className="text-base leading-none font-bold"
              style={{ color: "#3D2314" }}
            >
              Paramètres
            </h1>
            <p
              className="mt-0.5 text-xs leading-none"
              style={{ color: "#A89880" }}
            >
              Gérez votre profil et votre compte
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-auto">
        <div className="mx-auto w-full max-w-2xl px-6 py-8">
          <div className="flex flex-col gap-6">
            {/* Section Profil */}
            <section
              className="rounded-2xl bg-white p-6"
              style={{
                border: "1px solid #EDE0D0",
                boxShadow: "0 1px 3px rgba(61,35,20,0.04)",
              }}
            >
              <div className="mb-5 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#FEF3EB" }}
                >
                  <User className="h-4 w-4" style={{ color: "#C4621D" }} />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "#3D2314" }}
                >
                  Profil
                </h2>
              </div>

              <div className="flex flex-col gap-5">
                {/* Avatar */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <AvatarUpload
                      onChange={(file) => uploadImageMutation.mutate(file)}
                      onRemove={() => setImage(null)}
                      initialFile={image ?? undefined}
                      isPending={uploadImageMutation.isPending}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#3D2314" }}
                    >
                      Photo de profil
                    </p>
                    <p className="text-xs" style={{ color: "#A89880" }}>
                      JPG, PNG ou GIF. 2 Mo max.
                    </p>
                  </div>
                </div>

                {/* Name field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium"
                    style={{ color: "#3D2314" }}
                  >
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 rounded-xl border bg-white px-4 text-sm transition-all outline-none focus:ring-2"
                    style={{
                      borderColor: "#EDE0D0",
                      color: "#3D2314",
                      boxShadow: "0 1px 2px rgba(61,35,20,0.04)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#C4621D";
                      e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(196,98,29,0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#EDE0D0";
                      e.currentTarget.style.boxShadow =
                        "0 1px 2px rgba(61,35,20,0.04)";
                    }}
                    placeholder="Votre nom"
                  />
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => updateProfileMutation.mutate()}
                    disabled={updateProfileMutation.isPending}
                    className="flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: "#C4621D",
                      boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
                    }}
                  >
                    {updateProfileMutation.isPending
                      ? "Enregistrement..."
                      : "Enregistrer"}
                  </button>
                </div>
              </div>
            </section>

            {/* Section Email */}
            <section
              className="rounded-2xl bg-white p-6"
              style={{
                border: "1px solid #EDE0D0",
                boxShadow: "0 1px 3px rgba(61,35,20,0.04)",
              }}
            >
              <div className="mb-5 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#EFF6FF" }}
                >
                  <Mail className="h-4 w-4" style={{ color: "#2563EB" }} />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "#3D2314" }}
                >
                  Email
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-sm" style={{ color: "#3D2314" }}>
                    {defaultValues.email}
                  </p>
                  {defaultValues.emailVerified ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: "#ECFDF5",
                        color: "#059669",
                      }}
                    >
                      <BadgeCheck className="h-3 w-3" />
                      Vérifié
                    </span>
                  ) : (
                    <button
                      onClick={() => verifyEmailMutation.mutate()}
                      disabled={verifyEmailMutation.isPending}
                      className="cursor-pointer text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ color: "#C4621D" }}
                    >
                      {verifyEmailMutation.isPending ? "Envoi..." : "Vérifier"}
                    </button>
                  )}
                </div>
                <Link
                  href="/account/change-email"
                  className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "#6B4226" }}
                >
                  Modifier
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </section>

            {/* Section Sécurité */}
            <section
              className="rounded-2xl bg-white p-6"
              style={{
                border: "1px solid #EDE0D0",
                boxShadow: "0 1px 3px rgba(61,35,20,0.04)",
              }}
            >
              <div className="mb-5 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#F5F3FF" }}
                >
                  <Lock className="h-4 w-4" style={{ color: "#7C3AED" }} />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "#3D2314" }}
                >
                  Sécurité
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#3D2314" }}>
                    Mot de passe
                  </p>
                  <p className="text-xs" style={{ color: "#A89880" }}>
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </p>
                </div>
                <Link
                  href="/account/change-password"
                  className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: "#6B4226" }}
                >
                  Modifier
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </section>

            {/* Section Danger */}
            <section
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
              }}
            >
              <div className="mb-5 flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#FEE2E2" }}
                >
                  <AlertTriangle
                    className="h-4 w-4"
                    style={{ color: "#DC2626" }}
                  />
                </div>
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "#991B1B" }}
                >
                  Zone de danger
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "#991B1B" }}>
                    Supprimer le compte
                  </p>
                  <p className="text-xs" style={{ color: "#B91C1C" }}>
                    Cette action est irréversible. Toutes vos données seront
                    supprimées.
                  </p>
                </div>
                <Link
                  href="/account/danger"
                  className="rounded-xl border px-4 py-2 text-xs font-semibold transition-all hover:bg-red-50"
                  style={{
                    borderColor: "#FECACA",
                    color: "#DC2626",
                  }}
                >
                  Supprimer
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
