import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { 
  Star, 
  MapPin, 
  Languages, 
  Calendar, 
  Heart,
  Eye,
  Clock,
  Users,
  Award,
  BookOpen
} from 'lucide-react';

interface Therapist {
  id: string;
  name: string;
  avatar_url?: string;
  specialization: string;
  bio?: string;
  rating: number;
  review_count: number;
  price: number;
  languages: string[];
  is_verified: boolean;
}

interface TherapistPost {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  tags: string[];
  featured_image?: string;
  view_count: number;
  created_at: string;
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
}

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [posts, setPosts] = useState<TherapistPost[]>([]);
  const [events, setEvents] = useState<TherapistEvent[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTherapistData();
    }
  }, [id]);

  const fetchTherapistData = async () => {
    try {
      // Fetch therapist details
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .select('*')
        .eq('id', id)
        .single();

      if (therapistError) throw therapistError;
      setTherapist(therapistData);

      // Record profile view
      if (therapistData) {
        await supabase
          .from('therapist_profile_views')
          .insert({
            therapist_id: therapistData.id,
            viewer_id: user?.id || null
          });
      }

      // Fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('therapist_posts')
        .select('*')
        .eq('therapist_id', id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('therapist_events')
        .select('*')
        .eq('therapist_id', id)
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Check if following
      if (user) {
        const { data: followData } = await supabase
          .from('therapist_followers')
          .select('id')
          .eq('therapist_id', id)
          .eq('user_id', user.id)
          .single();

        setIsFollowing(!!followData);
      }

      // Get follower count
      const { count } = await supabase
        .from('therapist_followers')
        .select('*', { count: 'exact', head: true })
        .eq('therapist_id', id);

      setFollowerCount(count || 0);

    } catch (error) {
      console.error('Error fetching therapist data:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca profilul terapeutului",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fiți autentificat pentru a urmări un terapeut",
        variant: "destructive",
      });
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
        setFollowerCount(prev => prev - 1);
        toast({
          title: "Success",
          description: "Nu mai urmăriți acest terapeut",
        });
      } else {
        await supabase
          .from('therapist_followers')
          .insert({
            therapist_id: id!,
            user_id: user.id
          });
        
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        toast({
          title: "Success",
          description: "Acum urmăriți acest terapeut",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut procesa cererea",
        variant: "destructive",
      });
    }
  };

  const handleBookAppointment = () => {
    toast({
      title: "Programare",
      description: "Funcționalitatea de programare va fi disponibilă în curând",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Terapeutul nu a fost găsit</h2>
          <p className="text-muted-foreground">Acest profil nu există sau nu este disponibil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-32 w-32">
                <AvatarImage src={therapist.avatar_url} alt={therapist.name} />
                <AvatarFallback className="text-2xl">
                  {therapist.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold">{therapist.name}</h1>
                    {therapist.is_verified && (
                      <Badge variant="secondary" className="gap-1">
                        <Award className="h-3 w-3" />
                        Verificat
                      </Badge>
                    )}
                  </div>
                  <p className="text-xl text-muted-foreground">{therapist.specialization}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{therapist.rating}</span>
                    <span>({therapist.review_count} recenzii)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Languages className="h-4 w-4" />
                    <span>{therapist.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{followerCount} urmăritori</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button size="lg" onClick={handleBookAppointment}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Programează consultație
                  </Button>
                  <Button 
                    variant={isFollowing ? "secondary" : "outline"} 
                    size="lg"
                    onClick={handleFollow}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isFollowing ? 'fill-current' : ''}`} />
                    {isFollowing ? 'Urmărești' : 'Urmărește'}
                  </Button>
                </div>

                <div className="text-lg font-semibold">
                  Preț consultație: <span className="text-primary">{therapist.price} RON</span>
                </div>
              </div>
            </div>

            {therapist.bio && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-3">Despre</h3>
                <p className="text-muted-foreground leading-relaxed">{therapist.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Postări ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" />
              Evenimente ({events.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2">
              <Award className="h-4 w-4" />
              Informații
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="grid gap-6">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{post.category}</Badge>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.view_count}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(post.created_at).toLocaleDateString('ro-RO')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {post.excerpt || post.content.substring(0, 200)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {posts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Acest terapeut nu a publicat încă postări.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.event_date).toLocaleDateString('ro-RO')}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.current_participants}/{event.max_participants}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-lg font-semibold">
                        {event.price} RON
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{event.description}</p>
                    <Button>Înscrie-te la eveniment</Button>
                  </CardContent>
                </Card>
              ))}
              
              {events.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Acest terapeut nu are evenimente programate.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Informații despre terapeut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Specializare</h4>
                  <p className="text-muted-foreground">{therapist.specialization}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Limbi vorbite</h4>
                  <div className="flex flex-wrap gap-2">
                    {therapist.languages.map((language) => (
                      <Badge key={language} variant="outline">{language}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Rating și recenzii</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(therapist.rating) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{therapist.rating} din 5</span>
                    <span className="text-muted-foreground">({therapist.review_count} recenzii)</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tarif consultație</h4>
                  <p className="text-2xl font-bold text-primary">{therapist.price} RON</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TherapistProfile;