import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Play, Clock, Users, Star, Download, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Education = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const courses = [
    {
      id: 1,
      title: "Gestionarea anxietății în viața de zi cu zi",
      description: "Învață tehnici practice pentru controlul anxietății și îmbunătățirea stării de bine",
      duration: "45 min",
      lessons: 8,
      rating: 4.9,
      students: 1247,
      difficulty: "Începător",
      topics: ["Tehnici de respirație", "Mindfulness", "Gândire pozitivă", "Relaxare progresivă"],
      instructor: "Dr. Elena Popescu",
      image: "/lovable-uploads/de5aff26-29e2-47dd-b70f-bb052623d1ae.png"
    },
    {
      id: 2,
      title: "Comunicare eficientă în relații",
      description: "Dezvoltă abilități de comunicare pentru relații mai sănătoase și mai fericite",
      duration: "60 min",
      lessons: 12,
      rating: 4.8,
      students: 892,
      difficulty: "Intermediar",
      topics: ["Ascultare activă", "Exprimarea emoțiilor", "Rezolvarea conflictelor", "Empatie"],
      instructor: "Psih. Maria Ionescu",
      image: "/lovable-uploads/9d69c4a6-b602-444b-a872-cf5dbcb40af2.png"
    },
    {
      id: 3,
      title: "Construirea încrederii în sine",
      description: "Un ghid complet pentru dezvoltarea unei încrederi autentice și durabile în sine",
      duration: "90 min",
      lessons: 15,
      rating: 4.9,
      students: 2156,
      difficulty: "Toate nivelurile",
      topics: ["Autocunoaștere", "Vorbire pozitivă", "Stabilirea limitelor", "Atingerea obiectivelor"],
      instructor: "Dr. Alexandru Radu",
      image: "/lovable-uploads/22468ab0-12dc-4c52-b455-a825e61d061d.png"
    }
  ];

  const articles = [
    {
      id: 1,
      title: "5 semne că ai nevoie de ajutor profesional pentru sănătatea mentală",
      excerpt: "Recunoașterea semnelor timpurii poate face diferența în procesul de vindecare.",
      readTime: "5 min",
      author: "Dr. Carmen Dobre",
      category: "Ghiduri",
      image: "/lovable-uploads/5681b338-11b2-4ffe-8f13-36d8e8681936.png"
    },
    {
      id: 2,
      title: "Cum să îți creezi o rutină de îngrijire personală eficientă",
      excerpt: "Pași simpli pentru a integra îngrijirea personală în programul zilnic aglomerat.",
      readTime: "7 min",
      author: "Psih. Ana Matei",
      category: "Wellness",
      image: "/lovable-uploads/047bebca-e8da-4d8c-83e5-7c166829fa57.png"
    },
    {
      id: 3,
      title: "Diferența dintre tristețe normală și depresie",
      excerpt: "Învață să identifici când tristețea devine o problemă care necesită atenție profesională.",
      readTime: "6 min",
      author: "Dr. Radu Cristescu",
      category: "Educație",
      image: "/lovable-uploads/2dba6fd7-ee5c-4ff2-8b80-6e85644344ba.png"
    }
  ];

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
              <Link to="/therapists" className="text-sm hover:text-primary transition-colors">
                Terapeuți
              </Link>
              <Link to="/community" className="text-sm hover:text-primary transition-colors">
                Comunitate
              </Link>
              <Link to="/events" className="text-sm hover:text-primary transition-colors">
                Evenimente
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Educație pentru Sănătatea Mentală
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Micro-cursuri și ghiduri create de specialiști pentru a-ți îmbunătăți starea de bine și a învăța tehnici eficiente de gestionare a stresului și emoțiilor.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Cursuri</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5000+</div>
              <div className="text-sm text-muted-foreground">Studenți</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9</div>
              <div className="text-sm text-muted-foreground">Rating mediu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="courses" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="courses">Micro-cursuri</TabsTrigger>
              <TabsTrigger value="articles">Articole & Ghiduri</TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Micro-cursuri Interactive</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Cursuri scurte și practice, create de psihologi licențiați, pentru a-ți dezvolta abilitățile de gestionare a stresului și îmbunătățire a stării de bine.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="sm" className="bg-white text-black hover:bg-white/90">
                          <Play className="h-4 w-4 mr-2" />
                          Previzualizare
                        </Button>
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary" className="mb-2">{course.difficulty}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.lessons} lecții
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.students}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Ce vei învăța:</p>
                        <ul className="text-sm space-y-1">
                          {course.topics.slice(0, 3).map((topic, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-3">Instructor: {course.instructor}</p>
                        <Button className="w-full" onClick={() => user ? null : navigate('/auth')}>
                          {user ? 'Începe cursul' : 'Conectează-te pentru acces'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Articole și Ghiduri</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Citește articole scrise de specialiști în domeniul sănătății mentale, cu sfaturi practice și informații validate științific.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{article.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">{article.title}</CardTitle>
                      <CardDescription>{article.excerpt}</CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">de {article.author}</span>
                        <Button variant="ghost" size="sm">
                          Citește
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Descarcă ghidul complet PDF
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Education;