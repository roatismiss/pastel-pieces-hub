import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Therapist {
  id: string;
  name: string;
  avatar_url?: string;
  specialization: string;
  rating: number;
  review_count: number;
  price: number;
  languages: string[];
  availability: string;
  bio?: string;
  is_verified: boolean;
}

export const Admin = () => {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Therapist>>({
    name: '',
    specialization: '',
    rating: 0,
    review_count: 0,
    price: 0,
    languages: ['Română'],
    availability: 'Disponibil',
    bio: '',
    is_verified: false,
  });

  useEffect(() => {
    if (isAdmin) {
      fetchTherapists();
    }
  }, [isAdmin]);

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Failed to load therapists');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (therapist: Partial<Therapist>) => {
    try {
      if (editingId) {
        // Update existing therapist
        const { error } = await supabase
          .from('therapists')
          .update(therapist)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Therapist updated successfully');
      } else {
        // Create new therapist - ensure required fields are present
        if (!therapist.name || !therapist.specialization || !therapist.price) {
          toast.error('Please fill in all required fields');
          return;
        }
        
        const { error } = await supabase
          .from('therapists')
          .insert([therapist as any]);

        if (error) throw error;
        toast.success('Therapist created successfully');
      }

      fetchTherapists();
      setEditingId(null);
      setShowAddForm(false);
      setFormData({
        name: '',
        specialization: '',
        rating: 0,
        review_count: 0,
        price: 0,
        languages: ['Română'],
        availability: 'Disponibil',
        bio: '',
        is_verified: false,
      });
    } catch (error) {
      console.error('Error saving therapist:', error);
      toast.error('Failed to save therapist');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this therapist?')) return;

    try {
      const { error } = await supabase
        .from('therapists')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Therapist deleted successfully');
      fetchTherapists();
    } catch (error) {
      console.error('Error deleting therapist:', error);
      toast.error('Failed to delete therapist');
    }
  };

  const startEdit = (therapist: Therapist) => {
    setEditingId(therapist.id);
    setFormData(therapist);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      specialization: '',
      rating: 0,
      review_count: 0,
      price: 0,
      languages: ['Română'],
      availability: 'Disponibil',
      bio: '',
      is_verified: false,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be logged in to access the admin panel.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healio-turquoise mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have admin permissions to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-merriweather font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-2">Manage therapists and platform content</p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-healio-turquoise hover:bg-healio-turquoise/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Therapist
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healio-turquoise mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading therapists...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {/* Add Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Therapist</CardTitle>
                </CardHeader>
                <CardContent>
                  <TherapistForm
                    data={formData}
                    onChange={setFormData}
                    onSave={() => handleSave(formData)}
                    onCancel={cancelEdit}
                  />
                </CardContent>
              </Card>
            )}

            {/* Therapists List */}
            {therapists.map((therapist) => (
              <Card key={therapist.id} className="relative">
                {editingId === therapist.id ? (
                  <CardContent className="pt-6">
                    <TherapistForm
                      data={formData}
                      onChange={setFormData}
                      onSave={() => handleSave(formData)}
                      onCancel={cancelEdit}
                    />
                  </CardContent>
                ) : (
                  <>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {therapist.name}
                              {therapist.is_verified && (
                                <Badge className="bg-healio-mint text-healio-mint-foreground">
                                  Verified
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription>{therapist.specialization}</CardDescription>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(therapist)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(therapist.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span>{therapist.rating}/5</span>
                            <Users className="w-4 h-4 ml-4" />
                            <span>{therapist.review_count} reviews</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Price:</strong> {therapist.price} RON/session
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            <strong>Languages:</strong> {therapist.languages?.join(', ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Status:</strong> {therapist.availability}
                          </p>
                        </div>
                        {therapist.bio && (
                          <div>
                            <p className="text-sm"><strong>Bio:</strong></p>
                            <p className="text-sm text-muted-foreground">{therapist.bio}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface TherapistFormProps {
  data: Partial<Therapist>;
  onChange: (data: Partial<Therapist>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const TherapistForm: React.FC<TherapistFormProps> = ({ data, onChange, onSave, onCancel }) => {
  const handleInputChange = (field: keyof Therapist, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleLanguageChange = (languageString: string) => {
    const languages = languageString.split(',').map(lang => lang.trim()).filter(Boolean);
    handleInputChange('languages', languages);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={data.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter therapist name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization *</Label>
          <Input
            id="specialization"
            value={data.specialization || ''}
            onChange={(e) => handleInputChange('specialization', e.target.value)}
            placeholder="Enter specialization"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={data.rating || 0}
            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewCount">Review Count</Label>
          <Input
            id="reviewCount"
            type="number"
            min="0"
            value={data.review_count || 0}
            onChange={(e) => handleInputChange('review_count', parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (RON) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={data.price || 0}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="languages">Languages (comma separated)</Label>
          <Input
            id="languages"
            value={data.languages?.join(', ') || ''}
            onChange={(e) => handleLanguageChange(e.target.value)}
            placeholder="Română, Engleză, Franceză"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Input
            id="availability"
            value={data.availability || ''}
            onChange={(e) => handleInputChange('availability', e.target.value)}
            placeholder="Disponibil, Ocupat, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Enter therapist bio"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="verified"
          checked={data.is_verified || false}
          onCheckedChange={(checked) => handleInputChange('is_verified', checked)}
        />
        <Label htmlFor="verified">Verified therapist</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="bg-healio-turquoise hover:bg-healio-turquoise/90"
          disabled={!data.name || !data.specialization || !data.price}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};