import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, FileText, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category: string;
  tags?: string[];
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: 'general',
    tags: [],
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (post: Partial<Post>) => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('posts')
          .update(post)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Post updated successfully');
      } else {
        if (!post.title || !post.content) {
          toast.error('Please fill in all required fields');
          return;
        }
        
        const { error } = await supabase
          .from('posts')
          .insert([{ 
            ...post, 
            author_id: (await supabase.auth.getUser()).data.user?.id,
            title: post.title!,
            content: post.content!
          }]);

        if (error) throw error;
        toast.success('Post created successfully');
      }

      fetchPosts();
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const startEdit = (post: Post) => {
    setEditingId(post.id);
    setFormData(post);
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      category: 'general',
      tags: [],
      is_published: false,
      is_featured: false,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Posts Management</h2>
          <p className="text-muted-foreground">Manage blog posts and articles</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              data={formData}
              onChange={setFormData}
              onSave={() => handleSave(formData)}
              onCancel={resetForm}
            />
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            {editingId === post.id ? (
              <CardContent className="pt-6">
                <PostForm
                  data={formData}
                  onChange={setFormData}
                  onSave={() => handleSave(formData)}
                  onCancel={resetForm}
                />
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {post.title}
                        <div className="flex gap-1">
                          {post.is_featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          )}
                          {post.is_published ? (
                            <Badge className="bg-green-100 text-green-800">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span>Category: {post.category}</span>
                        <span>Created: {format(new Date(post.created_at), 'PPP')}</span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {post.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground border-l-2 pl-3">
                      {post.content.substring(0, 200)}
                      {post.content.length > 200 && '...'}
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

interface PostFormProps {
  data: Partial<Post>;
  onChange: (data: Partial<Post>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ data, onChange, onSave, onCancel }) => {
  const handleInputChange = (field: keyof Post, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    handleInputChange('tags', tags);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter post title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={data.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="general, mental-health, therapy"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={data.excerpt || ''}
          onChange={(e) => handleInputChange('excerpt', e.target.value)}
          placeholder="Brief description of the post"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          value={data.content || ''}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="Enter post content (supports Markdown)"
          rows={8}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="featured_image">Featured Image URL</Label>
          <Input
            id="featured_image"
            value={data.featured_image || ''}
            onChange={(e) => handleInputChange('featured_image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={data.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="wellness, therapy, mental-health"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            checked={data.is_published || false}
            onCheckedChange={(checked) => handleInputChange('is_published', checked)}
          />
          <Label htmlFor="is_published">Published</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_featured"
            checked={data.is_featured || false}
            onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
          />
          <Label htmlFor="is_featured">Featured</Label>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          disabled={!data.title || !data.content}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};