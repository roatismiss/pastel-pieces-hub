import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TherapistApplication = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    license_number: '',
    years_experience: 0,
    education: '',
    bio: '',
    certifications: [],
    languages: ['Română'],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Validări
      if (!formData.specialization) {
        toast.error('Specializarea este obligatorie');
        return;
      }
      
      if (!formData.password || formData.password.length < 6) {
        toast.error('Parola trebuie să aibă cel puțin 6 caractere');
        return;
      }

      // 1. Creez contul de utilizator
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        toast.error('A apărut o eroare la crearea contului');
        return;
      }

      // 2. Creez profilul de terapeut
      const { error: therapistError } = await supabase
        .from('therapists')
        .insert({
          name: formData.full_name,
          specialization: formData.specialization,
          bio: formData.bio,
          price: 150,
          languages: formData.languages,
          user_id: authData.user.id,
          is_verified: true
        });

      if (therapistError) throw therapistError;

      // 3. Fac login automat
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) throw signInError;

      toast.success('Felicitări! Contul de terapeut a fost creat cu succes!');
      
      // 4. Aștept puțin pentru ca profilul să se reflecte în DB și apoi redirectionez
      setTimeout(() => {
        navigate('/therapist-dashboard');
      }, 1000);

    } catch (error) {
      console.error('Error creating therapist account:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Înregistrează-te ca Terapeut
          </h1>
          <p className="text-lg text-muted-foreground">
            Creează-ți contul nou și profilul de terapeut pe Healio
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informații de Cont și Profesionale</CardTitle>
            <CardDescription>
              Creează-ți contul și profilul de terapeut într-un singur pas
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Parolă *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                    placeholder="Minimum 6 caractere"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specializare *</Label>
                  <Select 
                    value={formData.specialization} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
                    required
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
                  />
                  <Button 
                    type="button" 
                    onClick={addCertification}
                  >
                    Adaugă
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {cert}
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700"
                        onClick={() => removeCertification(cert)}
                      >
                        ×
                      </button>
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
                  />
                  <Button 
                    type="button" 
                    onClick={addLanguage}
                  >
                    Adaugă
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer">
                      {lang}
                      {formData.languages.length > 1 && (
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

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Înapoi la site
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Creează Cont și Profil Terapeut
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapistApplication;