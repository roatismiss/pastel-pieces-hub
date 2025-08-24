import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Calendar,
  Clock,
  User,
  Settings
} from 'lucide-react';

interface Availability {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

interface Appointment {
  id: string;
  client_id: string;
  appointment_date: string;
  duration: number;
  status: string;
  price: number;
  notes?: string;
  created_at: string;
}

interface TherapistCalendarProps {
  therapistId: string;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Luni' },
  { value: 2, label: 'Marți' },
  { value: 3, label: 'Miercuri' },
  { value: 4, label: 'Joi' },
  { value: 5, label: 'Vineri' },
  { value: 6, label: 'Sâmbătă' },
  { value: 0, label: 'Duminică' }
];

const TherapistCalendar: React.FC<TherapistCalendarProps> = ({ therapistId }) => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAvailability, setEditingAvailability] = useState<Availability | null>(null);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  
  const [availabilityForm, setAvailabilityForm] = useState({
    day_of_week: 1,
    start_time: '09:00',
    end_time: '17:00',
    is_available: true
  });

  useEffect(() => {
    fetchData();
  }, [therapistId]);

  const fetchData = async () => {
    try {
      // Fetch availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('therapist_availability')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('day_of_week');

      if (availabilityError) throw availabilityError;
      setAvailability(availabilityData || []);

      // Fetch appointments for the next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('therapist_appointments')
        .select('*')
        .eq('therapist_id', therapistId)
        .gte('appointment_date', new Date().toISOString())
        .lte('appointment_date', thirtyDaysFromNow.toISOString())
        .order('appointment_date');

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut încărca datele calendarului",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetAvailabilityForm = () => {
    setAvailabilityForm({
      day_of_week: 1,
      start_time: '09:00',
      end_time: '17:00',
      is_available: true
    });
    setEditingAvailability(null);
  };

  const handleSaveAvailability = async () => {
    if (!availabilityForm.start_time || !availabilityForm.end_time) {
      toast({
        title: "Eroare",
        description: "Ora de început și sfârșitul sunt obligatorii",
        variant: "destructive",
      });
      return;
    }

    if (availabilityForm.start_time >= availabilityForm.end_time) {
      toast({
        title: "Eroare",
        description: "Ora de început trebuie să fie înaintea orei de sfârșit",
        variant: "destructive",
      });
      return;
    }

    try {
      const availabilityData = {
        ...availabilityForm,
        therapist_id: therapistId
      };

      if (editingAvailability) {
        const { error } = await supabase
          .from('therapist_availability')
          .update(availabilityData)
          .eq('id', editingAvailability.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Disponibilitatea a fost actualizată",
        });
      } else {
        const { error } = await supabase
          .from('therapist_availability')
          .insert([availabilityData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Disponibilitatea a fost adăugată",
        });
      }

      await fetchData();
      resetAvailabilityForm();
      setIsAvailabilityDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving availability:', error);
      
      if (error.code === '23505') {
        toast({
          title: "Eroare",
          description: "Există deja o disponibilitate pentru această zi și oră",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Eroare",
          description: "Nu am putut salva disponibilitatea",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteAvailability = async (availabilityId: string) => {
    if (!window.confirm('Sunteți sigur că doriți să ștergeți această disponibilitate?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('therapist_availability')
        .delete()
        .eq('id', availabilityId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Disponibilitatea a fost ștearsă",
      });

      await fetchData();
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut șterge disponibilitatea",
        variant: "destructive",
      });
    }
  };

  const handleEditAvailability = (availability: Availability) => {
    setEditingAvailability(availability);
    setAvailabilityForm({
      day_of_week: availability.day_of_week,
      start_time: availability.start_time,
      end_time: availability.end_time,
      is_available: availability.is_available
    });
    setIsAvailabilityDialogOpen(true);
  };

  const toggleAvailabilityStatus = async (availability: Availability) => {
    try {
      const { error } = await supabase
        .from('therapist_availability')
        .update({ is_available: !availability.is_available })
        .eq('id', availability.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Disponibilitatea a fost ${!availability.is_available ? 'activată' : 'dezactivată'}`,
      });

      await fetchData();
    } catch (error) {
      console.error('Error toggling availability status:', error);
      toast({
        title: "Eroare",
        description: "Nu am putut actualiza statusul disponibilității",
        variant: "destructive",
      });
    }
  };

  const getDayLabel = (dayOfWeek: number) => {
    return DAYS_OF_WEEK.find(day => day.value === dayOfWeek)?.label || 'Necunoscut';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programată';
      case 'completed': return 'Completată';
      case 'cancelled': return 'Anulată';
      default: return status;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Disponibilitate
              </CardTitle>
              <Dialog open={isAvailabilityDialogOpen} onOpenChange={setIsAvailabilityDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetAvailabilityForm} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adaugă
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAvailability ? 'Editare disponibilitate' : 'Disponibilitate nouă'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="day_of_week">Ziua săptămânii</Label>
                      <Select
                        value={availabilityForm.day_of_week.toString()}
                        onValueChange={(value) => setAvailabilityForm(prev => ({ 
                          ...prev, 
                          day_of_week: parseInt(value) 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start_time">Ora început</Label>
                        <Input
                          id="start_time"
                          type="time"
                          value={availabilityForm.start_time}
                          onChange={(e) => setAvailabilityForm(prev => ({ 
                            ...prev, 
                            start_time: e.target.value 
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="end_time">Ora sfârșit</Label>
                        <Input
                          id="end_time"
                          type="time"
                          value={availabilityForm.end_time}
                          onChange={(e) => setAvailabilityForm(prev => ({ 
                            ...prev, 
                            end_time: e.target.value 
                          }))}
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_available"
                        checked={availabilityForm.is_available}
                        onCheckedChange={(checked) => setAvailabilityForm(prev => ({ 
                          ...prev, 
                          is_available: checked 
                        }))}
                      />
                      <Label htmlFor="is_available">Disponibil</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveAvailability} className="flex-1">
                        {editingAvailability ? 'Actualizează' : 'Adaugă'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAvailabilityDialogOpen(false)}
                      >
                        Anulează
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {availability.map((avail) => (
              <div key={avail.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={avail.is_available ? "default" : "secondary"}>
                    {getDayLabel(avail.day_of_week)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {avail.start_time} - {avail.end_time}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAvailabilityStatus(avail)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAvailability(avail)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAvailability(avail.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {availability.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Nu aveți disponibilități configurate.
                </p>
                <Button onClick={() => setIsAvailabilityDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă prima disponibilitate
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Programări viitoare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Client #{appointment.client_id.slice(0, 8)}</span>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(appointment.appointment_date).toLocaleString('ro-RO')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appointment.duration} min
                    </div>
                    <span className="font-semibold">{appointment.price} RON</span>
                  </div>
                  {appointment.notes && (
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  )}
                </div>
              </div>
            ))}
            
            {appointments.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nu aveți programări în următoarele 30 de zile.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistCalendar;