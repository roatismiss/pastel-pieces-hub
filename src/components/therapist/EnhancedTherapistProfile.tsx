import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Heart, 
  MessageCircle, 
  Award, 
  BookOpen,
  Users,
  CheckCircle,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from 'sonner';

interface EnhancedTherapistData {
  id: string;
  user_id?: string;
  name: string;
  specialization: string;
  bio?: string;
  rating: number;
  review_count: number;
  price: number;
  languages: string[];
  availability: string;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface TherapistPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface TherapistEvent {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  price: number;
  max_participants: number;
  current_participants: number;
  view_count: number;
  created_at: string;
}

interface TherapistStats {
  total_posts: number;
  total_events: number;
  total_followers: number;
  total_views: number;
  total_appointments: number;
}

const EnhancedTherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [therapist, setTherapist] = useState<EnhancedTherapistData | null>(null);
  const [posts, setPosts] = useState<TherapistPost[]>([]);
  const [events, setEvents] = useState<TherapistEvent[]>([]);
  const [stats, setStats] = useState<TherapistStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTherapistData();
    }
  }, [id, user]);

  const fetchTherapistData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      
      // Fetch therapist basic info
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .select('*')
        .eq('id', id)
        .single();

      if (therapistError) {
        if (therapistError.code === 'PGRST116') {
          setError('Terapeutu nu a fost găsit');
        } else {
          throw therapistError;
        }
        return;
      }

      setTherapist(therapistData);

      // Record profile view
      if (therapist) {
        await supabase
          .from('therapist_profile_views')
          .insert({
            therapist_id: id,
            viewer_id: user?.id || null
          });
      }

      // Fetch therapist posts
      const { data: postsData, error: postsError } = await supabase
        .from('therapist_posts')
        .select('*')
        .eq('therapist_id', id)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch therapist events
      const { data: eventsData, error: eventsError } = await supabase
        .from('therapist_events')
        .select('*')
        .eq('therapist_id', id)
        .eq('is_active', true)
        .order('event_date', { ascending: true })
        .limit(6);

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Fetch statistics
      await fetchStats();

      // Check if following (if user is logged in)
      if (user) {
        const { data: followData } = await supabase
          .from('therapist_followers')
          .select('id')
          .eq('therapist_id', id)
          .eq('user_id', user.id)
          .maybeSingle();

        setIsFollowing(!!followData);
      }

    } catch (error) {
      console.error('Error fetching therapist data:', error);
      setError('Eroare la încărcarea datelor terapeutului');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!id) return;

    try {
      // Get posts count
      const { count: postsCount } = await supabase
        .from('therapist_posts')
        .select('id', { count: 'exact' })
        .eq('therapist_id', id)
        .eq('is_published', true);

      // Get events count
      const { count: eventsCount } = await supabase
        .from('therapist_events')
        .select('id', { count: 'exact' })
        .eq('therapist_id', id)
        .eq('is_active', true);

      // Get followers count
      const { count: followersCount } = await supabase
        .from('therapist_followers')
        .select('id', { count: 'exact' })
        .eq('therapist_id', id);

      // Get profile views count
      const { count: viewsCount } = await supabase
        .from('therapist_profile_views')
        .select('id', { count: 'exact' })
        .eq('therapist_id', id);

      // Get appointments count
      const { count: appointmentsCount } = await supabase
        .from('therapist_appointments')
        .select('id', { count: 'exact' })
        .eq('therapist_id', id);

      setStats({
        total_posts: postsCount || 0,
        total_events: eventsCount || 0,
        total_followers: followersCount || 0,
        total_views: viewsCount || 0,
        total_appointments: appointmentsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFollow = async () => {
    if (!user || !id) {
      navigate('/auth');
      return;
    }

    try {
      if (isFollowing) {
        await supabase
          .from('therapist_followers')
          .delete()
          .eq('therapist_id', id)
          .eq('user_id', user.id);
        
        setIsFollowing(false);
        toast.success('Nu mai urmărești acest terapeut');
      } else {
        await supabase
          .from('therapist_followers')
          .insert({
            therapist_id: id,
            user_id: user.id
          });
        
        setIsFollowing(true);
        toast.success('Urmărești acest terapeut');
      }

      // Refresh stats
      await fetchStats();
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      toast.error('Eroare la actualizarea stării de urmărire');
    }
  };

  const handleBookAppointment = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // For now, show placeholder
    toast.info('Funcționalitatea de programare va fi disponibilă în curând!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Terapeut negăsit</h2>
            <p className="text-muted-foreground mb-4">{error || 'Terapeutu solicitat nu există.'}</p>
            <Button onClick={() => navigate('/')}>
              Înapoi la pagina principală
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Profile Section */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={therapist.avatar_url || ''} />
                  <AvatarFallback className="text-2xl">
                    {therapist.name[0]}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{therapist.name}</h1>
                    {therapist.is_verified && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Verificat
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-xl text-primary mb-2">{therapist.specialization}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{therapist.rating.toFixed(1)}</span>
                      <span>({therapist.review_count} recenzii)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{therapist.availability}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {therapist.languages.map((lang, index) => (
                      <Badge key={index} variant="outline">{lang}</Badge>
                    ))}
                  </div>

                  <p className="text-2xl font-bold text-primary mb-4">
                    {therapist.price} RON / sesiune
                  </p>
                </div>
              </div>

              {/* Stats and Actions */}
              <div className="flex-1">
                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats?.total_posts || 0}</p>
                    <p className="text-sm text-muted-foreground">Articole</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats?.total_events || 0}</p>
                    <p className="text-sm text-muted-foreground">Evenimente</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats?.total_followers || 0}</p>
                    <p className="text-sm text-muted-foreground">Urmăritori</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats?.total_views || 0}</p>
                    <p className="text-sm text-muted-foreground">Vizualizări</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{stats?.total_appointments || 0}</p>
                    <p className="text-sm text-muted-foreground">Consultații</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleBookAppointment} className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programează Consultație
                  </Button>
                  
                  <Button 
                    variant={isFollowing ? "outline" : "secondary"}
                    onClick={handleFollow}
                    className="flex-1"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFollowing ? 'Urmărești' : 'Urmărește'}
                  </Button>

                  <Button variant="outline">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Mesaj
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">Despre</TabsTrigger>
            <TabsTrigger value="posts">Articole ({stats?.total_posts || 0})</TabsTrigger>
            <TabsTrigger value="events">Evenimente ({stats?.total_events || 0})</TabsTrigger>
            <TabsTrigger value="achievements">Realizări</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Despre {therapist.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {therapist.bio ? (
                  <p className="text-muted-foreground leading-relaxed">{therapist.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Terapeutu nu a adăugat încă o biografie.
                  </p>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Specializări
                    </h3>
                    <Badge variant="secondary" className="mb-2">
                      {therapist.specialization}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Limbi vorbite
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {therapist.languages.map((lang, index) => (
                        <Badge key={index} variant="outline">{lang}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Disponibilitate</h3>
                  <p className="text-muted-foreground">{therapist.availability}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Membru din {formatDistanceToNow(new Date(therapist.created_at), { 
                      addSuffix: true, 
                      locale: ro 
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts">
            <div className="space-y-4">
              {posts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {therapist.name} nu a publicat articole încă.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                posts.map(post => (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Badge variant="secondary">{post.category}</Badge>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(post.created_at), { 
                              addSuffix: true, 
                              locale: ro 
                            })}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center text-xs text-muted-foreground">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {post.view_count} citiri
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-4">
              {events.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {therapist.name} nu are evenimente programate.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                events.map(event => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">
                                📅 {new Date(event.event_date).toLocaleDateString('ro-RO', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {event.location && (
                                <p className="text-muted-foreground">📍 {event.location}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-primary font-semibold">💰 {event.price} RON</p>
                              <p className="text-muted-foreground">
                                👥 {event.current_participants}/{event.max_participants} participanți
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Participă
                        </Button>
                      </div>
                    </CardHeader>
                    {event.description && (
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground text-sm line-clamp-3">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.view_count} interesați
                          </span>
                          <Badge 
                            variant={event.current_participants >= event.max_participants ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {event.current_participants >= event.max_participants ? 'Complet' : 'Locuri disponibile'}
                          </Badge>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Realizări și Certificări
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  Secțiunea de realizări va fi disponibilă în curând.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Aici vor fi afișate certificările, premiile și realizările terapeutului.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedTherapistProfile;