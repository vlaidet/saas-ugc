"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { X, ChevronDown } from "lucide-react";
import type { PipelineFilters } from "../types";
import { NICHES, CHANNELS, STATUSES } from "../constants";

type PipelineFiltersProps = {
  filters: PipelineFilters;
  onFilterChange: (key: keyof PipelineFilters, value: string) => void;
};

const warmSelectContent =
  "rounded-xl border-[#EDE0D0] bg-white p-1.5 shadow-xl shadow-[#3D2314]/8 animate-in fade-in-0 zoom-in-95 duration-150";

const warmSelectItem =
  "rounded-lg pl-3 pr-8 py-2 text-sm font-medium cursor-pointer transition-colors duration-100 focus:bg-[#FAF6F1] focus:text-[#3D2314] text-[#6B4226]";

export function PipelineFilters({
  filters,
  onFilterChange,
}: PipelineFiltersProps) {
  const hasActiveFilters =
    filters.niche !== "all" ||
    filters.status !== "all" ||
    filters.channel !== "all";

  const clearAll = () => {
    onFilterChange("niche", "all");
    onFilterChange("status", "all");
    onFilterChange("channel", "all");
  };

  const nicheActive = filters.niche !== "all";
  const statusActive = filters.status !== "all";
  const channelActive = filters.channel !== "all";

  return (
    <div className="flex items-center gap-2">
      {/* Niche */}
      <Select
        value={filters.niche}
        onValueChange={(v) => onFilterChange("niche", v)}
      >
        <SelectTrigger
          className="h-8 cursor-pointer gap-1 rounded-lg px-3 text-sm font-medium shadow-none ring-0 transition-all duration-150 focus:ring-0 [&>svg]:hidden"
          style={{
            backgroundColor: nicheActive ? "#FEF3ED" : "#F5F0EB",
            border: `1px solid ${nicheActive ? "rgba(196,98,29,0.3)" : "#E5D8CC"}`,
            color: nicheActive ? "#C4621D" : "#6B4226",
          }}
        >
          <span className="truncate">
            {filters.niche === "all" ? "Toutes les niches" : filters.niche}
          </span>
          <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0 opacity-60" />
        </SelectTrigger>
        <SelectContent className={warmSelectContent}>
          <SelectItem value="all" className={warmSelectItem}>
            Toutes les niches
          </SelectItem>
          {NICHES.map((n) => (
            <SelectItem key={n} value={n} className={warmSelectItem}>
              {n}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select
        value={filters.status}
        onValueChange={(v) => onFilterChange("status", v)}
      >
        <SelectTrigger
          className="h-8 cursor-pointer gap-1 rounded-lg px-3 text-sm font-medium shadow-none ring-0 transition-all duration-150 focus:ring-0 [&>svg]:hidden"
          style={{
            backgroundColor: statusActive ? "#FEF3ED" : "#F5F0EB",
            border: `1px solid ${statusActive ? "rgba(196,98,29,0.3)" : "#E5D8CC"}`,
            color: statusActive ? "#C4621D" : "#6B4226",
          }}
        >
          <span className="truncate">
            {filters.status === "all" ? "Tous les statuts" : filters.status}
          </span>
          <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0 opacity-60" />
        </SelectTrigger>
        <SelectContent className={warmSelectContent}>
          <SelectItem value="all" className={warmSelectItem}>
            Tous les statuts
          </SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s} className={warmSelectItem}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Channel */}
      <Select
        value={filters.channel}
        onValueChange={(v) => onFilterChange("channel", v)}
      >
        <SelectTrigger
          className="h-8 cursor-pointer gap-1 rounded-lg px-3 text-sm font-medium shadow-none ring-0 transition-all duration-150 focus:ring-0 [&>svg]:hidden"
          style={{
            backgroundColor: channelActive ? "#FEF3ED" : "#F5F0EB",
            border: `1px solid ${channelActive ? "rgba(196,98,29,0.3)" : "#E5D8CC"}`,
            color: channelActive ? "#C4621D" : "#6B4226",
          }}
        >
          <span className="truncate">
            {filters.channel === "all" ? "Tous les canaux" : filters.channel}
          </span>
          <ChevronDown className="ml-1 h-3 w-3 flex-shrink-0 opacity-60" />
        </SelectTrigger>
        <SelectContent className={warmSelectContent}>
          <SelectItem value="all" className={warmSelectItem}>
            Tous les canaux
          </SelectItem>
          {CHANNELS.map((c) => (
            <SelectItem key={c} value={c} className={warmSelectItem}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Effacer */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all duration-150"
          style={{
            backgroundColor: "#F5F0EB",
            border: "1px solid #E5D8CC",
            color: "#A89880",
          }}
        >
          <X className="h-3 w-3" />
          Effacer
        </button>
      )}
    </div>
  );
}
