import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Tag,
  FileText
} from 'lucide-react';

interface TherapistPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  featured_image?: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface TherapistPostsManagerProps {
  therapistId: string;
}

const CATEGORIES = [
  'general', 'anxietate', 'depresie', 'relatii', 'dezvoltare-personala',
  'trauma', 'copii-adolescenti', 'familie', 'terapie-cuplu', 'adicții'
];

const TherapistPostsManager: React.FC<TherapistPostsManagerProps> = ({ therapistId }) => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<TherapistPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<TherapistPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: [] as string[],
    featured_image: '',
    is_published: false
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [therapistId]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('therapist_posts')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca postările",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      tags: [],
      featured_image: '',
      is_published: false
    });
    setNewTag('');
    setEditingPost(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Eroare",
        description: "Titlul și conținutul sunt obligatorii",
        variant: "destructive",
      });
      return;
    }

    try {
      const postData = {
        ...formData,
        therapist_id: therapistId,
        excerpt: formData.excerpt || formData.content.substring(0, 200)
      };

      if (editingPost) {
        const { error } = await supabase
          .from('therapist_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Postarea a fost actualizată",
        });
      } else {
        const { error } = await supabase
          .from('therapist_posts')
          .insert([postData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Postarea a fost creată",
        });
      }

      await fetchPosts();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut salva postarea",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Sunteți sigur că doriți să ștergeți această postare?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Postarea a fost ștearsă",
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge postarea",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: TherapistPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category,
      tags: post.tags || [],
      featured_image: post.featured_image || '',
      is_published: post.is_published
    });
    setIsDialogOpen(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const togglePublish = async (post: TherapistPost) => {
    try {
      const { error } = await supabase
        .from('therapist_posts')
        .update({ is_published: !post.is_published })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Postarea a fost ${!post.is_published ? 'publicată' : 'nepublicată'}`,
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error toggling publish:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza statusul postării",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionare Postări</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Postare nouă
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? 'Editare postare' : 'Postare nouă'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titlu *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titlul postării..."
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Rezumat</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Rezumat scurt al postării..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Conținut *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conținutul complet al postării..."
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="category">Categorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adaugă tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="featured_image">URL imagine principală</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured_image: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publică postarea</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingPost ? 'Actualizează' : 'Creează'} postarea
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Anulează
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.view_count} vizualizări
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.created_at).toLocaleDateString('ro-RO')}
                    </div>
                    <Badge variant={post.is_published ? "default" : "secondary"}>
                      {post.is_published ? 'Publicată' : 'Nepublicată'}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(post)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">
                {post.excerpt || post.content.substring(0, 200)}...
              </p>
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nu aveți încă postări create.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Creați prima postare
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TherapistPostsManager;