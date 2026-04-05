"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CHANNELS, NICHES } from "@/features/pipeline/constants";
import type { BrandNiche, ContactChannel } from "@/features/pipeline/types";
import type { CustomVariable, MessageTemplate } from "../types";
import { VARIABLE_CONFIG, formatVariableKey } from "../constants";
import { VariableHighlight } from "./variable-highlight";

type TemplateFormData = {
  title: string;
  channel: string;
  niche: string;
  content: string;
};

type TemplateFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TemplateFormData) => void;
  defaultValues: MessageTemplate | null;
  customVariables: CustomVariable[];
  onAddCustomVariable: (variable: CustomVariable) => void;
  onDeleteCustomVariable: (key: string) => void;
};

const DEFAULT_CHIPS = Object.entries(VARIABLE_CONFIG).map(([key, cfg]) => ({
  key,
  label: cfg.label,
  tag: `{{${key}}}`,
}));

export function TemplateFormDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  customVariables,
  onAddCustomVariable,
  onDeleteCustomVariable,
}: TemplateFormDialogProps) {
  const isEditing = defaultValues !== null;

  const [formKey, setFormKey] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState<string>("Instagram");
  const [niche, setNiche] = useState<string>("Skincare");
  const [content, setContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Formulaire inline pour ajouter une variable
  const [showAddVariable, setShowAddVariable] = useState(false);
  const [newVarLabel, setNewVarLabel] = useState("");

  const currentKey = open ? (defaultValues?.id ?? "new") : null;
  if (currentKey !== formKey) {
    setFormKey(currentKey);
    if (open) {
      setTitle(defaultValues?.title ?? "");
      setChannel(defaultValues?.channel ?? "Instagram");
      setNiche(defaultValues?.niche ?? "Skincare");
      setContent(defaultValues?.content ?? "");
      setShowPreview(false);
      setShowAddVariable(false);
      setNewVarLabel("");
    }
  }

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title: title.trim(), channel, niche, content: content.trim() });
  };

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

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    });
  };

  const handleAddCustomVariable = () => {
    const label = newVarLabel.trim();
    if (!label) return;

    const key = formatVariableKey(label);
    if (!key) return;

    // Vérifier les doublons avec les variables par défaut
    if (key in VARIABLE_CONFIG) {
      toast.error("Cette variable existe déjà par défaut");
      return;
    }

    // Vérifier les doublons avec les variables custom existantes
    if (customVariables.some((v) => v.key === key)) {
      toast.error("Cette variable existe déjà");
      return;
    }

    const variable: CustomVariable = {
      key,
      label,
      placeholder: `Ex: ${label}`,
    };

    onAddCustomVariable(variable);
    insertVariable(`{{${key}}}`);
    setNewVarLabel("");
    setShowAddVariable(false);
    toast.success("Variable ajoutée");
  };

  const customChips = customVariables.map((v) => ({
    key: v.key,
    label: v.label,
    tag: `{{${v.key}}}`,
  }));

  const isValid = title.trim() !== "" && content.trim() !== "";
  const generatedKey = formatVariableKey(newVarLabel);

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
                {/* Variables par défaut */}
                {DEFAULT_CHIPS.map((v) => (
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

                {/* Variables personnalisées */}
                {customChips.map((v) => (
                  <span key={v.key} className="group relative inline-flex">
                    <button
                      type="button"
                      onClick={() => insertVariable(v.tag)}
                      className="cursor-pointer rounded-lg border border-dashed px-2.5 py-1 text-xs font-medium transition-all hover:shadow-sm active:scale-95"
                      style={{
                        backgroundColor: "#FEF3ED",
                        color: "#C4621D",
                        borderColor: "#F5D5B8",
                      }}
                    >
                      {v.tag}
                      <span className="ml-1 opacity-60">{v.label}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContent((prev) =>
                          prev.replace(
                            new RegExp(`\\{\\{${v.key}\\}\\}`, "g"),
                            "",
                          ),
                        );
                        onDeleteCustomVariable(v.key);
                      }}
                      className="absolute -top-1.5 -right-1.5 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full transition-colors group-hover:flex"
                      style={{
                        backgroundColor: "#FEE2E2",
                        color: "#DC2626",
                      }}
                      aria-label={`Supprimer la variable ${v.label}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}

                {/* Bouton ajouter */}
                {!showAddVariable && (
                  <button
                    type="button"
                    onClick={() => setShowAddVariable(true)}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-dashed px-2.5 py-1 text-xs font-medium transition-all hover:shadow-sm"
                    style={{
                      borderColor: "#D4C4B0",
                      color: "#A89880",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Nouvelle variable
                  </button>
                )}
              </div>

              {/* Formulaire inline d'ajout de variable */}
              {showAddVariable && (
                <div
                  className="mt-2.5 flex flex-col gap-2 rounded-xl border p-3"
                  style={{
                    borderColor: "#EDE0D0",
                    backgroundColor: "#FAF6F1",
                  }}
                >
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label
                        className="mb-1 block text-[11px] font-semibold"
                        style={{ color: "#6B4226" }}
                      >
                        Nom de la variable
                      </label>
                      <input
                        type="text"
                        value={newVarLabel}
                        onChange={(e) => setNewVarLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomVariable();
                          }
                          if (e.key === "Escape") {
                            setShowAddVariable(false);
                            setNewVarLabel("");
                          }
                        }}
                        placeholder="Ex: Budget maximum"
                        autoFocus
                        className="h-8 w-full rounded-lg border px-2.5 text-xs transition-all outline-none focus:shadow-sm"
                        style={{
                          borderColor: "#EDE0D0",
                          color: "#3D2314",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomVariable}
                      disabled={!newVarLabel.trim() || !generatedKey}
                      className="h-8 cursor-pointer rounded-lg px-3 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ backgroundColor: "#C4621D" }}
                    >
                      Ajouter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddVariable(false);
                        setNewVarLabel("");
                      }}
                      className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[#EDE0D0]"
                      style={{ color: "#A89880" }}
                      aria-label="Annuler"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {newVarLabel.trim() && generatedKey && (
                    <p className="text-[11px]" style={{ color: "#A89880" }}>
                      Sera inséré comme{" "}
                      <code
                        className="rounded px-1 py-0.5 text-[10px] font-semibold"
                        style={{
                          backgroundColor: "#FEF3ED",
                          color: "#C4621D",
                        }}
                      >
                        {`{{${generatedKey}}}`}
                      </code>
                    </p>
                  )}
                </div>
              )}
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
