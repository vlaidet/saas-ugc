"use client";

import { LoadingButton } from "@/features/form/submit-button";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function ConfirmDeletePage({
  token,
  callbackUrl = "/auth/goodbye",
}: {
  token?: string;
  callbackUrl?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDeleteMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Token invalide");
      }
      return unwrapSafePromise(
        authClient.deleteUser({
          token,
        }),
      );
    },
    onError: (err) => {
      setError(err.message);
      toast.error(err.message);
    },
    onSuccess: () => {
      router.push(callbackUrl);
    },
  });

  const handleConfirmDelete = () => {
    setIsLoading(true);
    confirmDeleteMutation.mutate();
  };

  const handleCancel = () => {
    router.push("/pipeline/settings");
  };

  if (!token) {
    router.push("/pipeline/settings");
    return null;
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
        <div className="mb-4 flex justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <Trash2 className="h-7 w-7" style={{ color: "#DC2626" }} />
          </div>
        </div>
        <h1 className="text-xl font-bold" style={{ color: "#3D2314" }}>
          Supprimer votre compte
        </h1>
        <p className="mt-1.5 text-sm" style={{ color: "#A89880" }}>
          Cette action est définitive et irréversible. Toutes vos données seront
          supprimées.
        </p>
      </div>

      <div className="border-t pt-6" style={{ borderColor: "#EDE0D0" }}>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <LoadingButton
            loading={isLoading || confirmDeleteMutation.isPending}
            onClick={handleConfirmDelete}
            className="flex-1 cursor-pointer rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#DC2626" }}
          >
            Oui, supprimer mon compte
          </LoadingButton>
          <button
            onClick={handleCancel}
            className="flex-1 cursor-pointer rounded-xl py-2.5 text-sm font-semibold transition-all hover:opacity-70"
            style={{
              border: "1px solid #EDE0D0",
              color: "#6B4226",
            }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
