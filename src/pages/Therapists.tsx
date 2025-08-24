import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TherapistCard } from '@/components/TherapistCard';
import { Search, Filter, MapPin, Star, Users, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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

const Therapists = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

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

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === 'all' || 
                                 therapist.specialization.toLowerCase().includes(selectedSpecialization.toLowerCase());
    
    const matchesPrice = priceRange === 'all' || 
                        (priceRange === 'low' && therapist.price <= 150) ||
                        (priceRange === 'medium' && therapist.price > 150 && therapist.price <= 250) ||
                        (priceRange === 'high' && therapist.price > 250);
    
    return matchesSearch && matchesSpecialization && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/36f9d7b1-e29b-41dd-aafa-520f8fff7482.png"
                alt="Healio Logo"
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm hover:text-primary transition-colors">
                Acasă
              </Link>
              <Link to="/community" className="text-sm hover:text-primary transition-colors">
                Comunitate
              </Link>
              <Link to="/education" className="text-sm hover:text-primary transition-colors">
                Educație
              </Link>
              <Link to="/events" className="text-sm hover:text-primary transition-colors">
                evenimente
              </Link>
              {user ? (
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </Button>
              ) : (
                <Button size="sm" asChild>
                  <Link to="/auth">Conectează-te</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Găsește terapeutul perfect pentru tine
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Toți terapeuții noștri sunt licențiați și verificați. Prima consultație poate fi chiar azi.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{therapists.length}+</div>
              <div className="text-sm text-muted-foreground">Terapeuți</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground">Rating mediu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Disponibilitate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Caută după nume sau specializare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Specializare" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate specializările</SelectItem>
                <SelectItem value="anxietate">Anxietate</SelectItem>
                <SelectItem value="depresie">Depresie</SelectItem>
                <SelectItem value="relatii">Relații</SelectItem>
                <SelectItem value="familie">Familie</SelectItem>
                <SelectItem value="trauma">Traumă</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Preț" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate prețurile</SelectItem>
                <SelectItem value="low">Sub 150 RON</SelectItem>
                <SelectItem value="medium">150-250 RON</SelectItem>
                <SelectItem value="high">Peste 250 RON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Căutare: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {selectedSpecialization !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Specializare: {selectedSpecialization}
                <button onClick={() => setSelectedSpecialization('all')} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Preț: {priceRange}
                <button onClick={() => setPriceRange('all')} className="ml-1 hover:bg-muted rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {filteredTherapists.length} terapeut{filteredTherapists.length !== 1 ? 'i' : ''} găsit{filteredTherapists.length !== 1 ? 'i' : ''}
            </p>
          </div>

          {/* Therapists Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTherapists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapists.map((therapist) => (
                <TherapistCard
                  key={therapist.id}
                  therapist={{
                    id: therapist.id,
                    name: therapist.name,
                    avatar: therapist.avatar_url || '/placeholder.svg',
                    specialization: therapist.specialization,
                    rating: therapist.rating || 0,
                    reviewCount: therapist.review_count || 0,
                    price: `${therapist.price} RON`,
                    languages: therapist.languages || [],
                    availability: therapist.availability || 'Disponibil',
                    bio: therapist.bio
                  }}
                  onClick={() => navigate(`/therapist/${therapist.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Nu s-au găsit terapeuți</h3>
                <p className="text-muted-foreground mb-4">
                  Încearcă să modifici filtrele de căutare pentru a găsi mai mulți terapeuți.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSpecialization('all');
                    setPriceRange('all');
                  }}
                >
                  Resetează filtrele
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Therapists;