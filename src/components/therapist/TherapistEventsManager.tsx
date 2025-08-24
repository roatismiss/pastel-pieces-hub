import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  MapPin,
  Users,
  DollarSign
} from 'lucide-react';

interface TherapistEvent {
  id: string;
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
  updated_at: string;
}

interface TherapistEventsManagerProps {
  therapistId: string;
}

const TherapistEventsManager: React.FC<TherapistEventsManagerProps> = ({ therapistId }) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<TherapistEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<TherapistEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    price: 0,
    max_participants: 50,
    is_active: true
  });

  useEffect(() => {
    fetchEvents();
  }, [therapistId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('therapist_events')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca evenimentele",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      price: 0,
      max_participants: 50,
      is_active: true
    });
    setEditingEvent(null);
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.event_date) {
      toast({
        title: "Eroare",
        description: "Titlul și data evenimentului sunt obligatorii",
        variant: "destructive",
      });
      return;
    }

    try {
      const eventData = {
        ...formData,
        therapist_id: therapistId,
        current_participants: editingEvent?.current_participants || 0
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('therapist_events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Evenimentul a fost actualizat",
        });
      } else {
        const { error } = await supabase
          .from('therapist_events')
          .insert([eventData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Evenimentul a fost creat",
        });
      }

      await fetchEvents();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut salva evenimentul",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!window.confirm('Sunteți sigur că doriți să ștergeți acest eveniment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Evenimentul a fost șters",
      });

      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge evenimentul",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (event: TherapistEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: new Date(event.event_date).toISOString().slice(0, 16),
      location: event.location || '',
      price: event.price,
      max_participants: event.max_participants,
      is_active: event.is_active
    });
    setIsDialogOpen(true);
  };

  const toggleActive = async (event: TherapistEvent) => {
    try {
      const { error } = await supabase
        .from('therapist_events')
        .update({ is_active: !event.is_active })
        .eq('id', event.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Evenimentul a fost ${!event.is_active ? 'activat' : 'dezactivat'}`,
      });

      await fetchEvents();
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza statusul evenimentului",
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
        <h2 className="text-2xl font-bold">Gestionare Evenimente</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Eveniment nou
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Editare eveniment' : 'Eveniment nou'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titlu *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titlul evenimentului..."
                />
              </div>

              <div>
                <Label htmlFor="description">Descriere</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrierea evenimentului..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_date">Data și ora *</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Locația</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Ex: Online, București, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preț (RON)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="max_participants">Număr maxim participanți</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 50 }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Eveniment activ</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingEvent ? 'Actualizează' : 'Creează'} evenimentul
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
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.event_date).toLocaleString('ro-RO')}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {event.view_count} vizualizări
                    </div>
                    <Badge variant={event.is_active ? "default" : "secondary"}>
                      {event.is_active ? 'Activ' : 'Inactiv'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {event.price} RON
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.current_participants} / {event.max_participants} participanți
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(event)}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {event.description && (
              <CardContent>
                <p className="text-muted-foreground line-clamp-3">
                  {event.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}

        {events.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nu aveți încă evenimente create.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Creați primul eveniment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TherapistEventsManager;