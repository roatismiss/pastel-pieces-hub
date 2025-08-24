import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapist } from '@/hooks/useTherapist';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, CheckCircle, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const TherapistApplication = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { 
    application, 
    hasApplication, 
    applicationStatus, 
    canApply, 
    canEditApplication,
    loading: therapistLoading,
    submitApplication,
    updateApplication 
  } = useTherapist();

  const [formData, setFormData] = useState({
    full_name: application?.full_name || '',
    email: application?.email || user?.email || '',
    phone: application?.phone || '',
    specialization: application?.specialization || '',
    license_number: application?.license_number || '',
    years_experience: application?.years_experience || 0,
    education: application?.education || '',
    bio: application?.bio || '',
    certifications: application?.certifications || [],
    languages: application?.languages || ['Română'],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const loading = authLoading || therapistLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      if (canApply) {
        await submitApplication(formData);
        toast.success('Aplicația a fost trimisă cu succes! Veți fi contactat în curând.');
      } else if (canEditApplication) {
        await updateApplication(formData);
        toast.success('Aplicația a fost actualizată cu succes!');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('A apărut o eroare. Vă rugăm să încercați din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    if (formData.languages.length > 1) {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.filter(l => l !== lang)
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const getStatusBadge = () => {
    switch (applicationStatus) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {hasApplication ? 'Aplicația Dumneavoastră' : 'Aplicare ca Terapeut'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {hasApplication 
              ? 'Vizualizați și editați aplicația pentru a deveni terapeut licențiat pe Healio'
              : 'Completați formularul pentru a deveni terapeut licențiat pe Healio'
            }
          </p>
          {hasApplication && (
            <div className="mt-4 flex justify-center">
              {getStatusBadge()}
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informații Personale și Profesionale</CardTitle>
            <CardDescription>
              Completați toate câmpurile cu informații corecte și actualizate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nume Complet *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                    disabled={!canApply && !canEditApplication}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={!canApply && !canEditApplication}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!canApply && !canEditApplication}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specializare *</Label>
                  <Select 
                    value={formData.specialization} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
                    disabled={!canApply && !canEditApplication}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selectați specializarea" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Psihologie Clinică">Psihologie Clinică</SelectItem>
                      <SelectItem value="Psihoterapie">Psihoterapie</SelectItem>
                      <SelectItem value="Psihiatrie">Psihiatrie</SelectItem>
                      <SelectItem value="Psihologie pentru Copii">Psihologie pentru Copii</SelectItem>
                      <SelectItem value="Terapie de Cuplu">Terapie de Cuplu</SelectItem>
                      <SelectItem value="Terapie de Familie">Terapie de Familie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="license_number">Număr Licență *</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, license_number: e.target.value }))}
                    required
                    disabled={!canApply && !canEditApplication}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_experience">Ani de Experiență *</Label>
                  <Input
                    id="years_experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.years_experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                    required
                    disabled={!canApply && !canEditApplication}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Educație *</Label>
                <Textarea
                  id="education"
                  placeholder="Descrieți educația și pregătirea dvs. profesională..."
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  required
                  rows={3}
                  disabled={!canApply && !canEditApplication}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografie Profesională</Label>
                <Textarea
                  id="bio"
                  placeholder="Prezentați-vă experiența și abordarea terapeutică..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  disabled={!canApply && !canEditApplication}
                />
              </div>

              <div className="space-y-4">
                <Label>Certificări</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adaugă certificare..."
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    disabled={!canApply && !canEditApplication}
                  />
                  <Button 
                    type="button" 
                    onClick={addCertification}
                    disabled={!canApply && !canEditApplication}
                  >
                    Adaugă
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {cert}
                      {(canApply || canEditApplication) && (
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => removeCertification(cert)}
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Limbi Vorbite</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Adaugă limbă..."
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                    disabled={!canApply && !canEditApplication}
                  />
                  <Button 
                    type="button" 
                    onClick={addLanguage}
                    disabled={!canApply && !canEditApplication}
                  >
                    Adaugă
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {lang}
                      {(canApply || canEditApplication) && formData.languages.length > 1 && (
                        <button
                          type="button"
                          className="ml-2 text-red-500 hover:text-red-700"
                          onClick={() => removeLanguage(lang)}
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {hasApplication && application?.admin_notes && (
                <div className="space-y-2">
                  <Label>Note Administrator</Label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{application.admin_notes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Înapoi
                </Button>
                
                {(canApply || canEditApplication) && (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {canApply ? 'Trimite Aplicația' : 'Actualizează Aplicația'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistApplication;