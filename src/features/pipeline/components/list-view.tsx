"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Trash2, Clock, Bell } from "lucide-react";
import type { Brand, BrandStatus } from "../types";
import { STATUSES, NICHE_COLORS } from "../constants";
import { BrandAvatar } from "./brand-avatar";

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
  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
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
              style={{ color: "#6B4226" }}
            >
              Nom
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#6B4226" }}
            >
              Niche
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#6B4226" }}
            >
              Statut
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#6B4226" }}
            >
              Canal
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#6B4226" }}
            >
              Contacts
            </th>
            <th
              className="px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase"
              style={{ color: "#6B4226" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {brands.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-8 text-center"
                style={{ color: "#A89880" }}
              >
                Aucune marque trouvée
              </td>
            </tr>
          ) : (
            brands.map((brand) => {
              const nicheColor = NICHE_COLORS[brand.niche];
              return (
                <tr
                  key={brand.id}
                  style={{ borderBottom: "1px solid #EDE0D0" }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "#FAF6F1";
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLTableRowElement
                    ).style.backgroundColor = "transparent";
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <BrandAvatar
                        name={brand.name}
                        niche={brand.niche}
                        size="sm"
                      />
                      <div className="flex flex-col gap-1">
                        <span
                          className="font-medium"
                          style={{ color: "#3D2314" }}
                        >
                          {brand.name}
                        </span>
                        {needsFollowUp(brand) && (
                          <div
                            className="flex items-center gap-1 text-xs font-medium"
                            style={{ color: "#D97706" }}
                          >
                            <Bell className="h-3 w-3" />
                            Relancer
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        backgroundColor: `${nicheColor}18`,
                        color: nicheColor,
                      }}
                    >
                      {brand.niche}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={brand.status}
                      onValueChange={(status) =>
                        onStatusChange(brand.id, status as BrandStatus)
                      }
                    >
                      <SelectTrigger
                        className="h-8 w-[150px]"
                        style={{ borderColor: "#EDE0D0", color: "#3D2314" }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#6B4226" }}>
                    {brand.channel}
                  </td>
                  <td className="px-4 py-3" style={{ color: "#6B4226" }}>
                    {brand.contacts.length}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEdit(brand)}
                        className="rounded-lg p-1.5 transition-colors hover:bg-[#FAF6F1]"
                        style={{ color: "#A89880" }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onHistory(brand)}
                        className="rounded-lg p-1.5 transition-colors hover:bg-[#FAF6F1]"
                        style={{ color: "#A89880" }}
                      >
                        <Clock className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => onDelete(brand.id)}
                        className="rounded-lg p-1.5 transition-colors hover:bg-red-50"
                        style={{ color: "#A89880" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#EF4444";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#A89880";
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
