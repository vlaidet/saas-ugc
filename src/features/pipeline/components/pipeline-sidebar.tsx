"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Target,
  MessageSquare,
  ChevronsUpDown,
  LogOut,
  Settings,
  CreditCard,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/nowts/loader";

const NAV_LINKS = [
  { href: "/pipeline", label: "Pipeline", Icon: Target },
  { href: "/pipeline/messages", label: "Messages", Icon: MessageSquare },
] as const;

const BOTTOM_LINKS = [
  { href: "/pipeline/settings", label: "Paramètres", Icon: Settings },
  { href: "/pipeline/billing", label: "Abonnement", Icon: CreditCard },
] as const;

export function PipelineSidebar() {
  const pathname = usePathname();
  const session = useSession();
  const user = session.data?.user;

  const logout = useMutation({
    mutationFn: async () => signOut(),
    onSuccess: () => {
      window.location.href = "/auth/signin";
    },
  });

  return (
    <Sidebar
      collapsible="icon"
      style={{
        borderRight: "none",
        boxShadow: "4px 0 16px rgba(61,35,20,0.06)",
      }}
    >
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:px-2">
        <Link
          href="/pipeline"
          className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center"
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#C4621D" }}
          >
            <Target className="h-4 w-4 text-white" />
          </div>
          <span
            className="truncate text-sm font-bold group-data-[collapsible=icon]:hidden"
            style={{ color: "#3D2314" }}
          >
            UGC Studio
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel style={{ color: "#A89880" }}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/pipeline"
                    ? pathname === "/pipeline"
                    : pathname.startsWith(link.href);
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={link.label}
                    >
                      <Link href={link.href}>
                        <link.Icon />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel style={{ color: "#A89880" }}>
            Compte
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {BOTTOM_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={link.label}
                    >
                      <Link href={link.href}>
                        <link.Icon />
                        <span>{link.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="cursor-pointer">
                  <Avatar className="size-8 rounded-xl">
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? ""}
                    />
                    <AvatarFallback
                      className="rounded-xl text-xs font-semibold"
                      style={{
                        backgroundColor: "#C4621D",
                        color: "#FFFFFF",
                      }}
                    >
                      {user ? user.name[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span
                      className="truncate text-xs"
                      style={{ color: "#A89880" }}
                    >
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown
                    className="ml-auto size-4"
                    style={{ color: "#A89880" }}
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 rounded-xl border-0 p-0"
                side="right"
                align="end"
                sideOffset={8}
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow:
                    "0 4px 24px rgba(61,35,20,0.12), 0 1px 4px rgba(61,35,20,0.08)",
                }}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: "1px solid #EDE0D0" }}
                >
                  <Avatar className="size-10 rounded-xl">
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? ""}
                    />
                    <AvatarFallback
                      className="rounded-xl text-sm font-semibold"
                      style={{
                        backgroundColor: "#C4621D",
                        color: "#FFFFFF",
                      }}
                    >
                      {user ? user.name[0] : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-semibold"
                      style={{ color: "#3D2314" }}
                    >
                      {user?.name}
                    </p>
                    <p
                      className="truncate text-xs"
                      style={{ color: "#A89880" }}
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>
                <div className="p-1.5">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      logout.mutate();
                    }}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm focus:bg-[#F5F0EB]"
                    style={{ color: "#6B4226" }}
                  >
                    {logout.isPending ? (
                      <Loader
                        className="mr-2.5 size-4"
                        style={{ color: "#A89880" }}
                      />
                    ) : (
                      <LogOut
                        className="mr-2.5 size-4"
                        style={{ color: "#A89880" }}
                      />
                    )}
                    Se déconnecter
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
