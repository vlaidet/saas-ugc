"use client";
import { useState } from "react";
import type { Brand, BrandStatus } from "../types";
import { STATUSES, STATUS_CONFIG } from "../constants";
import { BrandCard } from "./brand-card";

type DropTarget =
  | { kind: "card"; brandId: string; position: "before" | "after" }
  | { kind: "column"; status: BrandStatus };

interface KanbanViewProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onHistory: (brand: Brand) => void;
  onStatusChange: (brandId: string, status: BrandStatus) => void;
  onReorder: (
    dragId: string,
    targetId: string,
    position: "before" | "after",
    status: BrandStatus,
  ) => void;
  onDragStart: (id: string) => void;
  needsFollowUp: (brand: Brand) => boolean;
}

export function KanbanView({
  brands,
  onEdit,
  onDelete,
  onHistory,
  onStatusChange,
  onReorder,
  onDragStart,
  needsFollowUp,
}: KanbanViewProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);

  const handleDragStart = (id: string) => {
    setDraggingId(id);
    onDragStart(id);
  };

  const handleDrop = (e: React.DragEvent, status: BrandStatus) => {
    e.preventDefault();
    const dragId = e.dataTransfer.getData("brandId");
    if (!dragId) return;

    if (dropTarget?.kind === "card") {
      onReorder(dragId, dropTarget.brandId, dropTarget.position, status);
    } else {
      onStatusChange(dragId, status);
    }

    setDraggingId(null);
    setDropTarget(null);
  };

  const handleCardDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    brandId: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? "before" : "after";
    setDropTarget({ kind: "card", brandId, position });
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-min items-start gap-3 pb-2">
        {STATUSES.map((status) => {
          const conf = STATUS_CONFIG[status];
          const columnBrands = brands.filter((b) => b.status === status);
          const isColumnTarget =
            dropTarget?.kind === "column" && dropTarget.status === status;

          return (
            <div
              key={status}
              className="flex w-72 flex-shrink-0 flex-col rounded-2xl bg-white transition-all duration-150"
              style={{
                borderLeft: `3px solid ${conf.border}`,
                boxShadow: isColumnTarget
                  ? `0 0 0 2px ${conf.border}50, 0 4px 16px rgba(61,35,20,0.08)`
                  : "0 1px 4px rgba(61,35,20,0.06)",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dropTarget?.kind !== "card") {
                  setDropTarget({ kind: "column", status });
                }
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDropTarget(null);
                }
              }}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column header */}
              <div
                className="flex items-center justify-between border-b px-4 py-3.5"
                style={{ borderColor: "#F0E8DF" }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: conf.dot }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "#3D2314" }}
                  >
                    {status}
                  </span>
                </div>
                <span
                  className="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold"
                  style={{ backgroundColor: "#F0E8DF", color: "#6B4226" }}
                >
                  {columnBrands.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="flex flex-col p-3">
                {columnBrands.length > 0 ? (
                  columnBrands.map((brand, index) => {
                    const isCardTarget =
                      dropTarget?.kind === "card" &&
                      dropTarget.brandId === brand.id;

                    return (
                      <div
                        key={brand.id}
                        className="animate-in fade-in-0 slide-in-from-bottom-2 flex flex-col duration-300"
                        style={{
                          animationDelay: `${index * 35}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        {/* Insertion line — BEFORE */}
                        <div
                          className="mx-1 my-0.5 h-0.5 rounded-full transition-all duration-100"
                          style={{
                            backgroundColor:
                              isCardTarget && dropTarget.position === "before"
                                ? conf.dot
                                : "transparent",
                          }}
                        />

                        <div
                          onDragOver={(e) => handleCardDragOver(e, brand.id)}
                        >
                          <BrandCard
                            brand={brand}
                            onEdit={() => onEdit(brand)}
                            onDelete={() => onDelete(brand.id)}
                            onHistory={() => onHistory(brand)}
                            onDragStart={handleDragStart}
                            needsFollowUp={needsFollowUp(brand)}
                            isDragging={draggingId === brand.id}
                          />
                        </div>

                        {/* Insertion line — AFTER (last card only shows bottom line) */}
                        <div
                          className="mx-1 my-0.5 h-0.5 rounded-full transition-all duration-100"
                          style={{
                            backgroundColor:
                              isCardTarget && dropTarget.position === "after"
                                ? conf.dot
                                : "transparent",
                          }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="flex min-h-[100px] items-center justify-center rounded-xl border-2 border-dashed text-center transition-all duration-150"
                    style={{
                      borderColor: isColumnTarget ? conf.border : "#EDE0D0",
                      backgroundColor: isColumnTarget
                        ? `${conf.bg}60`
                        : "transparent",
                    }}
                  >
                    <p className="px-4 text-xs" style={{ color: "#A89880" }}>
                      {isColumnTarget ? "Déposer ici" : "Aucune marque"}
                    </p>
                  </div>
                )}

                {/* Drop zone at bottom (when column has cards) */}
                {columnBrands.length > 0 && (
                  <div
                    className="mt-1 flex min-h-[36px] items-center justify-center rounded-xl border-2 border-dashed transition-all duration-150"
                    style={{
                      borderColor: isColumnTarget ? conf.border : "transparent",
                      backgroundColor: isColumnTarget
                        ? `${conf.bg}50`
                        : "transparent",
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDropTarget({ kind: "column", status });
                    }}
                  >
                    {isColumnTarget && (
                      <p className="text-[11px]" style={{ color: conf.dot }}>
                        Déposer ici
                      </p>
                    )}
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
