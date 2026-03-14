import type { Brand } from "../types";
import {
  TrendingUp,
  MessageSquare,
  Handshake,
  CheckCircle2,
} from "lucide-react";

interface PipelineCountersProps {
  brands: Brand[];
}

export function PipelineCounters({ brands }: PipelineCountersProps) {
  const total = brands.length;
  const contacted = brands.filter((b) => b.status === "Contactée").length;
  const discussing = brands.filter((b) => b.status === "En discussion").length;
  const deals = brands.filter((b) => b.status === "Deal signé").length;

  const stats = [
    {
      label: "Total marques",
      value: total,
      Icon: TrendingUp,
      color: "#C4621D",
    },
    {
      label: "Contactées",
      value: contacted,
      Icon: MessageSquare,
      color: "#3B82F6",
    },
    {
      label: "En discussion",
      value: discussing,
      Icon: Handshake,
      color: "#F59E0B",
    },
    {
      label: "Deals signés",
      value: deals,
      Icon: CheckCircle2,
      color: "#10B981",
    },
  ];

  return (
    <div
      className="grid grid-cols-4 divide-x"
      style={{
        borderBottom: "1px solid #EDE0D0",
        borderBottomColor: "#EDE0D0",
        borderRightColor: "#EDE0D0",
      }}
    >
      {stats.map(({ label, value, Icon, color }) => (
        <div key={label} className="flex items-center gap-4 px-6 py-5">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: "#3D2314" }}>
              {value}
            </div>
            <div
              className="mt-0.5 text-xs font-medium"
              style={{ color: "#A89880" }}
            >
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
