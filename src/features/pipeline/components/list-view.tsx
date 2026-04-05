import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineTooltip } from "@/components/ui/tooltip";
import { Edit2, Trash2, Clock, TriangleAlert } from "lucide-react";
import type { Brand, BrandStatus, BrandNiche, ContactChannel } from "../types";
import { STATUSES, NICHE_COLORS, STATUS_CONFIG } from "../constants";
import { BrandAvatar } from "./brand-avatar";
import { ChannelBadge } from "./channel-badge";

const warmTooltip =
  "rounded-lg bg-[#3D2314] px-2.5 py-1 text-xs text-white shadow-lg [&>svg]:fill-[#3D2314]";

interface ListViewProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onHistory: (brand: Brand) => void;
  onStatusChange: (brandId: string, status: BrandStatus) => void;
  onDragStart: (id: string) => void;
  needsFollowUp: (brand: Brand) => boolean;
}

export function ListView({
  brands,
  onEdit,
  onDelete,
  onHistory,
  onStatusChange,
  needsFollowUp,
}: ListViewProps) {
  if (brands.length === 0) {
    return (
      <div
        className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center"
        style={{ borderColor: "#EDE0D0" }}
      >
        <p className="text-sm font-medium" style={{ color: "#6B4226" }}>
          Aucune marque trouvée
        </p>
        <p className="mt-1 text-xs" style={{ color: "#A89880" }}>
          Ajustez vos filtres ou ajoutez une marque
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: "1px solid #EDE0D0" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              backgroundColor: "#FAF6F1",
              borderBottom: "1px solid #EDE0D0",
            }}
          >
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#A89880" }}
            >
              Marque
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#A89880" }}
            >
              Niche
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#A89880" }}
            >
              Statut
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#A89880" }}
            >
              Canal
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#A89880" }}
            >
              Contacts
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#A89880" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {brands.map((brand, idx) => {
            const nicheColor =
              NICHE_COLORS[brand.niche as unknown as BrandNiche];
            const followUp = needsFollowUp(brand);
            const statusConf =
              STATUS_CONFIG[brand.status as unknown as BrandStatus];
            return (
              <tr
                key={brand.id}
                className="group cursor-pointer transition-colors"
                style={{
                  borderTop: idx === 0 ? "none" : "1px solid #F0E8DF",
                  backgroundColor: "white",
                }}
                onClick={() => onEdit(brand)}
                onMouseEnter={(e) => {
                  (
                    e.currentTarget as HTMLTableRowElement
                  ).style.backgroundColor = "#FDFAF7";
                }}
                onMouseLeave={(e) => {
                  (
                    e.currentTarget as HTMLTableRowElement
                  ).style.backgroundColor = "white";
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <BrandAvatar
                      name={brand.name}
                      niche={brand.niche as unknown as BrandNiche}
                      size="sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="font-semibold"
                          style={{ color: "#3D2314" }}
                        >
                          {brand.name}
                        </span>
                        {followUp && (
                          <TriangleAlert
                            className="h-3 w-3"
                            style={{ color: "#D97706" }}
                          />
                        )}
                      </div>
                      {brand.email && (
                        <span
                          className="text-[11px]"
                          style={{ color: "#A89880" }}
                        >
                          {brand.email}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: nicheColor }}
                    />
                    <span className="text-xs" style={{ color: "#6B4226" }}>
                      {brand.niche}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={brand.status}
                    onValueChange={(v) =>
                      onStatusChange(brand.id, v as BrandStatus)
                    }
                  >
                    <SelectTrigger
                      className="h-7 w-[160px] cursor-pointer border-0 px-2.5 text-xs font-medium"
                      style={{
                        backgroundColor: statusConf.bg,
                        color: statusConf.text,
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="animate-in fade-in-0 zoom-in-95 rounded-xl border-[#EDE0D0] bg-white p-1.5 shadow-xl shadow-[#3D2314]/8 duration-150">
                      {STATUSES.map((s) => {
                        const conf = STATUS_CONFIG[s];
                        return (
                          <SelectItem
                            key={s}
                            value={s}
                            className="cursor-pointer rounded-lg pr-8 pl-3 transition-colors duration-100 focus:bg-[#FAF6F1] focus:text-[#3D2314]"
                          >
                            <div
                              className="flex items-center gap-2 py-0.5 text-xs font-medium"
                              style={{ color: conf.text }}
                            >
                              <span
                                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                style={{ backgroundColor: conf.dot }}
                              />
                              {s}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <ChannelBadge
                    channel={brand.channel as unknown as ContactChannel}
                  />
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor:
                        brand.contacts.length > 0 ? "#F0E8DF" : "#F5F0EB",
                      color: brand.contacts.length > 0 ? "#6B4226" : "#A89880",
                      minWidth: "24px",
                    }}
                  >
                    {brand.contacts.length}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-0 opacity-30 transition-opacity group-hover:opacity-100">
                    <InlineTooltip title="Éditer" className={warmTooltip}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(brand);
                        }}
                        className="cursor-pointer rounded-lg p-1.5 hover:bg-[#FAF6F1]"
                        style={{ color: "#6B4226" }}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </InlineTooltip>
                    <InlineTooltip
                      title="Historique des contacts"
                      className={warmTooltip}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onHistory(brand);
                        }}
                        className="cursor-pointer rounded-lg p-1.5 hover:bg-[#FAF6F1]"
                        style={{ color: "#6B4226" }}
                      >
                        <Clock className="h-3.5 w-3.5" />
                      </button>
                    </InlineTooltip>
                    <InlineTooltip title="Supprimer" className={warmTooltip}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(brand.id);
                        }}
                        className="cursor-pointer rounded-lg p-1.5 hover:bg-red-50"
                        style={{ color: "#6B4226" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#DC2626";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#6B4226";
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </InlineTooltip>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
