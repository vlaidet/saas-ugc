"use client";
import { useEffect, useRef, useMemo } from "react";
import { Search, X, Edit2 } from "lucide-react";
import type { Brand, BrandNiche, BrandStatus } from "../types";
import { BrandAvatar } from "./brand-avatar";
import { StatusBadge } from "./status-badge";

type SearchResult = {
  brand: Brand;
  matchField: "name" | "contact";
  matchText?: string;
};

interface CommandPaletteProps {
  brands: Brand[];
  onOpenBrand: (brand: Brand) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

export function CommandPalette({
  brands,
  onOpenBrand,
  open,
  onOpenChange,
  query,
  onQueryChange,
  selectedIndex,
  onSelectedIndexChange,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input à l'ouverture
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) {
      return brands.map((b) => ({ brand: b, matchField: "name" as const }));
    }
    const q = query.toLowerCase();
    const seen = new Set<string>();
    const res: SearchResult[] = [];

    for (const brand of brands) {
      const nameMatch =
        brand.name.toLowerCase().includes(q) ||
        brand.niche.toLowerCase().includes(q) ||
        brand.channel.toLowerCase().includes(q) ||
        (brand.email?.toLowerCase().includes(q) ?? false) ||
        (brand.notes?.toLowerCase().includes(q) ?? false);

      if (nameMatch && !seen.has(brand.id)) {
        seen.add(brand.id);
        res.push({ brand, matchField: "name" });
        continue;
      }

      for (const contact of brand.contacts) {
        const contactMatch =
          contact.message.toLowerCase().includes(q) ||
          (contact.response?.toLowerCase().includes(q) ?? false);

        if (contactMatch && !seen.has(brand.id)) {
          seen.add(brand.id);
          const text =
            contact.message.length > 70
              ? `${contact.message.slice(0, 70)}…`
              : contact.message;
          res.push({ brand, matchField: "contact", matchText: text });
          break;
        }
      }
    }

    return res;
  }, [brands, query]);

  // Navigation clavier
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelectedIndexChange(Math.min(selectedIndex + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelectedIndexChange(Math.max(selectedIndex - 1, 0));
      } else if (e.key === "Enter" && results.length > 0) {
        onOpenBrand(results[selectedIndex].brand);
        onOpenChange(false);
      } else if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    open,
    results,
    selectedIndex,
    onOpenBrand,
    onOpenChange,
    onSelectedIndexChange,
  ]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{
        backgroundColor: "rgba(61,35,20,0.25)",
        backdropFilter: "blur(4px)",
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="animate-in fade-in-0 zoom-in-95 w-full max-w-xl overflow-hidden rounded-2xl duration-150"
        style={{
          backgroundColor: "white",
          boxShadow:
            "0 24px 64px rgba(61,35,20,0.2), 0 4px 16px rgba(61,35,20,0.08)",
          border: "1px solid #EDE0D0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Champ de recherche */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: "1px solid #EDE0D0" }}
        >
          <Search
            className="h-4 w-4 flex-shrink-0"
            style={{ color: "#A89880" }}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher une marque ou un message..."
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              onSelectedIndexChange(0);
            }}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "#3D2314" }}
          />
          {query && (
            <button
              onClick={() => onQueryChange("")}
              className="flex-shrink-0 cursor-pointer rounded-md p-0.5 transition-colors hover:bg-[#FAF6F1]"
            >
              <X className="h-3.5 w-3.5" style={{ color: "#A89880" }} />
            </button>
          )}
          <kbd
            className="flex-shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              borderColor: "#EDE0D0",
              color: "#A89880",
              backgroundColor: "#F5F0EB",
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Résultats */}
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div
              className="py-10 text-center text-sm"
              style={{ color: "#A89880" }}
            >
              Aucun résultat pour &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {!query.trim() && (
                <p
                  className="px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: "#A89880" }}
                >
                  Toutes les marques
                </p>
              )}
              {query.trim() && (
                <p
                  className="px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide uppercase"
                  style={{ color: "#A89880" }}
                >
                  {results.length} résultat{results.length !== 1 ? "s" : ""}
                </p>
              )}
              {results.map((result, i) => (
                <button
                  key={`${result.brand.id}-${i}`}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-100"
                  style={{
                    backgroundColor:
                      i === selectedIndex ? "#FAF6F1" : "transparent",
                    border: `1px solid ${i === selectedIndex ? "#EDE0D0" : "transparent"}`,
                  }}
                  onClick={() => {
                    onOpenBrand(result.brand);
                    onOpenChange(false);
                  }}
                  onMouseEnter={() => onSelectedIndexChange(i)}
                >
                  <BrandAvatar
                    name={result.brand.name}
                    niche={result.brand.niche as unknown as BrandNiche}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="truncate text-sm font-semibold"
                        style={{ color: "#3D2314" }}
                      >
                        {result.brand.name}
                      </span>
                      <StatusBadge
                        status={result.brand.status as unknown as BrandStatus}
                      />
                    </div>
                    {result.matchField === "contact" && result.matchText ? (
                      <p
                        className="mt-0.5 truncate text-xs"
                        style={{ color: "#A89880" }}
                      >
                        Message : {result.matchText}
                      </p>
                    ) : (
                      <p
                        className="mt-0.5 text-xs"
                        style={{ color: "#A89880" }}
                      >
                        {result.brand.niche} · {result.brand.channel}
                      </p>
                    )}
                  </div>
                  <Edit2
                    className="h-3.5 w-3.5 flex-shrink-0 opacity-40"
                    style={{ color: "#6B4226" }}
                  />
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: "1px solid #EDE0D0", backgroundColor: "#FAF6F1" }}
        >
          <div
            className="flex items-center gap-3 text-[11px]"
            style={{ color: "#A89880" }}
          >
            <span>
              <kbd
                className="rounded border px-1 py-0.5"
                style={{ borderColor: "#E5D8CC", backgroundColor: "white" }}
              >
                ↵
              </kbd>{" "}
              ouvrir
            </span>
            <span>
              <kbd
                className="rounded border px-1 py-0.5"
                style={{ borderColor: "#E5D8CC", backgroundColor: "white" }}
              >
                ↑↓
              </kbd>{" "}
              naviguer
            </span>
            <span>
              <kbd
                className="rounded border px-1 py-0.5"
                style={{ borderColor: "#E5D8CC", backgroundColor: "white" }}
              >
                Esc
              </kbd>{" "}
              fermer
            </span>
          </div>
          <span className="text-[11px]" style={{ color: "#C4621D" }}>
            ⌘K
          </span>
        </div>
      </div>
    </div>
  );
}
