import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useTherapist } from '@/hooks/useTherapist';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const { isTherapist } = useTherapist();

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
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/community', icon: MessageSquare, label: 'Comunitate' },
    ...(isTherapist ? [
      { path: '/therapist-profile', icon: User, label: 'Profil Terapeut' },
      { path: '/therapist-dashboard', icon: TrendingUp, label: 'Managementul Conținutului' }
    ] : []),
    ...(isAdmin ? [
      { path: '/admin', icon: Settings, label: 'Administrare' }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
            Healio
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ path, icon: Icon, label }) => (
            <Button
              key={path}
              variant={isActive(path) ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => navigate(path)}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </nav>

        {/* User Profile & Sign Out */}
        <div className="p-4 border-t border-border space-y-3">
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
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Deconectare
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};