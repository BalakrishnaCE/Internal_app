import React from 'react';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { AIAssistant } from '@/components/AIAssistant';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <AppSidebar />
        {/* <SidebarTrigger className='mt-5 sticky'/> */}
        <SidebarInset>
        
          <Header />
          <main >
        {children}
        </main>
        <AIAssistant context="global" placement="floating" />
      </SidebarInset>
     
      
      
    </SidebarProvider>
  );
} 