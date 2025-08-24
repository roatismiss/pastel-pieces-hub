import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, MessageCircle, Heart, MoreVertical, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { CommunityComments } from './CommunityComments';

interface CommunityPost {
  id: string;
  user_id: string;
  type: 'post' | 'question' | 'mood';
  title?: string;
  content: string;
  mood?: string;
  tags: string[];
  is_anonymous: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  profiles?: {
    full_name?: string;
  };
}

const moodEmojis = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  excited: '🎉',
  stressed: '😓',
  calm: '😌',
  angry: '😠',
  grateful: '🙏'
};

const CommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'post' | 'question' | 'mood'>('all');

  useEffect(() => {
    fetchPosts();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('community-posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles!community_posts_user_id_fkey (
            full_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (filter !== 'all') {
        query = query.eq('type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data as CommunityPost[] || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    // Optimistic update
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, like_count: post.like_count + 1 }
        : post
    ));

    // Here you would implement the actual like functionality
    // For now, we'll just show the optimistic update
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'question':
        return { label: 'Întrebare', variant: 'secondary' as const };
      case 'mood':
        return { label: 'Emoție', variant: 'outline' as const };
      default:
        return { label: 'Postare', variant: 'default' as const };
    }
  };

  const getDisplayName = (post: CommunityPost) => {
    if (post.is_anonymous) return 'Utilizator Anonim';
    return post.profiles?.full_name || 'Utilizator';
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
          variant={filter === 'post' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('post')}
        >
          📝 Postări
        </Button>
        <Button
          variant={filter === 'question' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('question')}
        >
          ❓ Întrebări
        </Button>
        <Button
          variant={filter === 'mood' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('mood')}
        >
          💭 Emoții
        </Button>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <p>Nu există postări încă.</p>
                <p className="text-sm mt-2">Fiți primul care împarte ceva cu comunitatea!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map(post => {
            const typeInfo = getPostTypeLabel(post.type);
            return (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {post.is_anonymous ? '?' : getDisplayName(post)[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{getDisplayName(post)}</p>
                          <Badge variant={typeInfo.variant} className="text-xs">
                            {typeInfo.label}
                          </Badge>
                          {post.type === 'mood' && post.mood && (
                            <Badge variant="outline" className="text-xs">
                              {moodEmojis[post.mood as keyof typeof moodEmojis]} 
                              {post.mood === 'happy' ? 'Fericit' : 
                               post.mood === 'sad' ? 'Trist' :
                               post.mood === 'anxious' ? 'Anxios' :
                               post.mood === 'excited' ? 'Entuziasmat' :
                               post.mood === 'stressed' ? 'Stresat' :
                               post.mood === 'calm' ? 'Calm' :
                               post.mood === 'angry' ? 'Supărat' :
                               'Recunoscător'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.created_at), { 
                            addSuffix: true, 
                            locale: ro 
                          })}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {post.title && (
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  )}
                  <p className="text-foreground whitespace-pre-wrap mb-4">{post.content}</p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      {post.like_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto text-muted-foreground">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Comments Section */}
                  <div className="mt-4">
                    <CommunityComments 
                      postId={post.id} 
                      commentCount={post.comment_count} 
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;