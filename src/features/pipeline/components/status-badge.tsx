import type { BrandStatus } from "../types";
import { STATUS_CONFIG } from "../constants";

export function StatusBadge({ status }: { status: BrandStatus }) {
  const conf = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: conf.bg, color: conf.text }}
    >
      <span
        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
        style={{ backgroundColor: conf.dot }}
      />
      {status}
    </span>
  );
}
