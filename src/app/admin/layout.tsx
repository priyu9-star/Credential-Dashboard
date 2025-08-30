"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useMockAuth from '@/hooks/use-mock-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/icons';
import { LayoutDashboard, Users, ScrollText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, checkAuth, logout } = useMockAuth();
  const pathname = usePathname();
  
  useEffect(() => {
    checkAuth('admin');
  }, [checkAuth]);

  if (loading || !user) {
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 animate-pulse" />
          <p className="text-muted-foreground">Loading administrator portal...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/dashboard'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/admin/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/users')}
                tooltip={{ children: 'Users' }}
              >
                <Link href="/admin/dashboard"> 
                  <Users />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/activity-log'}
                tooltip={{ children: 'Activity Log' }}
              >
                <Link href="/admin/activity-log">
                  <ScrollText />
                  <span>Activity Log</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-2">
           <div className="flex items-center gap-3 p-2">
             <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={logout}>
                <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-xl">Admin Portal</h1>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
