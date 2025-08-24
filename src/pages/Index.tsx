import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PuzzleGrid, PuzzleCard } from '@/components/PuzzleGrid';
import { TherapistCard } from '@/components/TherapistCard';
import { CommunityCard } from '@/components/CommunityCard';
import { FloatingNodes } from '@/components/FloatingNodes';
import ConnectedParticles from '@/components/ConnectedParticles';
import CloudNodes from '@/components/CloudNodes';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, BookOpen, Calendar, Heart, Plus, Shield, Clock, Star, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';

import heroImage from '@/assets/hero-healio.jpg';
import therapist1 from '@/assets/therapist-1.jpg';
import therapist2 from '@/assets/therapist-2.jpg';
import therapist3 from '@/assets/therapist-3.jpg';

interface Therapist {
  id: string;
  name: string;
  avatar_url?: string;
  specialization: string;
  rating?: number;
  review_count?: number;
  price: number;
  languages?: string[];
  availability?: string;
  bio?: string;
  is_verified?: boolean;
}

const Index = () => {
  console.log('Index component is rendering');
  
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch therapists from Supabase
  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const { data, error } = await supabase
        .from('therapists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching therapists:', error);
        toast.error('Eroare la încărcarea terapeuților');
        return;
      }

      setTherapists(data || []);
    } catch (error) {
      console.error('Error fetching therapists:', error);
      toast.error('Eroare la încărcarea terapeuților');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTherapist = (therapist: Therapist) => {
    setEditingTherapist(therapist);
    setIsEditDialogOpen(true);
  };

  const handleSaveTherapist = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTherapist) return;

    try {
      const formData = new FormData(e.currentTarget);
      const updatedData = {
        name: formData.get('name') as string,
        specialization: formData.get('specialization') as string,
        price: parseFloat(formData.get('price') as string),
        bio: formData.get('bio') as string,
        avatar_url: formData.get('avatar_url') as string,
        availability: formData.get('availability') as string,
        languages: (formData.get('languages') as string).split(',').map(lang => lang.trim()).filter(Boolean),
        rating: parseFloat(formData.get('rating') as string) || 0,
        review_count: parseInt(formData.get('review_count') as string) || 0,
      };

      const { error } = await supabase
        .from('therapists')
        .update(updatedData)
        .eq('id', editingTherapist.id);

      if (error) throw error;

      toast.success('Terapeutul a fost actualizat cu succes!');
      setIsEditDialogOpen(false);
      setEditingTherapist(null);
      fetchTherapists();
    } catch (error) {
      console.error('Error updating therapist:', error);
      toast.error('Eroare la actualizarea terapeutului');
    }
  };

  const handleDeleteTherapist = async (therapistId: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest terapeut?')) return;

    try {
      const { error } = await supabase
        .from('therapists')
        .delete()
        .eq('id', therapistId);

      if (error) throw error;

      toast.success('Terapeutul a fost șters cu succes!');
      fetchTherapists();
    } catch (error) {
      console.error('Error deleting therapist:', error);
      toast.error('Eroare la ștergerea terapeutului');
    }
  };

  const communityPosts = [
    {
      id: '1',
      author: 'Maria',
      content: 'Azi am reușit să vorbesc cu șeful despre problemele mele de la muncă. Simt că fac progrese reale în terapie și încep să îmi recâștig încrederea în mine.',
      timestamp: '2 ore',
      reactions: { hug: 12, growth: 8, strength: 15, insight: 3 },
      type: 'text' as const
    },
    {
      id: '2',
      author: 'Anonim',
      content: 'anxious',
      timestamp: '30 min',
      reactions: { hug: 5, growth: 0, strength: 2, insight: 0 },
      type: 'mood' as const,
      mood: 'anxious',
      isAnonymous: true
    },
    {
      id: '3',
      author: 'Alexandra',
      content: 'Progresul nu este liniștit. Nu înseamnă că nu faci progrese dacă ai zile grele.',
      timestamp: '1 zi',
      reactions: { hug: 8, growth: 22, strength: 18, insight: 12 },
      type: 'quote' as const
    },
    {
      id: '4',
      author: 'Călin',
      content: 'Prima mea ședință de terapie de mâine. Sunt nervos dar și bucuros că fac pasul asta pentru mine.',
      timestamp: '3 ore',
      reactions: { hug: 18, growth: 25, strength: 12, insight: 4 },
      type: 'checkin' as const
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-2 md:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
              <div className="relative group flex items-center gap-4 md:gap-6">
                {/* Healtio Logo Image */}
                <div className="relative flex items-center justify-center px-4 py-1">
                  <img 
                    src="/lovable-uploads/9d69c4a6-b602-444b-a872-cf5dbcb40af2.png"
                    alt="Healtio Logo"
                    className="h-16 md:h-20 w-auto object-contain filter-none"
                    style={{ 
                      imageRendering: 'crisp-edges'
                    }}
                  />
                </div>
                
                <div className="absolute -inset-6 bg-gradient-to-r from-healio-orange/20 via-healio-turquoise/20 to-healio-mint/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10 blur-2xl animate-gradient-shift"></div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#marketplace" className="text-sm hover:text-primary transition-colors">
                  Terapeuți
                </a>
                <a href="#community" className="text-sm hover:text-primary transition-colors">
                  Comunitate
                </a>
                <a href="#education" className="text-sm hover:text-primary transition-colors">
                  Educație
                </a>
                <a href="#events" className="text-sm hover:text-primary transition-colors">
                  Evenimente
                </a>
                <a href="/admin" className="text-sm hover:text-primary transition-colors">
                  Admin
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button variant="outline" size="sm" className="hidden md:inline-flex border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                <Link to="/therapist-dashboard">Dashboard Terapeut</Link>
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/auth">Conectează-te</Link>
              </Button>
              <Button size="sm" className="bg-healio-orange hover:bg-healio-orange/90 text-xs md:text-sm px-3 md:px-4" asChild>
                <Link to="/auth">Începe acum</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative hero-background">
        {/* Mobile full-screen hero */}
        <div className="md:hidden min-h-screen flex items-center justify-center relative overflow-hidden">
          <FloatingNodes />
          <img 
            src={heroImage} 
            alt="Healio - Echilibru interior"
            className="absolute inset-0 w-full h-full object-cover opacity-3"
          />
          <div className="relative z-10 text-center p-4 w-full">
            <div className="mb-4 sm:mb-6">
              <Badge className="hero-badge neuro-outset text-white mb-3 text-xs px-3 py-1 hero-animate-headline">
                ✨ Platforma #1 pentru sănătatea mentală în România
              </Badge>
            </div>
            <h1 className="text-2xl font-merriweather hero-headline mb-4 leading-tight hero-animate-headline">
              Nu mai suferi în 
              <span className="hero-gradient-text"> tăcere</span>
              <br />
              Găsește-ți echilibrul cu Healio
            </h1>
            <p className="text-sm hero-subheadline mb-6 max-w-md mx-auto leading-relaxed hero-animate-subheadline">
              <strong className="hero-headline">Știm că e greu să ceri ajutor.</strong> De aceea am creat Healio - locul unde găsești 
              rapid terapeuți licențiați de încredere și o comunitate care te înțelege cu adevărat. 
              <span className="hero-gradient-text font-medium italic">Fără judecăți. Doar sprijin.</span>
            </p>
            
            <div className="grid grid-cols-1 gap-2 mb-6 text-xs hero-proof-text hero-animate-subheadline">
              <div className="flex items-center gap-2 justify-center hero-subheadline neuro-inset px-3 py-2 rounded-xl">
                <Shield className="h-3 w-3 text-healio-turquoise flex-shrink-0" />
                <span>100% Confidențial</span>
              </div>
              <div className="flex items-center gap-2 justify-center hero-subheadline neuro-inset px-3 py-2 rounded-xl">
                <Clock className="h-3 w-3 text-healio-mint flex-shrink-0" />
                <span>Disponibil 24/7</span>
              </div>
              <div className="flex items-center gap-2 justify-center hero-subheadline neuro-inset px-3 py-2 rounded-xl">
                <Star className="h-3 w-3 text-healio-orange flex-shrink-0" />
                <span>Terapeuți verificați</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center max-w-xs mx-auto hero-animate-cta">
              <Button 
                size="lg" 
                className="cta-premium text-white font-bold text-sm py-3 px-4"
              >
                <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Vorbește cu terapeut ACUM</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="btn-skeuomorphic text-sm px-4 py-3 text-healio-orange hover:text-white font-medium rounded-2xl"
              >
                <Heart className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Alătură-te comunității</span>
              </Button>
            </div>
            
            <p className="text-xs hero-proof-text mt-6 hero-subheadline hero-animate-cta neuro-inset-deep px-4 py-2 rounded-full inline-block">
              <strong className="hero-headline">Peste 10.000+ români</strong> și-au regăsit echilibrul cu ajutorul Healio
            </p>
          </div>
        </div>
        
        {/* Desktop card-style hero */}
        <div className="hidden md:block py-8 sm:py-12 md:py-20 px-3 sm:px-4">
          <div className="container mx-auto max-w-6xl">
            <PuzzleGrid className="gap-3 sm:gap-4 md:gap-6">
              <PuzzleCard size="2x2" className="hero-neuro-glass texture-paper flex items-center justify-center relative overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                <FloatingNodes />
                <img 
                  src={heroImage} 
                  alt="Healio - Echilibru interior"
                  className="absolute inset-0 w-full h-full object-cover opacity-3"
                />
                <div className="relative z-10 text-center p-4 sm:p-6 md:p-10">
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <Badge className="hero-badge neuro-outset text-white mb-3 sm:mb-4 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 hero-animate-headline">
                    ✨ Platforma #1 pentru sănătatea mentală în România
                  </Badge>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-merriweather hero-headline mb-4 sm:mb-6 md:mb-8 leading-tight hero-animate-headline">
                  Nu mai suferi în 
                  <span className="hero-gradient-text"> tăcere</span>
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Găsește-ți echilibrul cu Healio
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-xl hero-subheadline mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-1 sm:px-2 hero-animate-subheadline">
                  <strong className="hero-headline">Știm că e greu să ceri ajutor.</strong> De aceea am creat Healio - locul unde găsești 
                  rapid terapeuți licențiați de încredere și o comunitate care te înțelege cu adevărat. 
                  <span className="hero-gradient-text font-medium italic">Fără judecăți. Doar sprijin.</span>
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 text-xs sm:text-sm hero-proof-text hero-animate-subheadline">
                  <div className="flex items-center gap-2 justify-center hero-subheadline neuro-inset px-3 sm:px-4 py-2 rounded-xl">
                    <Shield className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 text-healio-turquoise flex-shrink-0" />
                    <span>100% Confidențial</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center hero-subheadline neuro-inset px-3 sm:px-4 py-2 rounded-xl">
                    <Clock className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 text-healio-mint flex-shrink-0" />
                    <span>Disponibil 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center hero-subheadline neuro-inset px-3 sm:px-4 py-2 rounded-xl">
                    <Star className="h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 text-healio-orange flex-shrink-0" />
                    <span>Terapeuți verificați</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 justify-center max-w-xs sm:max-w-md mx-auto md:max-w-none md:flex-row px-1 sm:px-2 hero-animate-cta">
                  <Button 
                    size="lg" 
                    className="cta-premium text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg py-3 px-4 sm:px-6"
                  >
                    <Users className="mr-1 sm:mr-2 h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 flex-shrink-0" />
                    <span className="truncate">Vorbește cu terapeut ACUM</span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="btn-skeuomorphic text-xs sm:text-sm md:text-base lg:text-lg px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-4 text-healio-orange hover:text-white font-medium rounded-2xl"
                  >
                    <Heart className="mr-1 sm:mr-2 h-3 sm:h-4 md:h-5 w-3 sm:w-4 md:w-5 flex-shrink-0" />
                    <span className="truncate">Alătură-te comunității</span>
                  </Button>
                </div>
                
                <p className="text-xs md:text-sm hero-proof-text mt-6 md:mt-8 hero-subheadline hero-animate-cta neuro-inset-deep px-4 py-2 rounded-full inline-block">
                  <strong className="hero-headline">Peste 10.000+ români</strong> și-au regăsit echilibrul cu ajutorul Healio
                </p>
                </div>
              </PuzzleCard>
            </PuzzleGrid>
          </div>
        </div>
      </section>

      {/* Beautiful Cloud Animation Section */}
      <section className="py-8 text-center">
        <CloudNodes />
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 relative overflow-hidden neuro-background texture-paper">
        <ConnectedParticles />
        <div className="container mx-auto max-w-6xl relative z-10 neuro-inset-deep p-4 sm:p-6 md:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-background/40 backdrop-blur-sm">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-playfair font-bold mb-2 sm:mb-3 md:mb-4">
              Terapeutul perfect te așteaptă
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0">
              Nu mai pierde timpul cu căutări nesfârșite. Terapeuții noștri sunt 
              <strong> licențiați, verificați și specializați</strong> în ceea ce ai nevoie. 
              <span className="text-healio-turquoise">Prima consultație poate fi chiar azi.</span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 mb-4 sm:mb-6 md:mb-8 justify-center px-2">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
              <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Caută</span>
              <span className="sm:hidden">Caută</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
              <Filter className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Specializare</span>
              <span className="sm:hidden">Filtru</span>
            </Button>
            <Badge variant="secondary" className="bg-healio-orange text-xs px-2 py-1">Anxietate</Badge>
            <Badge variant="secondary" className="bg-healio-orange text-xs px-2 py-1">Depresie</Badge>
            <Badge variant="secondary" className="bg-healio-orange text-xs px-2 py-1">Stres</Badge>
            <Badge variant="secondary" className="bg-healio-orange text-xs px-2 py-1">Relații</Badge>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Se încarcă terapeuții...</p>
            </div>
          ) : (
            <PuzzleGrid>
              {therapists.map((therapist, index) => (
                <PuzzleCard 
                  key={therapist.id} 
                  size={index === 0 ? '2x1' : index === 1 ? '1x2' : '1x1'}
                  className="relative group"
                >
                  {isAdmin && !adminLoading && (
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditTherapist(therapist)}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTherapist(therapist.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  <TherapistCard 
                    therapist={{
                      id: therapist.id,
                      name: therapist.name,
                      avatar: therapist.avatar_url || therapist1,
                      specialization: therapist.specialization,
                      rating: therapist.rating || 0,
                      reviewCount: therapist.review_count || 0,
                      price: `${therapist.price} lei`,
                      languages: therapist.languages || ['Română'],
                      availability: therapist.availability || 'Disponibil',
                      bio: therapist.bio
                    }} 
                    size={index === 0 ? '2x1' : index === 1 ? '1x2' : '1x1'}
                  />
                </PuzzleCard>
              ))}
              
              {/* Add more therapist placeholder cards */}
              <PuzzleCard size="1x1" variant="mint">
                <div className="p-4 text-center">
                  <Plus className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 text-healio-mint-foreground/60" />
                  <p className="text-xs md:text-sm font-medium">Vezi mai mulți terapeuți</p>
                </div>
              </PuzzleCard>
            </PuzzleGrid>
          )}
        </div>

        {/* Edit Therapist Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editează Terapeut</DialogTitle>
            </DialogHeader>
            {editingTherapist && (
              <form onSubmit={handleSaveTherapist} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={editingTherapist.name}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specializare</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    defaultValue={editingTherapist.specialization}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Preț (lei)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={editingTherapist.price}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">URL Avatar</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    defaultValue={editingTherapist.avatar_url || ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="availability">Disponibilitate</Label>
                  <Input
                    id="availability"
                    name="availability"
                    defaultValue={editingTherapist.availability || ''}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languages">Limbi (separate prin virgulă)</Label>
                  <Input
                    id="languages"
                    name="languages"
                    defaultValue={editingTherapist.languages?.join(', ') || 'Română'}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      name="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      defaultValue={editingTherapist.rating || 0}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="review_count">Nr. Recenzii</Label>
                    <Input
                      id="review_count"
                      name="review_count"
                      type="number"
                      min="0"
                      defaultValue={editingTherapist.review_count || 0}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografie</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={editingTherapist.bio || ''}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Anulează
                  </Button>
                  <Button type="submit" className="bg-healio-orange hover:bg-healio-orange/90">
                    <Save className="h-4 w-4 mr-2" />
                    Salvează
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* Community Feed Section */}
      <section id="community" className="py-8 sm:py-12 md:py-16 px-3 sm:px-4 bg-[#f0f0f3] relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 bg-[#f0f0f3] rounded-[20px] p-4 sm:p-6 md:p-8 shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] mx-2 sm:mx-4">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-inter font-light mb-2 sm:mb-3 md:mb-4 text-[#5a5a5a]">
              Aici nu ești singur cu gândurile tale
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#7a7a7a] max-w-2xl mx-auto font-light px-2 sm:px-0">
              <span className="font-normal">Mii de români ca tine</span> își împărtășesc zilnic experiențele, 
              primesc sprijin și se vindecă împreună. 
              <span className="text-[#6a8a7a] font-normal">Anonimitatea ta este protejată 100%.</span>
            </p>
          </div>

          <PuzzleGrid>
            {/* Write post CTA */}
            <PuzzleCard size="2x1" className="bg-[#f0f0f3] rounded-[20px] shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] border-0">
              <div className="p-3 sm:p-4 md:p-6 text-center">
                <h3 className="text-base sm:text-lg md:text-xl font-inter font-light mb-2 md:mb-3 text-[#5a5a5a]">
                  Ce simți chiar acum? Spune-ne...
                </h3>
                <p className="text-xs sm:text-sm text-[#7a7a7a] mb-3 md:mb-4 font-light px-2 sm:px-0">
                  Comunitatea noastră te ascultă fără să te judece. 
                  <span className="font-normal">Primul pas către vindecare e să vorbești.</span>
                </p>
                <button className="bg-[#f0f0f3] text-[#5a5a5a] font-normal text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all duration-200 flex items-center gap-1 sm:gap-2 mx-auto">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Începe să vorbești</span>
                  <span className="sm:hidden">Vorbește</span>
                </button>
              </div>
            </PuzzleCard>

            {communityPosts.map((post, index) => {
              return (
                <PuzzleCard 
                  key={post.id}
                  size={
                    index === 0 ? '2x2' : 
                    index === 1 ? '1x1' : 
                    index === 2 ? '2x1' : '1x2'
                  }
                  className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-[20px] border-0 shadow-[8px_8px_16px_rgba(254,215,170,0.3),-8px_-8px_16px_rgba(255,255,255,0.8)]"
                >
                <div className="p-4 md:p-6 h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-[#f0f0f3] rounded-full shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] flex items-center justify-center flex-shrink-0">
                      <div className="w-4 h-4 bg-[#e5e5e8] rounded-full shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff]"></div>
                    </div>
                    <div>
                      <div className="font-inter font-normal text-[#5a5a5a] text-sm">{post.author}</div>
                      <div className="text-xs text-[#8a8a8a] font-light">{post.timestamp}</div>
                    </div>
                  </div>
                  
                  <p className="text-[#6a6a6a] font-light text-sm md:text-base leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {Object.entries(post.reactions).map(([reaction, count]) => (
                      <button 
                        key={reaction}
                        className="bg-[#f0f0f3] text-[#7a7a7a] px-3 py-1 rounded-[8px] text-xs font-light shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] hover:shadow-[1px_1px_2px_#d1d1d4,-1px_-1px_2px_#ffffff] transition-all duration-150"
                      >
                        {reaction === 'hug' && '🤗'} 
                        {reaction === 'growth' && '🌱'} 
                        {reaction === 'strength' && '💪'} 
                        {reaction === 'insight' && '💡'} 
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                </PuzzleCard>
              );
            })}
          </PuzzleGrid>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 px-4 relative" style={{ backgroundColor: '#F4E4D1' }}>
        {/* Subtle noise texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.4"/></svg>')`
          }}
        ></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Înțelege-te mai bine cu resurse gratuite
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <strong>Cunoașterea de sine</strong> e primul pas spre vindecare. 
              Testele noastre validate științific și ghidurile practice te ajută să 
              <span className="text-healio-turquoise">descoperi ce ai cu adevărat nevoie.</span>
            </p>
          </div>

          <PuzzleGrid>
            <PuzzleCard size="1x2" variant="turquoise">
              <div className="p-6">
                <BookOpen className="w-8 h-8 mb-3 text-healio-turquoise-foreground" />
                <h3 className="text-lg font-playfair font-semibold mb-2">
                  Suferi de anxietate? Află acum!
                </h3>
                <p className="text-sm text-healio-turquoise-foreground/80 mb-4">
                  Test profesional de 5 minute care îți arată exact unde te afli și ce pași să faci.
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-healio-turquoise-foreground text-healio-turquoise-foreground hover:bg-healio-turquoise-foreground hover:text-healio-turquoise"
                >
                  Începe testul
                </Button>
              </div>
            </PuzzleCard>

            <PuzzleCard size="2x1">
              <div className="p-6">
                <h3 className="text-xl font-playfair font-semibold mb-3">
                  Stresul îți distruge viața? Nu mai lăsa!
                </h3>
                <p className="text-muted-foreground mb-4">
                  <strong>Ghidul complet</strong> cu 15+ tehnici dovedite științific pentru a-ți recâștiga controlul. 
                  Includes exerciții practice pentru rezultate imediate.
                </p>
                <Button size="sm">
                  Citește ghidul
                </Button>
              </div>
            </PuzzleCard>

            <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: '#F4E4D1' }}>
              <div className="p-6 flex flex-col items-center justify-center h-full">
                <img 
                  src="/lovable-uploads/2dba6fd7-ee5c-4ff2-8b80-6e85644344ba.png" 
                  alt="Confused person with questions"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <PuzzleCard size="1x1" variant="mint">
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">🧘‍♀️</div>
                <h4 className="font-medium mb-2">Micro-curs Mindfulness</h4>
                <p className="text-xs text-healio-mint-foreground/70">5 min/zi</p>
              </div>
            </PuzzleCard>
          </PuzzleGrid>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="relative overflow-hidden">
        {/* Gradient + noise background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F6FFF9] via-white to-[#FFF6FA]"></div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" 
             style={{
               backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.5"/></svg>')`
             }}>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Headings */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#2A2A2A] font-merriweather">
              Aici nu ești singur cu gândurile tale
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-[#4A4A4A]">
              Mii de români ca tine își împărtășesc zilnic experiențele, primesc sprijin și se vindecă împreună.
              <span className="bg-gradient-to-r from-[#4EC9B0] to-[#F6B26B] bg-clip-text text-transparent font-semibold italic">
                Anonimitatea ta este protejată 100%.
              </span>
            </p>
          </div>

          {/* CTA Card mare */}
          <div className="relative rounded-3xl bg-[#FFE4BE]/70 backdrop-blur-xl ring-1 ring-white/60 card-neuro hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 texture-fabric">
            {/* subtle inner border */}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none"></div>

            {/* glowing shapes pentru integrare */}
            <div className="absolute -z-10 -top-6 -left-6 h-28 w-28 rounded-full bg-[#9EF3E1] blur-3xl opacity-40"></div>
            <div className="absolute -z-10 -bottom-8 -right-8 h-32 w-32 rounded-full bg-[#FFD9C2] blur-3xl opacity-40"></div>

            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-[#2A2A2A] font-merriweather">Ce simți chiar acum? Spune‑ne…</h3>
              <p className="mt-3 text-base sm:text-lg text-[#5A5A5A]">
                Comunitatea noastră te ascultă fără să te judece.
                <span className="font-semibold text-[#2F2F2F]">Primul pas către vindecare</span> e să vorbești.
              </p>

              <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                {/* Buton primar */}
                <Button 
                  className="cta-premium text-white font-bold px-6 py-3 rounded-xl"
                >
                  <Plus className="w-5 h-5 mr-2" /> Începe să vorbești
                </Button>

                {/* Buton secundar (contur) */}
                <Button 
                  variant="outline"
                  className="btn-skeuomorphic text-[#1F3B3A] font-semibold px-6 py-3 rounded-xl"
                >
                  Vezi discuțiile
                </Button>
              </div>

              {/* Trust row */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#4A4A4A]">
                <div className="inline-flex items-center gap-2">
                  <span className="neuro-inset inline-flex h-8 w-8 items-center justify-center rounded-full text-xs">🔒</span>
                  Confidențial 100%
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="neuro-inset inline-flex h-8 w-8 items-center justify-center rounded-full text-xs">🕒</span>
                  Răspuns rapid
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="neuro-inset inline-flex h-8 w-8 items-center justify-center rounded-full text-xs">👥</span>
                  Fără judecăți
                </div>
              </div>
            </div>
          </div>

          {/* Grid postări */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Card postare 1 */}
            <article className="relative rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none"></div>
              <div className="p-6 sm:p-8">
                <header className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#C9F7EF] to-white ring-1 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]"></div>
                  <div>
                    <div className="font-semibold text-[#2A2A2A]">Anonim</div>
                    <div className="text-sm text-[#667085]">30 min</div>
                  </div>
                </header>
                <p className="text-[#3A3A3A]">Mă simt copleșit în ultima vreme. Mi-e teamă să vorbesc cu ai mei despre asta…</p>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="link" className="text-sm font-semibold text-[#1B6E66] hover:underline p-0">
                    Vezi discuția
                  </Button>
                  <div className="text-sm text-[#667085]">23 răspunsuri</div>
                </div>
              </div>
            </article>

            {/* Card postare 2 */}
            <article className="relative rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none"></div>
              <div className="p-6 sm:p-8">
                <header className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFE4BE] to-white ring-1 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]"></div>
                  <div>
                    <div className="font-semibold text-[#2A2A2A]">Anonim</div>
                    <div className="text-sm text-[#667085]">2h</div>
                  </div>
                </header>
                <p className="text-[#3A3A3A]">Am început terapia acum 2 luni și pot spune că e cea mai bună decizie pe care am luat-o. Mulțumesc tuturor pentru curaj!</p>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="link" className="text-sm font-semibold text-[#1B6E66] hover:underline p-0">
                    Vezi discuția
                  </Button>
                  <div className="text-sm text-[#667085]">47 răspunsuri</div>
                </div>
              </div>
            </article>

            {/* Card postare 3 */}
            <article className="relative rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none"></div>
              <div className="p-6 sm:p-8">
                <header className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#E0F2FE] to-white ring-1 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]"></div>
                  <div>
                    <div className="font-semibold text-[#2A2A2A]">Anonim</div>
                    <div className="text-sm text-[#667085]">4h</div>
                  </div>
                </header>
                <p className="text-[#3A3A3A]">Cum gestionați anxietatea înainte de întâlniri importante? Căutam strategii practice care chiar funcționează.</p>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="link" className="text-sm font-semibold text-[#1B6E66] hover:underline p-0">
                    Vezi discuția
                  </Button>
                  <div className="text-sm text-[#667085]">15 răspunsuri</div>
                </div>
              </div>
            </article>

            {/* Card postare 4 */}
            <article className="relative rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute inset-0 rounded-3xl ring-1 ring-black/5 pointer-events-none"></div>
              <div className="p-6 sm:p-8">
                <header className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F0FDF4] to-white ring-1 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]"></div>
                  <div>
                    <div className="font-semibold text-[#2A2A2A]">Anonim</div>
                    <div className="text-sm text-[#667085]">1 zi</div>
                  </div>
                </header>
                <p className="text-[#3A3A3A]">Pentru cei care se gândesc să înceapă terapia: merită fiecare sesiune. Să nu vă fie teamă să faceți primul pas.</p>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="link" className="text-sm font-semibold text-[#1B6E66] hover:underline p-0">
                    Vezi discuția
                  </Button>
                  <div className="text-sm text-[#667085]">89 răspunsuri</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-healio-turquoise rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-healio-turquoise-foreground" />
                </div>
                <h2 className="text-2xl font-playfair font-bold">Healio</h2>
              </div>
              
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Platforma digitală de sănătate mentală din România care combină terapia profesională cu 
                căldura unei comunități de suport.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-healio-turquoise" />
                  <span>+40 21 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-healio-turquoise" />
                  <span>contact@healio.ro</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-healio-turquoise" />
                  <span>București, România</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-8 h-8 bg-healio-mint/20 rounded-full flex items-center justify-center hover:bg-healio-mint/40 transition-colors">
                  <Facebook className="w-4 h-4 text-healio-mint-foreground" />
                </a>
                <a href="#" className="w-8 h-8 bg-healio-mint/20 rounded-full flex items-center justify-center hover:bg-healio-mint/40 transition-colors">
                  <Instagram className="w-4 h-4 text-healio-mint-foreground" />
                </a>
                <a href="#" className="w-8 h-8 bg-healio-mint/20 rounded-full flex items-center justify-center hover:bg-healio-mint/40 transition-colors">
                  <Linkedin className="w-4 h-4 text-healio-mint-foreground" />
                </a>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="font-playfair font-semibold text-lg mb-4">Servicii</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Terapie Online</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Comunitate</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Resurse Educaționale</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Evenimente & Workshop-uri</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Pentru Companii</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-playfair font-semibold text-lg mb-4">Suport</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Centru de Ajutor</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Întrebări Frecvente</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Feedback</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Raportează o Problemă</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="font-playfair font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Termeni și Condiții</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Politica de Confidențialitate</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Politica Cookie</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">GDPR</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-healio-turquoise transition-colors">Cod de Conduită</a></li>
              </ul>
            </div>
          </div>
          
          {/* Emergency Section */}
          <div className="border-t border-border pt-8 mb-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border-l-4 border-red-400">
              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-playfair font-semibold text-lg text-red-700 mb-2">
                    Urgență Psihiatrică
                  </h4>
                  <p className="text-sm text-red-600 mb-3">
                    Dacă ești în criză sau ai gânduri suicidale, contactează imediat: 
                    <span className="font-bold text-red-500"> 0800 801 200</span> (Telefonul Vieții) sau 
                    <span className="font-bold text-red-500"> 112</span> pentru urgențe.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 Healio. Toate drepturile rezervate.
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Certificat de</span>
              <div className="flex items-center gap-1 text-healio-turquoise font-medium">
                <Heart className="w-4 h-4" />
                <span>Colegiul Psihologilor din România</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
