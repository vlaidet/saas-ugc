import { Edit2, Trash2, Clock, Bell } from "lucide-react";
import type { Brand } from "../types";
import { BrandAvatar } from "./brand-avatar";
import { StatusBadge } from "./status-badge";
import { NICHE_COLORS } from "../constants";

interface BrandCardProps {
  brand: Brand;
  onEdit: () => void;
  onDelete: () => void;
  onHistory: () => void;
  onDragStart: (id: string) => void;
  needsFollowUp: boolean;
}

export function BrandCard({
  brand,
  onEdit,
  onDelete,
  onHistory,
  onDragStart,
  needsFollowUp,
}: BrandCardProps) {
  const nicheColor = NICHE_COLORS[brand.niche];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("brandId", brand.id);
        onDragStart(brand.id);
      }}
      className="cursor-grab rounded-2xl bg-white p-4 transition-all duration-200 active:scale-[0.98] active:cursor-grabbing active:opacity-80"
      style={{
        boxShadow: "0 2px 8px rgba(61,35,20,0.08)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 6px 20px rgba(61,35,20,0.14)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 2px 8px rgba(61,35,20,0.08)";
      }}
    >
      {/* Header: avatar + name + niche */}
      <div className="flex items-start gap-3">
        <BrandAvatar name={brand.name} niche={brand.niche} size="md" />
        <div className="min-w-0 flex-1">
          <p
            className="truncate text-sm leading-tight font-bold"
            style={{ color: "#3D2314" }}
          >
            {brand.name}
          </p>
          <span
            className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ backgroundColor: `${nicheColor}18`, color: nicheColor }}
          >
            {brand.niche}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3">
        <StatusBadge status={brand.status} />
      </div>

      {/* Follow-up alert */}
      {needsFollowUp && (
        <div
          className="mt-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5"
          style={{ backgroundColor: "#FEF3C7" }}
        >
          <Bell
            className="h-3 w-3 flex-shrink-0"
            style={{ color: "#D97706" }}
          />
          <span className="text-xs font-semibold" style={{ color: "#D97706" }}>
            Relancer
          </span>
        </div>
      )}

      {/* Meta info row */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs" style={{ color: "#A89880" }}>
          {brand.contacts.length} contact
          {brand.contacts.length !== 1 ? "s" : ""}
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: "#FAF6F1", color: "#6B4226" }}
        >
          {brand.channel}
        </span>
      </div>

      {/* Actions divider + buttons */}
      <div
        className="mt-3 flex items-center justify-end gap-0.5 border-t pt-2"
        style={{ borderColor: "#EDE0D0" }}
      >
        <button
          onClick={onEdit}
          className="rounded-lg p-1.5 transition-colors hover:bg-[#FAF6F1]"
          title="Éditer"
          style={{ color: "#A89880" }}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onHistory}
          className="rounded-lg p-1.5 transition-colors hover:bg-[#FAF6F1]"
          title="Historique"
          style={{ color: "#A89880" }}
        >
          <Clock className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
          title="Supprimer"
          style={{ color: "#A89880" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#A89880";
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
