import { Edit2, Trash2, Clock, TriangleAlert } from "lucide-react";
import { InlineTooltip } from "@/components/ui/tooltip";
import type { Brand, BrandNiche, BrandStatus, ContactChannel } from "../types";
import { BrandAvatar } from "./brand-avatar";
import { StatusBadge } from "./status-badge";
import { ChannelBadge } from "./channel-badge";
import { NICHE_COLORS } from "../constants";

const warmTooltip =
  "rounded-lg bg-[#3D2314] px-2.5 py-1 text-xs text-white shadow-lg [&>svg]:fill-[#3D2314]";

interface BrandCardProps {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
  onHistory: () => void;
  onDragStart: (id: string) => void;
  needsFollowUp: boolean;
  isDragging?: boolean;
}

export function BrandCard({
  brand,
  onEdit,
  onDelete,
  onHistory,
  onDragStart,
  needsFollowUp,
  isDragging = false,
}: BrandCardProps) {
  const nicheColor = NICHE_COLORS[brand.niche as unknown as BrandNiche];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("brandId", brand.id);
        onDragStart(brand.id);
      }}
      onClick={onEdit}
      className="group relative cursor-pointer rounded-2xl bg-white p-3.5 transition-all duration-150 active:scale-[0.97] active:cursor-grabbing active:opacity-70"
      style={{
        boxShadow:
          "0 1px 3px rgba(61,35,20,0.07), 0 1px 2px rgba(61,35,20,0.05)",
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {/* BRAND HEADER */}
      <div className="flex items-start gap-2.5">
        <BrandAvatar
          name={brand.name}
          niche={brand.niche as unknown as BrandNiche}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className="truncate text-sm leading-tight font-bold"
              style={{ color: "#3D2314" }}
            >
              {brand.name}
            </p>
            {needsFollowUp && (
              <span title="Relancer" className="mt-0.5 flex-shrink-0">
                <TriangleAlert
                  className="h-3.5 w-3.5"
                  style={{ color: "#D97706" }}
                />
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: nicheColor }}
            />
            <span className="text-[11px]" style={{ color: "#A89880" }}>
              {brand.niche}
            </span>
          </div>
        </div>
      </div>

      {/* STATUS */}
      <div className="mt-3">
        <StatusBadge status={brand.status as unknown as BrandStatus} />
      </div>

      {/* RELANCER */}
      {needsFollowUp && (
        <div
          className="mt-2 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium"
          style={{ backgroundColor: "#FFFBEB", color: "#B45309" }}
        >
          <TriangleAlert className="h-3 w-3 flex-shrink-0" />
          Relancer — sans réponse depuis +7j
        </div>
      )}

      {/* FOOTER */}
      <div
        className="mt-3 flex items-center justify-between border-t pt-2.5"
        style={{ borderColor: "#F0E8DF" }}
      >
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "#A89880" }}
        >
          <span
            className="inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
            style={{
              backgroundColor:
                brand.contacts.length > 0 ? "#F0E8DF" : "#F5F0EB",
              color: brand.contacts.length > 0 ? "#6B4226" : "#A89880",
              minWidth: "20px",
            }}
          >
            {brand.contacts.length}
          </span>
          <span className="h-2.5 w-px" style={{ backgroundColor: "#EDE0D0" }} />
          <ChannelBadge
            channel={brand.channel as unknown as ContactChannel}
            size="sm"
          />
        </div>

        <div className="flex items-center opacity-40 transition-opacity duration-150 group-hover:opacity-100">
          <InlineTooltip title="Éditer" className={warmTooltip}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-[#FAF6F1]"
              style={{ color: "#6B4226" }}
            >
              <Edit2 className="h-3 w-3" />
            </button>
          </InlineTooltip>
          <InlineTooltip
            title="Historique des contacts"
            className={warmTooltip}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onHistory();
              }}
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-[#FAF6F1]"
              style={{ color: "#6B4226" }}
            >
              <Clock className="h-3 w-3" />
            </button>
          </InlineTooltip>
          <InlineTooltip title="Supprimer" className={warmTooltip}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-red-50"
              style={{ color: "#6B4226" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#DC2626";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#6B4226";
              }}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </InlineTooltip>
        </div>
      </div>
    </div>
  );
}
