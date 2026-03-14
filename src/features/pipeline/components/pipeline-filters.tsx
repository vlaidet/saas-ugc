import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PipelineFilters } from "../types";
import { NICHES, CHANNELS, STATUSES } from "../constants";

interface PipelineFiltersProps {
  filters: PipelineFilters;
  onFilterChange: (key: keyof PipelineFilters, value: string) => void;
}

export function PipelineFilters({
  filters,
  onFilterChange,
}: PipelineFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative max-w-xs flex-1">
        <Search
          className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          style={{ color: "#A89880" }}
        />
        <input
          type="text"
          placeholder="Chercher une marque..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="w-full rounded-lg border py-2 pr-3 pl-9 text-sm"
          style={{
            borderColor: "#EDE0D0",
            color: "#3D2314",
            backgroundColor: "#FFFFFF",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#C4621D";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#EDE0D0";
          }}
        />
      </div>

      <Select
        value={filters.niche}
        onValueChange={(value) => onFilterChange("niche", value)}
      >
        <SelectTrigger
          className="w-[180px]"
          style={{ borderColor: "#EDE0D0", color: "#6B4226" }}
        >
          <SelectValue placeholder="Niche" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les niches</SelectItem>
          {NICHES.map((niche) => (
            <SelectItem key={niche} value={niche}>
              {niche}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger
          className="w-[180px]"
          style={{ borderColor: "#EDE0D0", color: "#6B4226" }}
        >
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          {STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.channel}
        onValueChange={(value) => onFilterChange("channel", value)}
      >
        <SelectTrigger
          className="w-[180px]"
          style={{ borderColor: "#EDE0D0", color: "#6B4226" }}
        >
          <SelectValue placeholder="Canal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les canaux</SelectItem>
          {CHANNELS.map((channel) => (
            <SelectItem key={channel} value={channel}>
              {channel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
