"use client";
import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import type { DateRangePreset, PipelineFilters } from "../types";

type DateRangeFilterProps = {
  filters: PipelineFilters;
  onFilterChange: (key: keyof PipelineFilters, value: string) => void;
};

const PRESET_LABELS: Record<DateRangePreset, string> = {
  all: "Toute la période",
  today: "Aujourd'hui",
  this_week: "Cette semaine",
  last_week: "La semaine dernière",
  this_month: "Ce mois-ci",
  last_month: "Le mois dernier",
  this_year: "Cette année",
  last_year: "L'année dernière",
  custom: "Personnalisé",
};

const PRESETS: DateRangePreset[] = [
  "all",
  "today",
  "this_week",
  "last_week",
  "this_month",
  "last_month",
  "this_year",
  "last_year",
  "custom",
];

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];

function toIso(date: Date) {
  return date.toISOString().slice(0, 10);
}

type MiniCalendarProps = {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
};

function MiniCalendar({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(() => {
    if (dateFrom) return new Date(`${dateFrom}T00:00:00`);
    return new Date();
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
  const to = dateTo ? new Date(`${dateTo}T00:00:00`) : null;
  const today = toIso(new Date());

  // Grille du mois : commence lundi
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7; // lundi = 0

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++)
    cells.push(new Date(year, month, d));
  // Complète la dernière semaine
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDay = (day: Date) => {
    const iso = toIso(day);
    if (!from || to) {
      // Nouvelle sélection
      onDateFromChange(iso);
      onDateToChange("");
    } else {
      // Deuxième clic
      if (day < from) {
        onDateToChange(toIso(from));
        onDateFromChange(iso);
      } else {
        onDateToChange(iso);
      }
    }
  };

  return (
    <div className="mt-2 select-none">
      {/* Navigation mois */}
      <div className="mb-2 flex items-center justify-between px-0.5">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#EDE0D0]"
          style={{ color: "#6B4226" }}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <span className="text-xs font-semibold" style={{ color: "#3D2314" }}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#EDE0D0]"
          style={{ color: "#6B4226" }}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Noms des jours */}
      <div className="mb-1 grid grid-cols-7 gap-0">
        {DAY_NAMES.map((d, i) => (
          <div
            key={i}
            className="flex h-6 items-center justify-center text-center text-[10px] font-semibold"
            style={{ color: "#A89880" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-0">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-7" />;

          const iso = toIso(day);
          const isFrom = from && iso === toIso(from);
          const isTo = to && iso === toIso(to);
          const isSelected = !!isFrom || !!isTo;
          const isInRange = from && to && day > from && day < to;
          const isToday = iso === today;

          return (
            <div
              key={iso}
              className="relative flex h-7 items-center justify-center"
            >
              {/* Fond de la plage (entre from et to) */}
              {isInRange && (
                <div
                  className="absolute inset-x-0 inset-y-0.5 rounded-none"
                  style={{ backgroundColor: "#FEF3ED" }}
                />
              )}
              {/* Demi-fond côté droit pour la date de début */}
              {isFrom && to && (
                <div
                  className="absolute inset-y-0.5 right-0 left-1/2"
                  style={{ backgroundColor: "#FEF3ED" }}
                />
              )}
              {/* Demi-fond côté gauche pour la date de fin */}
              {isTo && from && (
                <div
                  className="absolute inset-y-0.5 right-1/2 left-0"
                  style={{ backgroundColor: "#FEF3ED" }}
                />
              )}

              <button
                onClick={() => handleDay(day)}
                className="relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-all duration-100"
                style={{
                  backgroundColor: isSelected ? "#C4621D" : "transparent",
                  color: isSelected
                    ? "white"
                    : isInRange
                      ? "#C4621D"
                      : "#3D2314",
                  fontWeight: isSelected || isToday ? 700 : 400,
                  boxShadow:
                    isToday && !isSelected ? "inset 0 0 0 1px #C4621D" : "none",
                }}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>

      {/* Résumé de la sélection */}
      {(from ?? to) && (
        <div
          className="mt-2 rounded-lg px-2.5 py-2 text-[11px]"
          style={{ backgroundColor: "#FAF6F1", border: "1px solid #EDE0D0" }}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <span
                className="font-semibold tracking-wide uppercase"
                style={{ color: "#A89880" }}
              >
                Du{" "}
              </span>
              <span style={{ color: "#3D2314" }}>
                {from
                  ? from.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })
                  : "—"}
              </span>
            </div>
            <div
              className="h-px flex-1"
              style={{ backgroundColor: "#EDE0D0" }}
            />
            <div>
              <span
                className="font-semibold tracking-wide uppercase"
                style={{ color: "#A89880" }}
              >
                Au{" "}
              </span>
              <span style={{ color: "#3D2314" }}>
                {to
                  ? to.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function DateRangeFilter({
  filters,
  onFilterChange,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isActive = filters.datePreset !== "all";
  const isCustom = filters.datePreset === "custom";

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectPreset = (preset: DateRangePreset) => {
    onFilterChange("datePreset", preset);
    if (preset !== "custom") {
      onFilterChange("dateFrom", "");
      onFilterChange("dateTo", "");
      setOpen(false);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFilterChange("datePreset", "all");
    onFilterChange("dateFrom", "");
    onFilterChange("dateTo", "");
  };

  // Label affiché dans le bouton quand plage personnalisée active
  const activeLabel = (() => {
    if (!isCustom) return PRESET_LABELS[filters.datePreset];
    if (filters.dateFrom && filters.dateTo) {
      const from = new Date(`${filters.dateFrom}T00:00:00`);
      const to = new Date(`${filters.dateTo}T00:00:00`);
      return `${from.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} → ${to.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
    }
    if (filters.dateFrom) {
      const from = new Date(`${filters.dateFrom}T00:00:00`);
      return `À partir du ${from.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
    }
    return PRESET_LABELS.custom;
  })();

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-all duration-150"
        style={{
          backgroundColor: isActive ? "#FEF3ED" : "#F5F0EB",
          borderColor: isActive ? "rgba(196,98,29,0.3)" : "#E5D8CC",
          color: isActive ? "#C4621D" : "#6B4226",
        }}
      >
        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
        <span className="hidden max-w-[140px] truncate sm:block">
          {activeLabel}
        </span>
        {isActive ? (
          <X
            className="h-3 w-3 flex-shrink-0 opacity-60 hover:opacity-100"
            onClick={clear}
          />
        ) : (
          <ChevronDown className="h-3 w-3 flex-shrink-0 opacity-60" />
        )}
      </button>

      {open && (
        <div
          className="animate-in fade-in-0 zoom-in-95 absolute top-full left-0 z-30 mt-1.5 overflow-hidden rounded-xl border p-1.5 shadow-xl duration-150"
          style={{
            backgroundColor: "white",
            borderColor: "#EDE0D0",
            boxShadow: "0 12px 40px rgba(61,35,20,0.12)",
            width: isCustom ? "232px" : "208px",
          }}
        >
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => selectPreset(preset)}
              className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-100"
              style={{
                backgroundColor:
                  filters.datePreset === preset ? "#FAF6F1" : "transparent",
                color: filters.datePreset === preset ? "#C4621D" : "#6B4226",
              }}
            >
              {PRESET_LABELS[preset]}
            </button>
          ))}

          {isCustom && (
            <div
              className="mt-1 rounded-lg p-2"
              style={{
                border: "1px solid #EDE0D0",
                backgroundColor: "#FAF6F1",
              }}
            >
              <MiniCalendar
                dateFrom={filters.dateFrom}
                dateTo={filters.dateTo}
                onDateFromChange={(v) => onFilterChange("dateFrom", v)}
                onDateToChange={(v) => onFilterChange("dateTo", v)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
