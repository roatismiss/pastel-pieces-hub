import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  DollarSign,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import TherapistPostsManager from '@/components/therapist/TherapistPostsManager';
import TherapistEventsManager from '@/components/therapist/TherapistEventsManager';
import TherapistCalendar from '@/components/therapist/TherapistCalendar';
import TherapistEarnings from '@/components/therapist/TherapistEarnings';
import TherapistChat from '@/components/therapist/TherapistChat';

// Create supabase client without types to avoid infinite recursion
const supabase = createClient(
  "https://txovwucfngggijkmwsox.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b3Z3dWNmbmdnZ2lqa213c294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTk0MjMsImV4cCI6MjA3MTUzNTQyM30.8hU4sGCNw0rHXk8haoAHsdbbC6KGlidy56acCc57sg0"
);

interface TherapistStats {
  totalPosts: number;
  totalPostViews: number;
  totalEvents: number;
  totalFollowers: number;
  profileViews: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  totalAppointments: number;
  upcomingAppointments: number;
}

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [therapistId, setTherapistId] = useState<string | null>(null);
  const [stats, setStats] = useState<TherapistStats>({
    totalPosts: 0,
    totalPostViews: 0,
    totalEvents: 0,
    totalFollowers: 0,
    profileViews: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTherapistProfile();
    }
  }, [user]);

  const fetchTherapistProfile = async () => {
    try {
      if (!user?.id) return;
      
      // First, check if the user has a therapist profile
      const therapistResponse: any = await supabase
        .from('therapists')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (therapistResponse.error || !therapistResponse.data) {
        toast({
          title: "Acces interzis",
          description: "Nu aveți un profil de terapeut asociat acestui cont.",
          variant: "destructive",
        });
        return;
      }

      setTherapistId(therapistResponse.data.id);
      await fetchStats(therapistResponse.data.id);
    } catch (error) {
      console.error('Error fetching therapist profile:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca profilul de terapeut",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (therapistId: string) => {
    try {
      // Fetch posts count and views with explicit typing
      const postsResponse: any = await supabase
        .from('therapist_posts')
        .select('view_count')
        .eq('therapist_id', therapistId);

      // Fetch events count
      const eventsResponse: any = await supabase
        .from('therapist_events')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', therapistId);

      // Fetch followers count
      const followersResponse: any = await supabase
        .from('therapist_followers')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', therapistId);

      // Fetch profile views count
      const profileViewsResponse: any = await supabase
        .from('therapist_profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', therapistId);

      // Fetch earnings
      const earningsResponse: any = await supabase
        .from('therapist_earnings')
        .select('amount, created_at')
        .eq('therapist_id', therapistId)
        .eq('transaction_type', 'earning')
        .eq('status', 'completed');

      // Fetch appointments
      const totalAppointmentsResponse: any = await supabase
        .from('therapist_appointments')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', therapistId);

      const upcomingAppointmentsResponse: any = await supabase
        .from('therapist_appointments')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', therapistId)
        .gte('appointment_date', new Date().toISOString());

      // Calculate stats
      const posts = postsResponse.data || [];
      const earnings = earningsResponse.data || [];
      
      const totalPosts = posts.length;
      const totalPostViews = posts.reduce((sum: number, post: any) => sum + (post.view_count || 0), 0);
      const totalEarnings = earnings.reduce((sum: number, earning: any) => sum + parseFloat(earning.amount.toString()), 0);
      
      const thisMonthStart = new Date();
      thisMonthStart.setDate(1);
      thisMonthStart.setHours(0, 0, 0, 0);
      
      const thisMonthEarnings = earnings
        .filter((earning: any) => new Date(earning.created_at) >= thisMonthStart)
        .reduce((sum: number, earning: any) => sum + parseFloat(earning.amount.toString()), 0);

      setStats({
        totalPosts,
        totalPostViews,
        totalEvents: eventsResponse.count || 0,
        totalFollowers: followersResponse.count || 0,
        profileViews: profileViewsResponse.count || 0,
        totalEarnings,
        thisMonthEarnings,
        totalAppointments: totalAppointmentsResponse.count || 0,
        upcomingAppointments: upcomingAppointmentsResponse.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!therapistId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Acces interzis</h2>
          <p className="text-muted-foreground">
            Nu aveți un profil de terapeut asociat acestui cont.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Terapeut</h1>
          <p className="text-muted-foreground">
            Gestionați profilul, postările și programările dvs.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vizualizări profil</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <p className="text-xs text-muted-foreground">
                Total vizualizări profil
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urmăritori</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFollowers}</div>
              <p className="text-xs text-muted-foreground">
                Persoane care vă urmăresc
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Venituri luna aceasta</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisMonthEarnings.toFixed(2)} RON</div>
              <p className="text-xs text-muted-foreground">
                Din {stats.totalEarnings.toFixed(2)} RON total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Programări</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Viitoare din {stats.totalAppointments} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Postări publicate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPostViews} vizualizări total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evenimente</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">
                Evenimente organizate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate de angajament</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalPosts > 0 ? Math.round(stats.totalPostViews / stats.totalPosts) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Vizualizări per postare
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="posts" className="gap-2">
              <Plus className="h-4 w-4" />
              Postări
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Evenimente
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Clock className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="earnings" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Venituri
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <TherapistPostsManager therapistId={therapistId} />
          </TabsContent>

          <TabsContent value="events">
            <TherapistEventsManager therapistId={therapistId} />
          </TabsContent>

          <TabsContent value="calendar">
            <TherapistCalendar therapistId={therapistId} />
          </TabsContent>

          <TabsContent value="earnings">
            <TherapistEarnings therapistId={therapistId} />
          </TabsContent>

          <TabsContent value="chat">
            <TherapistChat therapistId={therapistId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TherapistDashboard;