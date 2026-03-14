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
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
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
        "flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeClasses[size],
      )}
      style={{ backgroundColor }}
    >
      {initials}
    </div>
  );
}
