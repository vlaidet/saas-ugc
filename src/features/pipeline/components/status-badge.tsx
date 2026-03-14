import { Badge } from "@/components/ui/badge";
import type { BrandStatus } from "../types";
import { STATUS_COLORS } from "../constants";

interface StatusBadgeProps {
  status: BrandStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];

  return (
    <Badge
      className="pointer-events-none"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {status}
    </Badge>
  );
}
