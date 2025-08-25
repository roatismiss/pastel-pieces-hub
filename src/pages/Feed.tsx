import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Users, Eye, Heart, MessageSquare, Star, Verified, BookOpen, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TherapistPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featured_image?: string;
  view_count: number;
  created_at: string;
  therapist_id: string;
  therapists?: {
    id: string;
    name: string;
    specialization: string;
    avatar_url?: string;
    is_verified: boolean;
  };
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
  therapist_id: string;
  therapists?: {
    id: string;
    name: string;
    specialization: string;
    avatar_url?: string;
    is_verified: boolean;
  };
}

interface Therapist {
  id: string;
  name: string;
  specialization: string;
  bio?: string;
  rating: number;
  price: number;
  languages: string[];
  availability: string;
  is_verified: boolean;
  avatar_url?: string;
  created_at: string;
}

type FeedItem = 
  | (TherapistPost & { type: 'post' })
  | (TherapistEvent & { type: 'event' })
  | (Therapist & { type: 'therapist' });

const Feed = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'posts' | 'events' | 'therapists'>('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeedItems();
  }, [filter]);

  const fetchFeedItems = async () => {
    setLoading(true);
    try {
      const items: FeedItem[] = [];

      // Fetch posts if needed
      if (filter === 'all' || filter === 'posts') {
        const { data: posts } = await supabase
          .from('therapist_posts')
          .select(`
            *,
            therapists!inner (
              id,
              name,
              specialization,
              avatar_url,
              is_verified
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (posts) {
          items.push(...posts.map(post => ({ ...post, type: 'post' as const })));
        }
      }

      // Fetch events if needed
      if (filter === 'all' || filter === 'events') {
        const { data: events } = await supabase
          .from('therapist_events')
          .select(`
            *,
            therapists!inner (
              id,
              name,
              specialization,
              avatar_url,
              is_verified
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (events) {
          items.push(...events.map(event => ({ ...event, type: 'event' as const })));
        }
      }

      // Fetch therapists if needed
      if (filter === 'all' || filter === 'therapists') {
        const { data: therapists } = await supabase
          .from('therapists')
          .select('*')
          .order('created_at', { ascending: false });

        if (therapists) {
          items.push(...therapists.map(therapist => ({ ...therapist, type: 'therapist' as const })));
        }
      }

      // Sort all items by creation date
      items.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setFeedItems(items);
    } catch (error) {
      console.error('Error fetching feed items:', error);
      toast.error('A apărut o eroare la încărcarea conținutului');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item: FeedItem) => {
    if (item.type === 'therapist') {
      navigate(`/therapist/${item.id}`);
    } else if (item.type === 'post' || item.type === 'event') {
      // Make sure we have a valid therapist_id before navigating
      if (item.therapist_id) {
        navigate(`/therapist/${item.therapist_id}`);
      } else {
        toast.error('Nu s-a putut accesa profilul terapeutului');
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      general: { label: 'General', variant: 'default' },
      anxiety: { label: 'Anxietate', variant: 'secondary' },
      depression: { label: 'Depresie', variant: 'destructive' },
      relationships: { label: 'Relații', variant: 'outline' },
      stress: { label: 'Stres', variant: 'secondary' },
      trauma: { label: 'Traumă', variant: 'destructive' },
    };
    
    return categoryMap[category] || { label: category, variant: 'default' as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Încărcăre...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Feed Complet</h1>
        <p className="text-muted-foreground mb-6">
          Descoperă terapeuți, articole și evenimente într-un singur loc
        </p>

        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toate</TabsTrigger>
            <TabsTrigger value="therapists">Terapeuți</TabsTrigger>
            <TabsTrigger value="posts">Articole</TabsTrigger>
            <TabsTrigger value="events">Evenimente</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        {feedItems.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Nu există conținut disponibil momentan.</p>
          </Card>
        ) : (
          feedItems.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleItemClick(item)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.type === 'therapist' ? (
                      <>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.avatar_url} />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{item.name}</CardTitle>
                            {item.is_verified && <Verified className="h-4 w-4 text-primary" />}
                            <Badge variant="outline">Terapeut</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.specialization}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.therapists?.avatar_url} />
                          <AvatarFallback>{item.therapists?.name.charAt(0) || 'T'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{item.therapists?.name}</CardTitle>
                            {item.therapists?.is_verified && <Verified className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.therapists?.specialization}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {item.type === 'therapist' ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{item.rating || 0}/5</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-lg font-semibold">{item.price} lei</span>
                            <span className="text-sm text-muted-foreground">/sesiune</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{item.availability}</Badge>
                      </div>
                      
                      {item.bio && (
                        <p className="text-muted-foreground line-clamp-2">{item.bio}</p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Limbi:</span>
                        {item.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                ) : item.type === 'post' ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <Badge {...getCategoryBadge(item.category)} />
                        <Badge variant="outline">Articol</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      
                      {item.excerpt && (
                        <p className="text-muted-foreground line-clamp-3">{item.excerpt}</p>
                      )}
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{item.view_count || 0} vizualizări</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <Badge variant="outline">Eveniment</Badge>
                      </div>
                      
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      
                      {item.description && (
                        <p className="text-muted-foreground line-clamp-3">{item.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(item.event_date)}</span>
                        </div>
                        
                        {item.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{item.current_participants}/{item.max_participants} participanți</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{item.price} lei</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{item.view_count || 0} vizualizări</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;