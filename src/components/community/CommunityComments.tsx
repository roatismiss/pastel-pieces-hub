import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Heart, MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  like_count: number;
  author?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface CommunityCommentsProps {
  postId: string;
  commentCount: number;
}

export const CommunityComments = ({ postId, commentCount }: CommunityCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (showComments) {
      fetchComments();
      
      // Subscribe to real-time changes
      const channel = supabase
        .channel(`comments-${postId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'community_comments',
            filter: `post_id=eq.${postId}`
          },
          (payload) => {
            const newComment = payload.new as Comment;
            setComments(prev => [newComment, ...prev]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'community_comments',
            filter: `post_id=eq.${postId}`
          },
          (payload) => {
            const deletedComment = payload.old as Comment;
            setComments(prev => prev.filter(comment => comment.id !== deletedComment.id));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [showComments, postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      // First get comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Then get user profiles for the comments
      const userIds = [...new Set(commentsData?.map(c => c.user_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      // Combine comments with author data
      const commentsWithAuthors = commentsData?.map(comment => ({
        ...comment,
        author: profilesData?.find(p => p.user_id === comment.user_id)
      })) || [];

      setComments(commentsWithAuthors);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca comentariile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Autentificare necesară",
        description: "Trebuie să fii autentificat pentru a comenta",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Eroare",
        description: "Comentariul nu poate fi gol",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      toast({
        title: "Succes",
        description: "Comentariul a fost adăugat",
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga comentariul",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle Comments Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowComments(!showComments)}
        className="gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        {commentCount} comentarii
      </Button>

      {showComments && (
        <div className="space-y-4">
          {/* Add Comment Form */}
          {user && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.user_metadata?.full_name?.[0] || user.email?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Scrie un comentariu..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <Button
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                  size="sm"
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Publică
                </Button>
              </div>
            </div>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <Card key={comment.id} className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.author?.avatar_url} />
                      <AvatarFallback>
                        {comment.author?.full_name?.[0] || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium">
                          {comment.author?.full_name || 'Utilizator Anonim'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                            locale: ro
                          })}
                        </p>
                      </div>
                      <p className="text-sm mb-2">{comment.content}</p>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <button className="flex items-center gap-1 text-xs hover:text-foreground">
                          <Heart className="w-3 h-3" />
                          {comment.like_count}
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              Nu există comentarii încă. Fii primul care comentează!
            </p>
          )}
        </div>
      )}
    </div>
  );
};