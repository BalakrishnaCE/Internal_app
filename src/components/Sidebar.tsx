import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, ClipboardList, Users, UserCircle, BarChart2 } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Novel.png';

const navItems = [
  { title: "Dashboard", url: "/bdm/dashboard", icon: Home },
  { title: "Tasks", url: "/bdm/tasks", icon: ClipboardList },
  { title: "Prospects", url: "/bdm/prospects", icon: Users },
  { title: "Reports", url: "/bdm/reports", icon: BarChart2 },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { state } = useSidebar(); // 'expanded' or 'collapsed'
  const isCollapsed = state === 'collapsed';
  return (
    <Sidebar
      collapsible="icon"
      // className={`bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-sm min-h-screen sticky transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-64'} group/sidebar`}
      // data-state={state}
      {...props}
    >
      <SidebarHeader>
        <div className="flex items-center gap-2  min-w-0 overflow-visible">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded bg-black" />
          {!isCollapsed && (
            <span className="font-bold text-lg ml-2">Novel Office</span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className={`flex items-center gap-3 px-2 py-2 rounded transition-colors ${location.pathname.startsWith(item.url) ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted/60'}`}>
                      <item.icon className="w-5 h-5" />
                      <span className=" lg:inline">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2  py-3 border-t border-sidebar-border">
          <UserCircle className="w-6 h-6" />
          <span className="font-medium hidden lg:inline group-data-[collapsible=icon]:hidden">BDM User</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}