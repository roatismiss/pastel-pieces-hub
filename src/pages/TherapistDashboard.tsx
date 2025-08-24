import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTherapist } from '@/hooks/useTherapist';
import { AppLayout } from '@/components/layout/AppLayout';
import { supabase } from '@/integrations/supabase/client';
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

const TherapistDashboard = () => {
  const { user } = useAuth();
  const { isTherapist, therapistProfile } = useTherapist();
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
    if (user && isTherapist && therapistProfile) {
      setTherapistId(therapistProfile.id);
      fetchStats(therapistProfile.id);
      setLoading(false);
    } else if (!isTherapist && user) {
      setLoading(false);
    }
  }, [user, isTherapist, therapistProfile]);

  const fetchStats = async (therapistId: string) => {
    try {
      // Fetch real data from Supabase
      const [postsResponse, eventsResponse, followersResponse, earningsResponse, appointmentsResponse] = await Promise.all([
        // Posts stats
        supabase
          .from('therapist_posts')
          .select('id, view_count')
          .eq('therapist_id', therapistId),
        
        // Events stats
        supabase
          .from('therapist_events')
          .select('id')
          .eq('therapist_id', therapistId),
        
        // Followers stats
        supabase
          .from('therapist_followers')
          .select('id')
          .eq('therapist_id', therapistId),
        
        // Earnings stats
        supabase
          .from('therapist_earnings')
          .select('amount, created_at')
          .eq('therapist_id', therapistId),
        
        // Appointments stats
        supabase
          .from('therapist_appointments')
          .select('id, appointment_date, status')
          .eq('therapist_id', therapistId)
      ]);

      const posts = postsResponse.data || [];
      const totalPostViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);
      const events = eventsResponse.data || [];
      const followers = followersResponse.data || [];
      const earnings = earningsResponse.data || [];
      const appointments = appointmentsResponse.data || [];

      // Calculate earnings this month
      const now = new Date();
      const thisMonth = earnings.filter(e => {
        const earningDate = new Date(e.created_at);
        return earningDate.getMonth() === now.getMonth() && earningDate.getFullYear() === now.getFullYear();
      });

      const thisMonthEarnings = thisMonth.reduce((sum, e) => sum + Number(e.amount), 0);
      const totalEarnings = earnings.reduce((sum, e) => sum + Number(e.amount), 0);

      // Calculate upcoming appointments
      const upcomingAppointments = appointments.filter(a => 
        new Date(a.appointment_date) > now && a.status === 'scheduled'
      ).length;

      setStats({
        totalPosts: posts.length,
        totalPostViews,
        totalEvents: events.length,
        totalFollowers: followers.length,
        profileViews: 0, // This would need to be implemented
        totalEarnings,
        thisMonthEarnings,
        totalAppointments: appointments.length,
        upcomingAppointments,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca statisticile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isTherapist) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Acces interzis</h2>
            <p className="text-muted-foreground">
              Nu aveți un profil de terapeut asociat acestui cont.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
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
    </AppLayout>
  );
};

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

export default TherapistDashboard;