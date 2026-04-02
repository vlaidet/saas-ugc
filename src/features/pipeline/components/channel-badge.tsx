import type { ContactChannel } from "../types";
import { CHANNEL_CONFIG } from "../constants";

interface ChannelBadgeProps {
  channel: ContactChannel;
  size?: "sm" | "md";
}

export function ChannelBadge({ channel, size = "sm" }: ChannelBadgeProps) {
  const config = CHANNEL_CONFIG[channel];
  const px = size === "sm" ? "6px 10px" : "5px 12px";
  const fontSize = size === "sm" ? "11px" : "12px";

  return (
    <span
      className="inline-flex flex-shrink-0 items-center rounded-full font-semibold"
      style={{
        background: config.gradient,
        color: config.textColor,
        padding: px,
        fontSize,
        letterSpacing: "0.01em",
      }}
    >
      {channel}
    </span>
  );
}
