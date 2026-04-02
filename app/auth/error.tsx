"use client";

import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <div
      className="rounded-2xl bg-white p-8 text-center"
      style={{
        border: "1px solid #EDE0D0",
        boxShadow:
          "0 4px 24px rgba(61,35,20,0.08), 0 1px 4px rgba(61,35,20,0.04)",
      }}
    >
      <div className="mb-5 flex justify-center">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: "#FEF2F2" }}
        >
          <AlertTriangle className="h-7 w-7" style={{ color: "#DC2626" }} />
        </div>
      </div>

      <h1 className="text-xl font-bold" style={{ color: "#3D2314" }}>
        Une erreur est survenue
      </h1>
      <p className="mt-1.5 text-sm" style={{ color: "#A89880" }}>
        Veuillez réessayer ultérieurement.
      </p>

      <button
        onClick={reset}
        className="mt-6 cursor-pointer rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
        style={{
          backgroundColor: "#C4621D",
          boxShadow: "0 1px 4px rgba(196,98,29,0.3)",
        }}
      >
        Réessayer
      </button>
    </div>
  );
}
