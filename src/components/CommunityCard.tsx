import { Heart, MessageCircle, Share2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommunityPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  reactions: {
    hug: number;
    growth: number;
    strength: number;
    insight: number;
  };
  isAnonymous?: boolean;
  mood?: string;
  type: 'text' | 'mood' | 'quote' | 'checkin';
}

interface CommunityCardProps {
  post: CommunityPost;
  size?: '1x1' | '2x1' | '1x2' | '2x2';
}

export const CommunityCard = ({ post, size = '1x1' }: CommunityCardProps) => {
  const isLarge = size === '2x2' || size === '2x1';
  const isSmall = size === '1x1';
  
  const reactionEmojis = {
    hug: '🤗',
    growth: '🌱', 
    strength: '💪',
    insight: '💡'
  };

  const getMoodEmoji = (mood?: string) => {
    const moods: { [key: string]: string } = {
      'sad': '😔',
      'anxious': '😰', 
      'hopeful': '🌟',
      'grateful': '🙏',
      'peaceful': '😌'
    };
    return moods[mood || 'neutral'] || '😊';
  };

  return (
    <div className="p-3 md:p-4 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <div className="w-6 md:w-8 h-6 md:h-8 bg-healio-mint rounded-full flex items-center justify-center">
            {post.isAnonymous ? (
              <User className="w-3 md:w-4 h-3 md:h-4 text-healio-mint-foreground" />
            ) : (
              <span className="text-xs md:text-sm font-medium">
                {post.author.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs md:text-sm font-medium">
              {post.isAnonymous ? 'Anonim' : post.author}
            </p>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>

        {post.type === 'mood' && post.mood && (
          <div className="text-center mb-2 md:mb-3">
            <div className="text-3xl md:text-4xl mb-2">{getMoodEmoji(post.mood)}</div>
            <p className="text-xs md:text-sm text-muted-foreground">
              Azi mă simt {post.mood}
            </p>
          </div>
        )}

        {post.type === 'quote' && (
          <div className="border-l-4 border-healio-orange pl-2 md:pl-3 mb-2 md:mb-3">
            <p className={`${isLarge ? 'text-sm md:text-base' : 'text-xs md:text-sm'} italic`}>
              "{post.content}"
            </p>
          </div>
        )}

        {(post.type === 'text' || post.type === 'checkin') && (
          <p className={`${isLarge ? 'text-sm md:text-base' : 'text-xs md:text-sm'} mb-2 md:mb-3 ${!isLarge ? 'line-clamp-3' : ''}`}>
            {post.content}
          </p>
        )}
      </div>

      {!isSmall && (
        <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-border">
          <div className="flex items-center gap-2 md:gap-3">
            {Object.entries(post.reactions).map(([key, count]) => (
              count > 0 && (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs md:text-sm"
                >
                  <span className="mr-1">{reactionEmojis[key as keyof typeof reactionEmojis]}</span>
                  {count}
                </Button>
              )
            ))}
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <MessageCircle className="w-3 md:w-4 h-3 md:h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-auto p-1">
              <Share2 className="w-3 md:w-4 h-3 md:h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};