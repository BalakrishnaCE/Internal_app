import React from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { useLocation } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const sectionMap = {
  dashboard: 'Dashboard',
  tasks: 'Tasks',
  prospects: 'Prospects',
};

type SectionKey = keyof typeof sectionMap;

export function Header() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  // Only show user-facing sections (skip 'bdm')
  const userSections = pathnames.filter((name): name is SectionKey => name in sectionMap);
  return (
    <header className="sticky top-0 z-30 bg-background border-b px-4 py-3 flex flex-col gap-1 w-full">
      
      <div className="text-xl font-bold capitalize flex items-center text-primary">
      <SidebarTrigger className="-ml-1 text-primary" />
      <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        {sectionMap[userSections[userSections.length - 1]] || "Dashboard"}
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/bdm/dashboard">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {userSections.map((name, idx) => (
            <React.Fragment key={idx}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {idx === userSections.length - 1 ? (
                  <BreadcrumbPage>{sectionMap[name]}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/bdm/${userSections.slice(0, idx + 1).join("/")}`}>{sectionMap[name]}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
} 