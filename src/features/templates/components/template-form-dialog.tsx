"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHANNELS, NICHES } from "@/features/pipeline/constants";
import type { BrandNiche, ContactChannel } from "@/features/pipeline/types";
import type { MessageTemplate } from "../types";
import { VARIABLE_CONFIG } from "../constants";
import { VariableHighlight } from "./variable-highlight";

type TemplateFormData = {
  title: string;
  channel: ContactChannel;
  niche: BrandNiche;
  content: string;
};

type TemplateFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TemplateFormData) => void;
  defaultValues: MessageTemplate | null;
};

const VARIABLE_CHIPS = Object.entries(VARIABLE_CONFIG).map(([key, cfg]) => ({
  key,
  label: cfg.label,
  tag: `{{${key}}}`,
}));

export function TemplateFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: TemplateFormDialogProps) {
  const isEditing = defaultValues !== null;

  // Derive form state from props (React recommended pattern)
  // On détecte quand le dialog s'ouvre et on reset le formulaire
  const [formKey, setFormKey] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState<ContactChannel>("Instagram");
  const [niche, setNiche] = useState<BrandNiche>("Skincare");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const currentKey = open ? (defaultValues?.id ?? "new") : null;
  if (currentKey !== formKey) {
    setFormKey(currentKey);
    if (open) {
      setTitle(defaultValues?.title ?? "");
      setChannel(defaultValues?.channel ?? "Instagram");
      setNiche(defaultValues?.niche ?? "Skincare");
      setContent(defaultValues?.content ?? "");
      setShowPreview(false);
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title: title.trim(), channel, niche, content: content.trim() });
  };

  /** Insère une variable à la position du curseur dans le textarea */
  const insertVariable = (tag: string) => {
    const textarea = document.getElementById(
      "template-content",
    ) as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent((prev) => prev + tag);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent =
      content.substring(0, start) + tag + content.substring(end);
    setContent(newContent);

    // Repositionner le curseur après la variable
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    });
  };

  const isValid = title.trim() !== "" && content.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl gap-0 overflow-hidden rounded-2xl border-0 p-0"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 8px 40px rgba(61,35,20,0.15), 0 2px 8px rgba(61,35,20,0.08)",
        }}
      >
        <DialogHeader
          className="px-6 py-4"
          style={{ borderBottom: "1px solid #EDE0D0" }}
        >
          <DialogTitle
            className="text-base font-bold"
            style={{ color: "#3D2314" }}
          >
            {isEditing ? "Modifier le template" : "Nouveau template"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            {/* Titre */}
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold"
                style={{ color: "#6B4226" }}
              >
                Titre interne
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: DM Instagram — Skincare"
                className="h-9 w-full rounded-xl border px-3 text-sm transition-all outline-none focus:shadow-sm"
                style={{
                  borderColor: "#EDE0D0",
                  color: "#3D2314",
                  backgroundColor: "#FAF6F1",
                }}
              />
            </div>

            {/* Canal + Niche */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold"
                  style={{ color: "#6B4226" }}
                >
                  Canal
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as ContactChannel)}
                  className="h-9 w-full cursor-pointer appearance-none rounded-xl border px-3 text-sm transition-all outline-none"
                  style={{
                    borderColor: "#EDE0D0",
                    color: "#3D2314",
                    backgroundColor: "#FAF6F1",
                  }}
                >
                  {CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  className="mb-1.5 block text-xs font-semibold"
                  style={{ color: "#6B4226" }}
                >
                  Niche cible
                </label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value as BrandNiche)}
                  className="h-9 w-full cursor-pointer appearance-none rounded-xl border px-3 text-sm transition-all outline-none"
                  style={{
                    borderColor: "#EDE0D0",
                    color: "#3D2314",
                    backgroundColor: "#FAF6F1",
                  }}
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Variables cliquables */}
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold"
                style={{ color: "#6B4226" }}
              >
                Insérer une variable
              </label>
              <div className="flex flex-wrap gap-1.5">
                {VARIABLE_CHIPS.map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.tag)}
                    className="cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-all hover:shadow-sm active:scale-95"
                    style={{
                      backgroundColor: "#FEF3ED",
                      color: "#C4621D",
                      borderColor: "#F5D5B8",
                    }}
                  >
                    {v.tag}
                    <span className="ml-1 opacity-60">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  className="text-xs font-semibold"
                  style={{ color: "#6B4226" }}
                >
                  Contenu du message
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview((p) => !p)}
                  className="cursor-pointer text-xs font-medium transition-colors"
                  style={{ color: "#C4621D" }}
                >
                  {showPreview ? "Masquer l'aperçu" : "Aperçu"}
                </button>
              </div>

              <textarea
                id="template-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bonjour 👋 J'ai découvert {{nom_marque}} sur Instagram..."
                rows={6}
                className="w-full resize-y rounded-xl border px-3 py-2.5 text-sm leading-relaxed transition-all outline-none focus:shadow-sm"
                style={{
                  borderColor: "#EDE0D0",
                  color: "#3D2314",
                  backgroundColor: "#FAF6F1",
                }}
              />

              {/* Aperçu avec highlight */}
              {showPreview && content && (
                <div
                  className="mt-2 rounded-xl border px-4 py-3 text-sm leading-relaxed"
                  style={{
                    borderColor: "#EDE0D0",
                    backgroundColor: "#FAF6F1",
                    color: "#3D2314",
                  }}
                >
                  <VariableHighlight content={content} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-6 py-4"
          style={{ borderTop: "1px solid #EDE0D0" }}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-[#F5F0EB]"
            style={{ color: "#6B4226" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: "#C4621D",
              boxShadow: "0 1px 3px rgba(196,98,29,0.25)",
            }}
          >
            {isEditing ? "Enregistrer" : "Créer le template"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
