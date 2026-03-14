"use client";

import { useState } from "react";
import type { Brand, BrandStatus } from "../types";
import { STATUSES, STATUS_COLORS } from "../constants";
import { BrandCard } from "./brand-card";

interface KanbanViewProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onHistory: (brand: Brand) => void;
  onStatusChange: (brandId: string, status: BrandStatus) => void;
  onDragStart: (id: string) => void;
  needsFollowUp: (brand: Brand) => boolean;
}

export function KanbanView({
  brands,
  onEdit,
  onDelete,
  onHistory,
  onStatusChange,
  onDragStart,
  needsFollowUp,
}: KanbanViewProps) {
  const [dragOverStatus, setDragOverStatus] = useState<BrandStatus | null>(
    null,
  );

  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex min-w-min items-start gap-4">
        {STATUSES.map((status) => {
          const statusBrands = brands.filter((b) => b.status === status);
          const statusCount = statusBrands.length;
          const colors = STATUS_COLORS[status];
          const isDragOver = dragOverStatus === status;

          return (
            <div
              key={status}
              className="flex max-w-[290px] min-w-[290px] flex-col overflow-hidden rounded-2xl bg-white"
              style={{ borderTop: `3px solid ${colors.topBorder}` }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={() => setDragOverStatus(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverStatus(null);
                const brandId = e.dataTransfer.getData("brandId");
                onStatusChange(brandId, status);
              }}
            >
              {/* Column header */}
              <div
                className="px-4 py-3"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <h2
                  className="text-sm font-semibold"
                  style={{ color: "#3D2314" }}
                >
                  {status}
                </h2>
                <p
                  className="mt-1 text-xs font-medium"
                  style={{ color: "#A89880" }}
                >
                  {statusCount} marque{statusCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Drop zone */}
              <div
                className={`flex min-h-[400px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-3 transition-colors ${
                  isDragOver ? "bg-opacity-50" : ""
                }`}
                style={{
                  backgroundColor: isDragOver
                    ? `${colors.topBorder}08`
                    : "#FFFFFF",
                }}
              >
                {statusBrands.length > 0 ? (
                  statusBrands.map((brand) => (
                    <BrandCard
                      key={brand.id}
                      brand={brand}
                      onEdit={() => onEdit(brand)}
                      onDelete={() => onDelete(brand.id)}
                      onHistory={() => onHistory(brand)}
                      onDragStart={onDragStart}
                      needsFollowUp={needsFollowUp(brand)}
                    />
                  ))
                ) : (
                  <div
                    className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed p-4 text-center text-sm"
                    style={{
                      borderColor: colors.border,
                      color: "#A89880",
                    }}
                  >
                    Aucune marque dans cette étape
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
