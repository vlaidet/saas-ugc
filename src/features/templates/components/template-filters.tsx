"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { CHANNELS, NICHES } from "@/features/pipeline/constants";
import type { TemplateFilters as Filters, TemplateSortBy } from "../types";

type TemplateFiltersProps = {
  filters: Filters;
  sortBy: TemplateSortBy;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onSortChange: (sortBy: TemplateSortBy) => void;
};

const SORT_OPTIONS: { value: TemplateSortBy; label: string }[] = [
  { value: "responseRate", label: "Taux de réponse" },
  { value: "timesUsed", label: "Plus utilisés" },
  { value: "newest", label: "Plus récents" },
];

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  const isActive = value !== "all";

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer appearance-none rounded-lg border px-3 py-1.5 text-xs font-medium transition-all outline-none"
      style={{
        backgroundColor: isActive ? "#FEF3ED" : "#F5F0EB",
        color: isActive ? "#C4621D" : "#6B4226",
        borderColor: isActive ? "#F5D5B8" : "transparent",
      }}
    >
      <option value="all">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export function TemplateFilters({
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
}: TemplateFiltersProps) {
  const hasActiveFilters =
    filters.channel !== "all" ||
    filters.niche !== "all" ||
    filters.search !== "";

  return (
    <div
      className="flex flex-shrink-0 flex-wrap items-center gap-2 px-6 py-2.5"
      style={{ borderBottom: "1px solid #EDE0D0" }}
    >
      {/* Recherche */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2"
          style={{ color: "#A89880" }}
        />
        <input
          type="text"
          placeholder="Rechercher..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="h-8 w-44 rounded-lg border bg-white/60 pr-3 pl-8 text-xs transition-all outline-none focus:bg-white focus:shadow-sm"
          style={{ borderColor: "#EDE0D0", color: "#3D2314" }}
        />
      </div>

      <FilterSelect
        value={filters.channel}
        onChange={(v) => onFilterChange("channel", v)}
        options={CHANNELS}
        placeholder="Canal"
      />

      <FilterSelect
        value={filters.niche}
        onChange={(v) => onFilterChange("niche", v)}
        options={NICHES}
        placeholder="Niche"
      />

      {/* Séparateur */}
      <div className="mx-1 h-5 w-px" style={{ backgroundColor: "#EDE0D0" }} />

      {/* Tri */}
      <div className="flex items-center gap-1.5">
        <SlidersHorizontal
          className="h-3.5 w-3.5"
          style={{ color: "#A89880" }}
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as TemplateSortBy)}
          className="cursor-pointer appearance-none rounded-lg bg-transparent px-2 py-1.5 text-xs font-medium outline-none"
          style={{ color: "#6B4226" }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Réinitialiser */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            onFilterChange("channel", "all");
            onFilterChange("niche", "all");
            onFilterChange("search", "");
          }}
          className="ml-auto flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-[#F5F0EB]"
          style={{ color: "#A89880" }}
        >
          <X className="h-3 w-3" />
          Réinitialiser
        </button>
      )}
    </div>
  );
}
