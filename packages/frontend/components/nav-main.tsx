"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, MessageCircle, BookText, ClipboardCheck } from "lucide-react";
import { usePathname } from "next/navigation";

const data = [
  {
    title: "Ask AI",
    url: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Compliance",
    url: "/dashboard/compliance",
    icon: ClipboardCheck,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BookText,
  },
];

export function NavMain() {
  const currentPathName = usePathname();

  return (
    <SidebarMenu>
      {data.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={item.url === currentPathName}>
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
