import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Heart, MessageCircle, BookOpen, Calendar, User, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { usePostViews } from '@/hooks/usePostViews';

interface TherapistPost {
  id: string;
  therapist_id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featured_image?: string;
  view_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
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
  therapist_id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  price: number;
  max_participants: number;
  current_participants: number;
  is_active: boolean;
  view_count: number;
  created_at: string;
  therapists?: {
    id: string;
    name: string;
    specialization: string;
    avatar_url?: string;
    is_verified: boolean;
  };
}

type FeedItem = (TherapistPost & { type: 'post' }) | (TherapistEvent & { type: 'event' });

const TherapistFeed = () => {
  const navigate = useNavigate();
  const { trackPostView } = usePostViews();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'posts' | 'events'>('all');

  useEffect(() => {
    fetchFeedItems();
    
    // Set up real-time subscriptions
    const postsChannel = supabase
      .channel('therapist-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'therapist_posts'
        },
        () => fetchFeedItems()
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('therapist-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'therapist_events'
        },
        () => fetchFeedItems()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [filter]);

  const fetchFeedItems = async () => {
    try {
      const items: FeedItem[] = [];

      // Fetch therapist posts only if filter allows
      if (filter === 'all' || filter === 'posts') {
        const { data: posts, error: postsError } = await supabase
          .from('therapist_posts')
          .select(`
            *,
            therapists!therapist_posts_therapist_id_fkey (
              id,
              name,
              specialization,
              avatar_url,
              is_verified
            )
          `)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (postsError) throw postsError;
        
        if (posts) {
          items.push(...posts.map(post => ({ ...post, type: 'post' as const })));
        }
      }

      // Fetch therapist events only if filter allows
      if (filter === 'all' || filter === 'events') {
        const { data: events, error: eventsError } = await supabase
          .from('therapist_events')
          .select(`
            *,
            therapists!therapist_events_therapist_id_fkey (
              id,
              name,
              specialization,
              avatar_url,
              is_verified
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (eventsError) throw eventsError;
        
        if (events) {
          items.push(...events.map(event => ({ ...event, type: 'event' as const })));
        }
      }

      // Sort all items by creation date
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setFeedItems(items);
    } catch (error) {
      console.error('Error fetching feed items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = async (item: FeedItem) => {
    // Track view before navigation
    await trackPostView(item.id, item.type);
    
    if (item.therapists) {
      navigate(`/therapist/${item.therapists.id}`);
    }
  };

  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      'mental-health': { label: 'Sănătate Mentală', variant: 'default' },
      'relationships': { label: 'Relații', variant: 'secondary' },
      'anxiety': { label: 'Anxietate', variant: 'outline' },
      'depression': { label: 'Depresie', variant: 'outline' },
      'general': { label: 'General', variant: 'secondary' },
    };
    
    return categories[category] || { label: category, variant: 'secondary' as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          Toate
        </Button>
        <Button
          variant={filter === 'posts' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('posts')}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Articole
        </Button>
        <Button
          variant={filter === 'events' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('events')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Evenimente
        </Button>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <p>Nu există conținut de la terapeuți încă.</p>
                <p className="text-sm mt-2">Reveniți mai târziu pentru articole și evenimente!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          feedItems.map(item => (
            <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={item.therapists?.avatar_url} />
                      <AvatarFallback>
                        {item.therapists?.name[0] || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{item.therapists?.name}</h4>
                        {item.therapists?.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verificat
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {item.type === 'post' ? 'Articol' : 'Eveniment'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.therapists?.specialization}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.created_at), { 
                          addSuffix: true, 
                          locale: ro 
                        })}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleItemClick(item)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0" onClick={() => handleItemClick(item)}>
                {item.type === 'post' ? (
                  <>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    {item.excerpt && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {'category' in item && (
                          <Badge variant={getCategoryBadge(item.category).variant} className="text-xs">
                            {getCategoryBadge(item.category).label}
                          </Badge>
                        )}
                        {item.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {item.view_count}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">📅 Data:</span>
                        <p className="text-muted-foreground">
                          {new Date(item.event_date).toLocaleDateString('ro-RO')}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium">💰 Preț:</span>
                        <p className="text-muted-foreground">{item.price} RON</p>
                      </div>
                      {item.location && (
                        <div className="col-span-2">
                          <span className="font-medium">📍 Locație:</span>
                          <p className="text-muted-foreground">{item.location}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {item.current_participants}/{item.max_participants} participanți
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.view_count} vizualizări
                      </span>
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

export default TherapistFeed;