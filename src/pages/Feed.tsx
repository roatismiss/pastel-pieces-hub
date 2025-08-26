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

interface CommunityPost {
  id: string;
  title?: string;
  content: string;
  post_type: string; // Renamed from 'type' to avoid conflicts
  mood?: string;
  tags: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  user_id: string;
  is_anonymous: boolean;
  profiles?: {
    full_name: string;
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
  | (TherapistPost & { type: 'post'; source: 'therapist' })
  | (CommunityPost & { type: 'post'; source: 'community' })
  | (TherapistEvent & { type: 'event'; source: 'therapist' })
  | (Therapist & { type: 'therapist'; source: 'therapist' });

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

      // Fetch posts if needed (both therapist posts and community posts)
      if (filter === 'all' || filter === 'posts') {
        // Fetch therapist posts
        const { data: therapistPosts } = await supabase
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

        // Fetch community posts
        const { data: communityPosts } = await supabase
          .from('community_posts')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Get user profiles for community posts
        const userIds = [...new Set((communityPosts || []).map(post => post.user_id))];
        let profilesMap = new Map();
        
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id, full_name')
            .in('user_id', userIds);
          
          profilesData?.forEach(profile => {
            profilesMap.set(profile.user_id, profile);
          });
        }

        if (therapistPosts) {
          items.push(...therapistPosts.map(post => ({ ...post, type: 'post' as const, source: 'therapist' as const })));
        }

        if (communityPosts) {
          items.push(...communityPosts.map(post => ({ 
            ...post, 
            post_type: post.type, // Preserve original community post type
            type: 'post' as const, 
            source: 'community' as const,
            profiles: profilesMap.get(post.user_id) || { full_name: 'Utilizator anonim' }
          })));
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
          items.push(...events.map(event => ({ ...event, type: 'event' as const, source: 'therapist' as const })));
        }
      }

      // Fetch therapists if needed
      if (filter === 'all' || filter === 'therapists') {
        const { data: therapists } = await supabase
          .from('therapists')
          .select('*')
          .order('created_at', { ascending: false });

        if (therapists) {
          items.push(...therapists.map(therapist => ({ ...therapist, type: 'therapist' as const, source: 'therapist' as const })));
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
    } else if (item.type === 'post') {
      if (item.source === 'therapist' && 'therapist_id' in item) {
        navigate(`/therapist/${item.therapist_id}`);
      } else if (item.source === 'community') {
        // For community posts, we could navigate to the community page or show post details
        navigate('/community');
      }
    } else if (item.type === 'event') {
      if ('therapist_id' in item && item.therapist_id) {
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
                           {item.source === 'therapist' && 'therapists' in item ? (
                             <>
                               <AvatarImage src={item.therapists?.avatar_url} />
                               <AvatarFallback>{item.therapists?.name.charAt(0) || 'T'}</AvatarFallback>
                             </>
                           ) : (
                             <AvatarFallback>
                               {item.source === 'community' && 'profiles' in item 
                                 ? item.profiles?.full_name?.charAt(0) || 'U'
                                 : 'U'
                               }
                             </AvatarFallback>
                           )}
                         </Avatar>
                         <div>
                           <div className="flex items-center space-x-2">
                             <CardTitle className="text-lg">
                               {item.source === 'therapist' && 'therapists' in item 
                                 ? item.therapists?.name 
                                 : item.source === 'community' && 'profiles' in item
                                   ? (item.is_anonymous ? 'Utilizator anonim' : item.profiles?.full_name || 'Utilizator')
                                   : 'Utilizator'
                               }
                             </CardTitle>
                             {item.source === 'therapist' && 'therapists' in item && item.therapists?.is_verified && (
                               <Verified className="h-4 w-4 text-primary" />
                             )}
                             <Badge variant="outline">
                               {item.source === 'therapist' ? 'Terapeut' : 'Comunitate'}
                             </Badge>
                           </div>
                             <p className="text-sm text-muted-foreground">
                               {item.source === 'therapist' && 'therapists' in item 
                                 ? item.therapists?.specialization 
                                 : item.source === 'community' && 'post_type' in item
                                   ? (item.post_type === 'question' ? 'Întrebare' : item.post_type === 'mood' ? 'Stare de spirit' : 'Postare')
                                   : ''
                               }
                             </p>
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
                         {item.source === 'therapist' && 'category' in item && (
                           <Badge {...getCategoryBadge(item.category)} />
                         )}
                           {item.source === 'community' && 'post_type' in item && (
                             <Badge variant="secondary">
                               {item.post_type === 'question' ? 'Întrebare' : 
                                item.post_type === 'mood' ? 'Stare de spirit' : 'Postare'}
                             </Badge>
                           )}
                         <Badge variant="outline">
                           {item.source === 'therapist' ? 'Articol Terapeut' : 'Post Comunitate'}
                         </Badge>
                       </div>
                       
                       <h3 className="text-xl font-semibold">
                         {'title' in item && item.title ? item.title : 'Post din comunitate'}
                       </h3>
                       
                       {item.source === 'community' && 'mood' in item && item.mood && (
                         <div className="flex items-center space-x-2">
                           <span className="text-sm text-muted-foreground">Stare de spirit:</span>
                           <Badge variant="outline">{item.mood === 'happy' ? '😊 Fericit' : 
                            item.mood === 'sad' ? '😢 Trist' :
                            item.mood === 'anxious' ? '😰 Anxios' :
                            item.mood === 'excited' ? '🎉 Entuziasmat' :
                            item.mood === 'stressed' ? '😓 Stresat' :
                            item.mood === 'calm' ? '😌 Calm' :
                            item.mood === 'angry' ? '😠 Supărat' :
                            item.mood === 'grateful' ? '🙏 Recunoscător' : item.mood}</Badge>
                         </div>
                       )}
                       
                       {(('excerpt' in item && item.excerpt) || item.content) && (
                         <p className="text-muted-foreground line-clamp-3">
                           {'excerpt' in item && item.excerpt ? item.excerpt : item.content}
                         </p>
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
                         {item.source === 'therapist' && 'view_count' in item && (
                           <div className="flex items-center space-x-1">
                             <Eye className="h-4 w-4" />
                             <span>{item.view_count || 0} vizualizări</span>
                           </div>
                         )}
                         {item.source === 'community' && 'like_count' in item && (
                           <div className="flex items-center space-x-1">
                             <Heart className="h-4 w-4" />
                             <span>{item.like_count || 0} aprecieri</span>
                           </div>
                         )}
                         {item.source === 'community' && 'comment_count' in item && (
                           <div className="flex items-center space-x-1">
                             <MessageSquare className="h-4 w-4" />
                             <span>{item.comment_count || 0} comentarii</span>
                           </div>
                         )}
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