import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  max_participants: number;
  current_participants: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export function EventsManager() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_participants: 50,
    current_participants: 0,
    price: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: Partial<Event>) => {
    try {
      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(event)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        if (!event.title || !event.event_date) {
          toast.error('Please fill in all required fields');
          return;
        }
        
        const { error } = await supabase
          .from('events')
          .insert([{ 
            ...event, 
            created_by: (await supabase.auth.getUser()).data.user?.id,
            title: event.title!,
            event_date: event.event_date!
          }]);

        if (error) throw error;
        toast.success('Event created successfully');
      }

      fetchEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
    }
  };

  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      ...event,
      event_date: format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm"),
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      max_participants: 50,
      current_participants: 0,
      price: 0,
      is_active: true,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Manage platform events and workshops</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <EventForm
              data={formData}
              onChange={setFormData}
              onSave={() => handleSave(formData)}
              onCancel={resetForm}
            />
          </CardContent>
        </Card>
      )}

      {/* Events List */}
      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id}>
            {editingId === event.id ? (
              <CardContent className="pt-6">
                <EventForm
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
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {event.title}
                        {!event.is_active && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">Inactive</span>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(event.event_date), 'PPP p')}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(event)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
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
                      {event.description && (
                        <p className="text-sm mb-3">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.current_participants}/{event.max_participants}
                        </span>
                        <span>Price: {event.price} RON</span>
                      </div>
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

interface EventFormProps {
  data: Partial<Event>;
  onChange: (data: Partial<Event>) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ data, onChange, onSave, onCancel }) => {
  const handleInputChange = (field: keyof Event, value: any) => {
    onChange({ ...data, [field]: value });
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
            placeholder="Enter event title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_date">Date & Time *</Label>
          <Input
            id="event_date"
            type="datetime-local"
            value={data.event_date || ''}
            onChange={(e) => handleInputChange('event_date', e.target.value)}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter event location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (RON)</Label>
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
          <Label htmlFor="max_participants">Max Participants</Label>
          <Input
            id="max_participants"
            type="number"
            min="1"
            value={data.max_participants || 50}
            onChange={(e) => handleInputChange('max_participants', parseInt(e.target.value) || 50)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current_participants">Current Participants</Label>
          <Input
            id="current_participants"
            type="number"
            min="0"
            value={data.current_participants || 0}
            onChange={(e) => handleInputChange('current_participants', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter event description"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={data.is_active || false}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active event</Label>
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          disabled={!data.title || !data.event_date}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
};