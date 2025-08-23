import { Star, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Therapist {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  price: string;
  languages: string[];
  availability: string;
  bio?: string;
}

interface TherapistCardProps {
  therapist: Therapist;
  size?: '1x1' | '2x1' | '1x2';
  onClick?: () => void;
}

export const TherapistCard = ({ therapist, size = '1x1', onClick }: TherapistCardProps) => {
  const isLarge = size === '2x1' || size === '1x2';
  
  return (
    <div className="p-3 md:p-4 h-full flex flex-col justify-between">
      <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
        <img 
          src={therapist.avatar} 
          alt={therapist.name}
          className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-playfair font-semibold text-base md:text-lg leading-tight mb-1">
            {therapist.name}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">
            {therapist.specialization}
          </p>
          <div className="flex items-center gap-1 mb-1 md:mb-2">
            <Star className="w-3 md:w-4 h-3 md:h-4 fill-healio-orange text-healio-orange" />
            <span className="text-xs md:text-sm font-medium">{therapist.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({therapist.reviewCount} recenzii)
            </span>
          </div>
        </div>
      </div>

      {isLarge && therapist.bio && (
        <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">
          {therapist.bio}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
        {therapist.languages.map((lang) => (
           <Badge 
            key={lang} 
            variant="secondary" 
            className="text-xs bg-healio-mint text-healio-mint-foreground rounded-none"
          >
            {lang}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold text-healio-orange text-sm md:text-base">{therapist.price}</span>
          <span className="text-xs text-muted-foreground">/ședință</span>
        </div>
        <Button 
          size="sm" 
          className="bg-healio-turquoise hover:bg-healio-turquoise/90 text-healio-turquoise-foreground text-xs md:text-sm px-2 md:px-3"
          onClick={onClick}
        >
          {isLarge ? (
            <>
              <Calendar className="w-3 md:w-4 h-3 md:h-4 mr-1" />
              Programează
            </>
          ) : (
            <>
              <MessageCircle className="w-3 md:w-4 h-3 md:h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};