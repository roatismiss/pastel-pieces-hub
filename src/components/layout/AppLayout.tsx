import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Users, 
  MessageSquare, 
  Calendar, 
  User, 
  LogOut,
  Settings,
  Heart,
  TrendingUp,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useTherapist } from '@/hooks/useTherapist';

interface AppLayoutProps {
  children: ReactNode;
}

function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { isTherapist } = useTherapist();
  const { state } = useSidebar();
  
  const isCollapsed = state === "collapsed";

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', group: 'main' },
    { path: '/therapist-feed', icon: BookOpen, label: 'Articole', group: 'main' },
    { path: '/community', icon: MessageSquare, label: 'Comunitate', group: 'main' },
    ...(isTherapist ? [
      { path: '/therapist-profile', icon: User, label: 'Profil Terapeut', group: 'therapist' },
      { path: '/therapist-dashboard', icon: TrendingUp, label: 'Management', group: 'therapist' }
    ] : []),
    ...(isAdmin ? [
      { path: '/admin', icon: Settings, label: 'Administrare', group: 'admin' }
    ] : [])
  ];

  const groupedItems = {
    main: menuItems.filter(item => item.group === 'main'),
    therapist: menuItems.filter(item => item.group === 'therapist'),
    admin: menuItems.filter(item => item.group === 'admin')
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {!isCollapsed && <span>Înapoi la site</span>}
            </Button>
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary mt-2 cursor-pointer" onClick={() => navigate('/')}>
              Healio
            </h1>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigare</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedItems.main.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className="w-full justify-start gap-3"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && item.label}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Therapist Section */}
        {isTherapist && groupedItems.therapist.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Terapeut</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedItems.therapist.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && item.label}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Section */}
        {isAdmin && groupedItems.admin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedItems.admin.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <Button
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className="w-full justify-start gap-3"
                        onClick={() => navigate(item.path)}
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && item.label}
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Profile & Sign Out */}
        <div className="mt-auto p-4 border-t border-border space-y-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {getInitials(user?.user_metadata?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAdmin ? 'Administrator' : isTherapist ? 'Terapeut' : 'Client'}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && 'Deconectare'}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Global header with trigger */}
        <div className="fixed top-0 left-0 z-50 h-12 flex items-center border-b bg-background">
          <SidebarTrigger className="ml-2" />
        </div>

        <AppSidebar />
        
        <main className="flex-1 pt-12">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};