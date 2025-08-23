import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MessageCircle, 
  User, 
  Settings, 
  Heart,
  Clock,
  CheckCircle,
  BookOpen,
  TrendingUp,
  LogOut,
  Bell,
  Home,
  FileText,
  GraduationCap,
  Plus,
  HeadphonesIcon
} from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Prezentare generală', icon: Home },
    { id: 'appointments', label: 'Rezervările mele', icon: Calendar },
    { id: 'messages', label: 'Mesaje', icon: MessageCircle },
    { id: 'resources', label: 'Articole și teste', icon: FileText },
    { id: 'lessons', label: 'Lecții interactive', icon: GraduationCap },
    { id: 'premium', label: 'Healio+', icon: Plus, badge: 'până la -10%' },
    { id: 'support', label: 'Suport clienți', icon: HeadphonesIcon },
    { id: 'profile', label: 'Contul meu', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-border flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">healio</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 pb-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg mb-1 transition-colors ${
                activeSection === item.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut}
            className="w-full justify-start text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Ieși din cont
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-background border-b border-border px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Bună, {profile?.full_name?.split(' ')[0] || 'acolo'}!
              </h1>
              <p className="text-muted-foreground">
                Bine ai revenit pe platforma ta de sănătate mentală
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              {/* No Appointments Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-12 w-12 opacity-80" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">
                        În acest moment nu mai ai alte programări planificate.
                      </h3>
                      <Button 
                        size="sm" 
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        REZERVĂ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <MessageCircle className="h-8 w-8 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        Cum te putem contacta?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ai toate informațiile de contact completate? În caz de nevoie, colegii 
                        noștri de la Relații clienți te vor putea ajuta mai rapid.
                      </p>
                      <Button 
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        COMPLETEAZĂ PROFILUL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Settings className="h-8 w-8 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-2">
                          Cum să îți pregătești dispozitivul și mediul?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Nu trebuie să instalezi nimic, te poți conecta din browser, 
                          sau chiar și de pe telefon.
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Majoritatea ședințelor nu întâmpină probleme tehnice. Dacă ședința 
                          nu poate fi realizată din cauza problemelor tehnice, ședința va fi 
                          achitată de noi.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Calendar className="h-8 w-8 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-2">
                          Dorești să rezervi mai multe programări?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Planifică mai multe programări în avans, pentru a te asigura că 
                          găsești ore disponibile în calendarul terapeutului tău care să fie 
                          compatibile și cu programul tău.
                        </p>
                        <Button 
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          REZERVĂ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeSection === 'appointments' && (
            <Card>
              <CardHeader>
                <CardTitle>Programările mele</CardTitle>
                <CardDescription>Gestionează sesiunile tale de terapie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Sistemul de programări vine curând</p>
                  <p className="text-muted-foreground">Construim un sistem complet de programare</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'messages' && (
            <Card>
              <CardHeader>
                <CardTitle>Mesaje</CardTitle>
                <CardDescription>Comunică cu echipa ta de terapeuți</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Sistemul de mesagerie vine curând</p>
                  <p className="text-muted-foreground">Vei putea comunica direct cu terapeuții</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'resources' && (
            <Card>
              <CardHeader>
                <CardTitle>Articole și teste</CardTitle>
                <CardDescription>Resurse pentru sănătatea ta mentală</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Resurse educaționale vin curând</p>
                  <p className="text-muted-foreground">Articole și teste pentru dezvoltarea personală</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'lessons' && (
            <Card>
              <CardHeader>
                <CardTitle>Lecții interactive</CardTitle>
                <CardDescription>Învață tehnici de gestionare a stresului</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Lecții interactive vin curând</p>
                  <p className="text-muted-foreground">Exerciții ghidate și tehnici de mindfulness</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'premium' && (
            <Card>
              <CardHeader>
                <CardTitle>Healio+ Premium</CardTitle>
                <CardDescription>Acces extins la serviciile noastre</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Servicii premium vin curând</p>
                  <p className="text-muted-foreground">Acces prioritar și funcții avansate</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'support' && (
            <Card>
              <CardHeader>
                <CardTitle>Suport clienți</CardTitle>
                <CardDescription>Contactează echipa noastră pentru ajutor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <HeadphonesIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Suport clienți vine curând</p>
                  <p className="text-muted-foreground">Chat direct cu echipa de suport</p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Contul meu</CardTitle>
                <CardDescription>Gestionează profilul și preferințele</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-lg">{getInitials(profile?.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{profile?.full_name || 'Nume nesetat'}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <Badge variant="secondary">
                      Membru din {new Date(profile?.created_at || '').toLocaleDateString('ro-RO')}
                    </Badge>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <Button 
                    variant="outline"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground border-accent"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Editează profilul
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}