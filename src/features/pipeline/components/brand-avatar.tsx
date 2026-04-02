import { cn } from "@/lib/utils";
import type { BrandNiche } from "../types";
import { NICHE_COLORS } from "../constants";

interface BrandAvatarProps {
  name: string;
  niche: BrandNiche;
  size?: "sm" | "md" | "lg";
}

export function BrandAvatar({ name, niche, size = "md" }: BrandAvatarProps) {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px] rounded-lg",
    md: "w-9 h-9 text-xs rounded-xl",
    lg: "w-11 h-11 text-sm rounded-2xl",
  };

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const backgroundColor = NICHE_COLORS[niche];

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center justify-center font-bold text-white",
        sizeClasses[size],
      )}
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  );
}
