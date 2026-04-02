import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PipelineSidebar } from "@/features/pipeline/components/pipeline-sidebar";

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      className="h-screen !min-h-0 overflow-hidden"
      style={
        {
          "--sidebar": "#FAF6F1",
          "--sidebar-foreground": "#3D2314",
          "--sidebar-border": "#EDE0D0",
          "--sidebar-accent": "#F0E8DF",
          "--sidebar-accent-foreground": "#3D2314",
          "--sidebar-primary": "#C4621D",
          "--sidebar-primary-foreground": "#FFFFFF",
          "--sidebar-ring": "#C4621D",
        } as React.CSSProperties
      }
    >
      <PipelineSidebar />
      <SidebarInset className="overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
