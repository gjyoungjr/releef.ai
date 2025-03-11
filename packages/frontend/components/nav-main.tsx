"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Home,
  MessageCircle,
  FolderOpen,
  ShieldHalf,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface NavItems {
  title: string;
  url: string;
  icon: any; // TODO: Fix type
  items?: {
    title: string;
    url: string;
  }[];
}
const data: NavItems[] = [
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
    url: "#",
    icon: ShieldHalf,
    items: [
      {
        title: "Frameworks",
        url: "/dashboard/compliance",
      },
      {
        title: "Assessment",
        url: "#",
      },
    ],
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: FolderOpen,
  },
];

export function NavMain() {
  const currentPathName = usePathname();

  return (
    <SidebarMenu>
      {data.map((item) => (
        <Collapsible
          key={item.title}
          defaultOpen={item.items?.some(
            (subItem) => subItem.url === currentPathName
          )}
        >
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={item.url === currentPathName}>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            {item.items?.length ? (
              <>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            ) : null}
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}
