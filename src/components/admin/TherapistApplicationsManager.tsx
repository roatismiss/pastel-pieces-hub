import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, XCircle, Clock, Eye, FileText, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { toast } from 'sonner';

interface TherapistApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  specialization: string;
  license_number: string;
  years_experience: number;
  education: string;
  bio?: string;
  certifications?: string[];
  languages: string[];
  license_document_url?: string;
  cv_document_url?: string;
  certificate_urls?: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  applied_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  profiles?: {
    full_name?: string;
  };
}

const TherapistApplicationsManager = () => {
  const [applications, setApplications] = useState<TherapistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('therapist_applications')
        .select(`
          *,
          profiles!therapist_applications_user_id_fkey (
            full_name
          )
        `)
        .order('applied_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setApplications(data as TherapistApplication[] || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Eroare la încărcarea aplicațiilor');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      setReviewingId(applicationId);
      
      const { data: updatedApplication, error: updateError } = await supabase
        .from('therapist_applications')
        .update({
          status: newStatus,
          admin_notes: adminNotes || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', applicationId)
        .select()
        .single();

      if (updateError) throw updateError;

      // If approved, create therapist profile
      if (newStatus === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          const { error: therapistError } = await supabase
            .from('therapists')
            .insert({
              user_id: application.user_id,
              application_id: applicationId,
              name: application.full_name,
              specialization: application.specialization,
              bio: application.bio,
              languages: application.languages,
              price: 100, // Default price, can be updated later
              is_verified: true,
            });

          if (therapistError) {
            console.error('Error creating therapist profile:', therapistError);
            toast.error('Aplicația a fost aprobată dar a apărut o eroare la crearea profilului');
          }
        }
      }

      toast.success(`Aplicația a fost ${newStatus === 'approved' ? 'aprobată' : 'respinsă'}`);
      fetchApplications();
      setAdminNotes('');
      setReviewingId(null);
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast.error('Eroare la procesarea aplicației');
    } finally {
      setReviewingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />În așteptare</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aprobată</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600"><XCircle className="w-3 h-3 mr-1" />Respinsă</Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const approvedCount = applications.filter(app => app.status === 'approved').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Aplicații Terapeuți</h2>
        <p className="text-muted-foreground">
          Gestionați aplicațiile pentru a deveni terapeut licențiat
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <FileText className="h-8 w-8 text-primary mr-3" />
            <div>
              <p className="text-2xl font-bold">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Total aplicații</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">În așteptare</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-sm text-muted-foreground">Aprobate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-4">
            <XCircle className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-sm text-muted-foreground">Respinse</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'approved' | 'rejected') => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate aplicațiile</SelectItem>
            <SelectItem value="pending">În așteptare</SelectItem>
            <SelectItem value="approved">Aprobate</SelectItem>
            <SelectItem value="rejected">Respinse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nu există aplicații pentru acest filtru</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          applications.map(application => (
            <Card key={application.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <User className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">{application.full_name}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <p>📧 {application.email}</p>
                      <p>🎓 {application.specialization}</p>
                      <p>⏰ Aplicat {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true, locale: ro })}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Licență:</strong> {application.license_number}
                  </div>
                  <div>
                    <strong>Experiență:</strong> {application.years_experience} ani
                  </div>
                  {application.phone && (
                    <div>
                      <strong>Telefon:</strong> {application.phone}
                    </div>
                  )}
                  <div>
                    <strong>Limbi:</strong> {application.languages.join(', ')}
                  </div>
                </div>

                <div>
                  <strong className="block mb-2">Educație:</strong>
                  <p className="text-sm bg-muted p-3 rounded-lg">{application.education}</p>
                </div>

                {application.bio && (
                  <div>
                    <strong className="block mb-2">Biografie:</strong>
                    <p className="text-sm bg-muted p-3 rounded-lg">{application.bio}</p>
                  </div>
                )}

                {application.certifications && application.certifications.length > 0 && (
                  <div>
                    <strong className="block mb-2">Certificări:</strong>
                    <div className="flex flex-wrap gap-2">
                      {application.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {application.admin_notes && (
                  <div>
                    <strong className="block mb-2">Note Administrator:</strong>
                    <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">
                      {application.admin_notes}
                    </p>
                  </div>
                )}

                {application.status === 'pending' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <strong className="block mb-2">Note pentru aplicant:</strong>
                      <Textarea
                        placeholder="Adaugă note pentru aplicant (opțional)..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview(application.id, 'approved')}
                        disabled={reviewingId === application.id}
                        className="flex-1"
                      >
                        {reviewingId === application.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Aprobă
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleReview(application.id, 'rejected')}
                        disabled={reviewingId === application.id}
                        className="flex-1"
                      >
                        {reviewingId === application.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Respinge
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TherapistApplicationsManager;