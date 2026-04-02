"use client";

import { FileText, TrendingUp, Send, Award } from "lucide-react";
import type { MessageTemplate } from "../types";
import { getResponseRate } from "../constants";

type TemplateStatsProps = {
  templates: MessageTemplate[];
};

export function TemplateStats({ templates }: TemplateStatsProps) {
  const totalTemplates = templates.length;
  const totalUses = templates.reduce((sum, t) => sum + t.timesUsed, 0);
  const totalReplies = templates.reduce((sum, t) => sum + t.timesReplied, 0);
  const avgRate =
    totalUses > 0 ? Math.round((totalReplies / totalUses) * 100) : 0;

  // Meilleur template par taux de réponse (minimum 5 utilisations)
  const bestTemplate = templates
    .filter((t) => t.timesUsed >= 5)
    .sort(
      (a, b) =>
        getResponseRate(b.timesUsed, b.timesReplied) -
        getResponseRate(a.timesUsed, a.timesReplied),
    )
    .at(0);

  const stats = [
    {
      icon: FileText,
      value: totalTemplates,
      label: "Templates",
      sublabel: "disponibles",
      iconBg: "#F0E8DF",
      iconColor: "#C4621D",
    },
    {
      icon: Send,
      value: totalUses,
      label: "Utilisations",
      sublabel: "au total",
      iconBg: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      icon: TrendingUp,
      value: `${avgRate}%`,
      label: "Taux moyen",
      sublabel: "de réponse",
      iconBg: "#ECFDF5",
      iconColor: "#059669",
    },
    {
      icon: Award,
      value: bestTemplate
        ? `${getResponseRate(bestTemplate.timesUsed, bestTemplate.timesReplied)}%`
        : "—",
      label: "Meilleur",
      sublabel: bestTemplate ? bestTemplate.title : "aucun",
      iconBg: "#FEF3ED",
      iconColor: "#C4621D",
    },
  ];

  return (
    <div
      className="flex-shrink-0 px-6 py-4"
      style={{ borderBottom: "1px solid #EDE0D0" }}
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.6)",
              border: "1px solid #EDE0D0",
            }}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: stat.iconBg }}
            >
              <stat.icon
                className="h-5 w-5"
                style={{ color: stat.iconColor }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-lg leading-none font-bold"
                style={{ color: "#3D2314" }}
              >
                {stat.value}
              </p>
              <p
                className="mt-0.5 text-xs leading-none"
                style={{ color: "#6B4226" }}
              >
                {stat.label}
              </p>
              <p
                className="mt-0.5 truncate text-[10px] leading-none"
                style={{ color: "#A89880" }}
              >
                {stat.sublabel}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
