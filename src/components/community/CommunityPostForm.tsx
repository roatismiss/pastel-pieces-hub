import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Send, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CommunityPostFormProps {
  onPostCreated?: () => void;
  onCancel?: () => void;
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

const CommunityPostForm = ({ onPostCreated, onCancel }: CommunityPostFormProps) => {
  const { user } = useAuth();
  const [postType, setPostType] = useState<'post' | 'question' | 'mood'>('post');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const postData = {
        user_id: user.id,
        type: postType,
        title: title.trim() || null,
        content: content.trim(),
        mood: postType === 'mood' ? mood : null,
        tags,
        is_anonymous: isAnonymous,
      };

      const { error } = await supabase
        .from('community_posts')
        .insert(postData);

      if (error) throw error;

      toast.success('Postarea a fost publicată cu succes!');
      
      // Reset form
      setTitle('');
      setContent('');
      setMood('');
      setTags([]);
      setIsAnonymous(false);
      setPostType('post');
      
      onPostCreated?.();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('A apărut o eroare. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Trebuie să fiți logat pentru a posta în comunitate</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Autentificare
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Postare Nouă în Comunitate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selection */}
          <div className="space-y-2">
            <Label>Tipul postării</Label>
            <Select value={postType} onValueChange={(value: 'post' | 'question' | 'mood') => setPostType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="post">📝 Postare generală</SelectItem>
                <SelectItem value="question">❓ Întrebare</SelectItem>
                <SelectItem value="mood">💭 Împărtășire emoțională</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title (for posts and questions) */}
          {(postType === 'post' || postType === 'question') && (
            <div className="space-y-2">
              <Label htmlFor="title">
                {postType === 'question' ? 'Întrebarea dvs.' : 'Titlu'} 
                {postType === 'question' && ' *'}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={postType === 'question' ? 'Ce vă întrebați?' : 'Titlul postării...'}
                required={postType === 'question'}
              />
            </div>
          )}

          {/* Mood Selection (for mood posts) */}
          {postType === 'mood' && (
            <div className="space-y-2">
              <Label>Cum vă simțiți? *</Label>
              <Select value={mood} onValueChange={setMood} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selectați starea de spirit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(moodEmojis).map(([moodKey, emoji]) => (
                    <SelectItem key={moodKey} value={moodKey}>
                      {emoji} {moodKey === 'happy' ? 'Fericit' : 
                           moodKey === 'sad' ? 'Trist' :
                           moodKey === 'anxious' ? 'Anxios' :
                           moodKey === 'excited' ? 'Entuziasmat' :
                           moodKey === 'stressed' ? 'Stresat' :
                           moodKey === 'calm' ? 'Calm' :
                           moodKey === 'angry' ? 'Supărat' :
                           'Recunoscător'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">
              {postType === 'mood' ? 'Descrieți cum vă simțiți' : 
               postType === 'question' ? 'Detalii' : 'Conținut'} *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === 'mood' ? 'Împărtășiți-vă sentimentele cu comunitatea...' :
                postType === 'question' ? 'Oferiți mai multe detalii despre întrebarea dvs...' :
                'Scrieți despre ce vreți să împărțașiți...'
              }
              rows={4}
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label>Etichete (opțional)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Adaugă etichetă..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
              </div>
              <Button 
                type="button" 
                onClick={addTag}
                disabled={tags.length >= 5}
                size="sm"
              >
                <Hash className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer">
                    #{tag}
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
            <Label htmlFor="anonymous">Postează anonim</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Anulează
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || (postType === 'mood' && !mood)}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Publică
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommunityPostForm;