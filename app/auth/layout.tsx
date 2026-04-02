import { Target } from "lucide-react";
import type { PropsWithChildren } from "react";

export default function RouteLayout(props: PropsWithChildren) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "#FAF6F1" }}
    >
      {/* Subtle dot pattern */}
      <div
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #3D2314 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              backgroundColor: "#C4621D",
              boxShadow: "0 2px 8px rgba(196,98,29,0.3)",
            }}
          >
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold" style={{ color: "#3D2314" }}>
            UGC Studio
          </span>
        </div>

        {props.children}
      </div>
    </div>
  );
}
