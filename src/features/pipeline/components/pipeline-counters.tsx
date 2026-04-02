import type { Brand } from "../types";
import { TrendingUp, Mail, MessageCircle, CheckCircle2 } from "lucide-react";

export function PipelineCounters({ brands }: { brands: Brand[] }) {
  const stats = [
    {
      label: "Total",
      sublabel: "marques",
      value: brands.length,
      Icon: TrendingUp,
      color: "#C4621D",
      bg: "#FEF3EB",
    },
    {
      label: "Contactées",
      sublabel: "en attente",
      value: brands.filter((b) => b.status === "Contactée").length,
      Icon: Mail,
      color: "#2563EB",
      bg: "#EFF6FF",
    },
    {
      label: "En discussion",
      sublabel: "en cours",
      value: brands.filter((b) => b.status === "En discussion").length,
      Icon: MessageCircle,
      color: "#D97706",
      bg: "#FFFBEB",
    },
    {
      label: "Deals signés",
      sublabel: "conclus",
      value: brands.filter((b) => b.status === "Deal signé").length,
      Icon: CheckCircle2,
      color: "#059669",
      bg: "#ECFDF5",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 gap-3 px-6 py-4 lg:grid-cols-4"
      style={{ borderBottom: "1px solid #EDE0D0" }}
    >
      {stats.map(({ label, sublabel, value, Icon, color, bg }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-2xl p-4"
          style={{ backgroundColor: bg, border: `1px solid ${color}20` }}
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p
              className="text-2xl leading-none font-bold"
              style={{ color: "#3D2314" }}
            >
              {value}
            </p>
            <p
              className="mt-1 text-xs leading-tight font-medium"
              style={{ color }}
            >
              {label}
            </p>
            <p className="text-[11px]" style={{ color: "#A89880" }}>
              {sublabel}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
