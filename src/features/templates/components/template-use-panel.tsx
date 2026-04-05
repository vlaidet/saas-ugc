"use client";

import { useState, useMemo } from "react";
import { ClipboardCopy, X, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ChannelBadge } from "@/features/pipeline/components/channel-badge";
import type { ContactChannel } from "@/features/pipeline/types";
import type { CustomVariable, MessageTemplate } from "../types";
import {
  extractVariables,
  getVariableConfig,
  renderTemplate,
} from "../constants";
import { VariableHighlight } from "./variable-highlight";

type TemplateUsePanelProps = {
  template: MessageTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsed: (id: string) => void;
  customVariables: CustomVariable[];
};

export function TemplateUsePanel({
  template,
  open,
  onOpenChange,
  onUsed,
  customVariables,
}: TemplateUsePanelProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(true);

  const [prevTemplateId, setPrevTemplateId] = useState<string | null>(null);
  const currentTemplateId = template?.id ?? null;
  if (currentTemplateId !== prevTemplateId) {
    setPrevTemplateId(currentTemplateId);
    setValues({});
    setShowPreview(true);
  }

  const variables = useMemo(
    () => (template ? extractVariables(template.content) : []),
    [template],
  );

  const renderedContent = useMemo(() => {
    if (!template) return "";

    const mergedValues: Record<string, string> = {};
    for (const v of variables) {
      mergedValues[v] = values[v] ?? "";
    }
    return renderTemplate(template.content, mergedValues);
  }, [template, values, variables]);

  const allFilled = variables.every((v) => (values[v] ?? "").trim() !== "");

  const handleCopy = async () => {
    if (!template) return;

    try {
      await navigator.clipboard.writeText(renderedContent);
      onUsed(template.id);
      toast.success("Message copié et compteur incrémenté");
    } catch {
      toast.error("Impossible de copier le message");
    }
  };

  if (!template) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col border-0 p-0 sm:max-w-md"
        style={{
          backgroundColor: "#FAF6F1",
          boxShadow: "-4px 0 24px rgba(61,35,20,0.1)",
        }}
      >
        <SheetHeader
          className="flex-shrink-0 px-5 pt-5 pb-4"
          style={{ borderBottom: "1px solid #EDE0D0" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChannelBadge
                channel={template.channel as ContactChannel}
                size="sm"
              />
              <SheetTitle
                className="text-sm font-bold"
                style={{ color: "#3D2314" }}
              >
                {template.title}
              </SheetTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-[#EDE0D0]"
              style={{ color: "#A89880" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <SheetDescription className="sr-only">
            Remplir les variables du template pour générer le message
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5">
          {/* Champs de variables */}
          {variables.length > 0 && (
            <section>
              <h4
                className="mb-3 text-xs font-bold tracking-wider uppercase"
                style={{ color: "#A89880" }}
              >
                Variables
              </h4>
              <div className="flex flex-col gap-2.5">
                {variables.map((variable) => {
                  const config = getVariableConfig(variable, customVariables);
                  return (
                    <div key={variable}>
                      <label
                        className="mb-1 block text-xs font-semibold"
                        style={{ color: "#6B4226" }}
                      >
                        {config.label}
                      </label>
                      <input
                        type="text"
                        value={values[variable] ?? ""}
                        onChange={(e) =>
                          setValues((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                        placeholder={config.placeholder}
                        className="h-9 w-full rounded-xl border px-3 text-sm transition-all outline-none focus:shadow-sm"
                        style={{
                          borderColor: "#EDE0D0",
                          color: "#3D2314",
                          backgroundColor: "white",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Aperçu / Message final */}
          <section className="flex-1">
            <div className="mb-2 flex items-center justify-between">
              <h4
                className="text-xs font-bold tracking-wider uppercase"
                style={{ color: "#A89880" }}
              >
                {allFilled ? "Message final" : "Aperçu"}
              </h4>
              <button
                onClick={() => setShowPreview((p) => !p)}
                className="flex cursor-pointer items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: "#C4621D" }}
              >
                <Eye className="h-3 w-3" />
                {showPreview ? "Masquer" : "Afficher"}
              </button>
            </div>

            {showPreview && (
              <div
                className="rounded-xl border p-4 text-sm leading-relaxed"
                style={{
                  backgroundColor: "white",
                  borderColor: allFilled ? "#C4621D" : "#EDE0D0",
                  color: "#3D2314",
                  boxShadow: allFilled
                    ? "0 0 0 1px rgba(196,98,29,0.1)"
                    : "none",
                }}
              >
                {allFilled ? (
                  <span className="whitespace-pre-wrap">{renderedContent}</span>
                ) : (
                  <VariableHighlight content={template.content} />
                )}
              </div>
            )}
          </section>
        </div>

        {/* Footer : bouton copier */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{ borderTop: "1px solid #EDE0D0" }}
        >
          <button
            onClick={handleCopy}
            disabled={!allFilled}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: "#C4621D",
              boxShadow: allFilled ? "0 2px 8px rgba(196,98,29,0.3)" : "none",
            }}
          >
            <ClipboardCopy className="h-4 w-4" />
            Copier le message
          </button>
          {!allFilled && (
            <p
              className="mt-2 text-center text-xs"
              style={{ color: "#A89880" }}
            >
              Remplissez toutes les variables pour copier
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
