"use client";

import {
  Copy,
  Edit2,
  MoreHorizontal,
  Star,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChannelBadge } from "@/features/pipeline/components/channel-badge";
import { NICHE_COLORS } from "@/features/pipeline/constants";
import type { BrandNiche, ContactChannel } from "@/features/pipeline/types";
import type { MessageTemplate } from "../types";
import { getResponseRate, getRateColor, RATE_THRESHOLDS } from "../constants";
import { VariableHighlight } from "./variable-highlight";

type TemplateCardProps = {
  template: MessageTemplate;
  onUse: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkReplied: (id: string) => void;
};

export function TemplateCard({
  template,
  onUse,
  onEdit,
  onDuplicate,
  onDelete,
  onMarkReplied,
}: TemplateCardProps) {
  const rate = getResponseRate(template.timesUsed, template.timesReplied);
  const rateColor = getRateColor(rate);
  const isPerformant = rate >= RATE_THRESHOLDS.high && template.timesUsed >= 5;
  const nicheColor = NICHE_COLORS[template.niche as BrandNiche];

  return (
    <div
      className="group relative flex flex-col rounded-2xl border bg-white/80 transition-all duration-200 hover:bg-white hover:shadow-md"
      style={{
        borderColor: "#EDE0D0",
        boxShadow: "0 1px 3px rgba(61,35,20,0.04)",
      }}
    >
      {/* Header : canal + niche + badge performant */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <ChannelBadge channel={template.channel as ContactChannel} size="sm" />
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
          style={{
            backgroundColor: `${nicheColor}18`,
            color: nicheColor,
          }}
        >
          {template.niche}
        </span>

        {isPerformant && (
          <span
            className="ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: "#ECFDF5", color: "#059669" }}
          >
            <Star className="h-3 w-3" />
            Performant
          </span>
        )}
      </div>

      {/* Titre */}
      <div className="px-4">
        <h3
          className="text-sm leading-snug font-semibold"
          style={{ color: "#3D2314" }}
        >
          {template.title}
        </h3>
      </div>

      {/* Aperçu du contenu avec variables en surbrillance */}
      <div className="mt-2 flex-1 px-4">
        <div
          className="line-clamp-3 text-xs leading-relaxed"
          style={{ color: "#6B4226" }}
        >
          <VariableHighlight content={template.content} />
        </div>
      </div>

      {/* Barre de progression du taux de réponse */}
      <div className="mt-3 px-4">
        <div className="flex items-center justify-between text-[10px]">
          <span style={{ color: "#A89880" }}>Taux de réponse</span>
          <span className="font-bold" style={{ color: rateColor }}>
            {rate}%
          </span>
        </div>
        <div
          className="mt-1 h-1.5 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "#EDE0D0" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(rate, 100)}%`,
              backgroundColor: rateColor,
            }}
          />
        </div>
      </div>

      {/* Compteurs */}
      <div
        className="mt-2 flex items-center gap-3 px-4 text-[11px]"
        style={{ color: "#A89880" }}
      >
        <span>
          <strong style={{ color: "#6B4226" }}>{template.timesUsed}</strong>{" "}
          utilisations
        </span>
        <span
          className="h-0.5 w-0.5 rounded-full"
          style={{ backgroundColor: "#EDE0D0" }}
        />
        <span>
          <strong style={{ color: "#6B4226" }}>{template.timesReplied}</strong>{" "}
          réponses
        </span>
      </div>

      {/* Actions */}
      <div
        className="mt-3 flex items-center gap-2 border-t px-4 py-3"
        style={{ borderColor: "#EDE0D0" }}
      >
        <button
          onClick={() => onUse(template)}
          className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{
            backgroundColor: "#C4621D",
            boxShadow: "0 1px 3px rgba(196,98,29,0.25)",
          }}
        >
          Utiliser
        </button>

        <button
          onClick={() => onMarkReplied(template.id)}
          className="flex cursor-pointer items-center justify-center rounded-xl px-3 py-2 transition-all hover:bg-[#ECFDF5]"
          style={{ color: "#059669" }}
          title="Marquer comme répondu"
        >
          <CheckCircle2 className="h-4 w-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex cursor-pointer items-center justify-center rounded-xl px-2 py-2 transition-all hover:bg-[#F5F0EB]"
              style={{ color: "#A89880" }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-xl border-0 p-1"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow:
                "0 4px 24px rgba(61,35,20,0.12), 0 1px 4px rgba(61,35,20,0.08)",
            }}
          >
            <DropdownMenuItem
              onClick={() => onEdit(template)}
              className="cursor-pointer rounded-lg px-3 py-2 text-xs focus:bg-[#F5F0EB]"
              style={{ color: "#6B4226" }}
            >
              <Edit2
                className="mr-2 h-3.5 w-3.5"
                style={{ color: "#A89880" }}
              />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDuplicate(template.id)}
              className="cursor-pointer rounded-lg px-3 py-2 text-xs focus:bg-[#F5F0EB]"
              style={{ color: "#6B4226" }}
            >
              <Copy className="mr-2 h-3.5 w-3.5" style={{ color: "#A89880" }} />
              Dupliquer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(template.id)}
              className="cursor-pointer rounded-lg px-3 py-2 text-xs focus:bg-[#FEF2F2]"
              style={{ color: "#DC2626" }}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
