import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, MapPin, Video, Star, Heart, ArrowRight, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      title: "Workshop: Gestionarea Anxietății în Relații",
      description: "Un workshop interactiv despre cum să gestionezi anxietatea în relațiile personale și profesionale.",
      date: new Date('2024-09-15T18:00:00'),
      duration: 120,
      type: "Workshop",
      location: "Online - Zoom",
      price: 0,
      maxParticipants: 50,
      currentParticipants: 32,
      instructor: "Dr. Elena Popescu",
      instructorTitle: "Psiholog Clinician",
      topics: ["Tehnici de relaxare", "Comunicare asertivă", "Exerciții practice"],
      image: "/lovable-uploads/2f23c86b-f384-4477-b093-0ff44afe7db4.png"
    },
    {
      id: 2,
      title: "Grupul de Suport: Depășirea Pierderii",
      description: "Un grup de suport pentru persoanele care traversează o perioadă de doliu sau pierdere.",
      date: new Date('2024-09-18T19:30:00'),
      duration: 90,
      type: "Grup de suport",
      location: "Clinica Healio, București",
      price: 45,
      maxParticipants: 12,
      currentParticipants: 8,
      instructor: "Psih. Maria Ionescu",
      instructorTitle: "Terapeut specializat în doliu",
      topics: ["Procesul de doliu", "Strategii de coping", "Reconstrucție emoțională"],
      image: "/lovable-uploads/0f800fd3-d5bc-4775-8c5c-5f7b5f983b29.png"
    },
    {
      id: 3,
      title: "Seminarul: Mindfulness și Meditație",
      description: "Învață tehnici de mindfulness și meditație pentru reducerea stresului și îmbunătățirea focusului.",
      date: new Date('2024-09-22T10:00:00'),
      duration: 180,
      type: "Seminar",
      location: "Online - Zoom",
      price: 75,
      maxParticipants: 100,
      currentParticipants: 67,
      instructor: "Dr. Alexandru Radu",
      instructorTitle: "Specialist în Mindfulness",
      topics: ["Introducere în mindfulness", "Exerciții de respirație", "Meditația zilnică"],
      image: "/lovable-uploads/7890c7da-c90c-400a-acaf-ecaeaa15124d.png"
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "Conferința: Sănătatea Mentală în Era Digitală",
      description: "O conferință despre impactul tehnologiei asupra sănătății mentale și strategii de protejare.",
      date: new Date('2024-08-25T14:00:00'),
      duration: 240,
      type: "Conferință",
      location: "Hotel Intercontinental, București",
      participants: 250,
      rating: 4.8,
      recording: true,
      image: "/lovable-uploads/6ed05d7b-90e4-4456-8436-214acc0c14a3.png"
    },
    {
      id: 5,
      title: "Workshop: Comunicare Nonviolentă",
      description: "Tehnici de comunicare pentru relații mai sănătoase în familie și la serviciu.",
      date: new Date('2024-08-20T17:00:00'),
      duration: 150,
      type: "Workshop",
      location: "Online - Zoom",
      participants: 85,
      rating: 4.9,
      recording: true,
      image: "/lovable-uploads/04188e45-459c-4460-9ceb-204a5bd38ec3.png"
    }
  ];

  const formatEventDate = (date: Date) => {
    return format(date, "d MMMM yyyy, HH:mm", { locale: ro });
  };

  const getAvailableSpots = (max: number, current: number) => {
    return max - current;
  };

  const isEventFull = (max: number, current: number) => {
    return current >= max;
  };

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
              <Link to="/education" className="text-sm hover:text-primary transition-colors">
                Educație
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
            Evenimente și Workshop-uri
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Participă la evenimente interactive organizate de specialiștii noștri. Workshop-uri, grupuri de suport și conferințe pentru dezvoltarea personală și îmbunătățirea stării de bine.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Evenimente/lună</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Participanți activi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-sm text-muted-foreground">Rating mediu</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="upcoming">Evenimente viitoare</TabsTrigger>
              <TabsTrigger value="past">Evenimente trecute</TabsTrigger>
            </TabsList>

            {/* Upcoming Events */}
            <TabsContent value="upcoming" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Evenimente Viitoare</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Înscrie-te la următoarele evenimente organizate de specialiștii Healio pentru a-ți dezvolta abilitățile de gestionare emoțională și a te conecta cu persoane cu interese similare.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground">{event.type}</Badge>
                      </div>
                      {event.price === 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500 text-white">GRATUIT</Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.duration} minute
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {event.location.includes('Online') ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.currentParticipants}/{event.maxParticipants} participanți
                        </div>
                      </div>

                      {event.price > 0 && (
                        <div className="text-xl font-bold text-primary">
                          {event.price} RON
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Instructor:</p>
                        <p className="text-sm text-muted-foreground">
                          {event.instructor} - {event.instructorTitle}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Subiecte abordate:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.topics.map((topic, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        {isEventFull(event.maxParticipants, event.currentParticipants) ? (
                          <Button className="w-full" disabled>
                            Complet
                          </Button>
                        ) : (
                          <div className="space-y-2">
                            <Button 
                              className="w-full" 
                              onClick={() => user ? null : navigate('/auth')}
                            >
                              {user ? 'Înscrie-te' : 'Conectează-te pentru înscriere'}
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                              {getAvailableSpots(event.maxParticipants, event.currentParticipants)} locuri disponibile
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Past Events */}
            <TabsContent value="past" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Evenimente Trecute</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Explorează înregistrările evenimentelor anterioare și descarcă materialele educaționale pentru a continua să înveți în propriul ritm.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                      {event.recording && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-blue-500 text-white">
                            <Video className="h-3 w-3 mr-1" />
                            Înregistrat
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                      <CardDescription>{event.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatEventDate(event.date)}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.duration} minute
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.participants} participanți
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{event.rating}</span>
                        </div>
                      </div>

                      <div className="pt-2 space-y-2">
                        {event.recording ? (
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => user ? null : navigate('/auth')}
                          >
                            {user ? 'Vezi înregistrarea' : 'Conectează-te pentru acces'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <Button className="w-full" disabled variant="outline">
                            Înregistrare indisponibilă
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto bg-primary/5">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-4">Vrei să organizezi un eveniment?</h3>
                <p className="text-muted-foreground mb-6">
                  Dacă ești terapeut și vrei să organizezi propriile tale evenimente pentru comunitatea Healio, ne-am bucura să colaborăm cu tine.
                </p>
                <Button 
                  size="lg"
                  onClick={() => user ? null : navigate('/auth')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {user ? 'Propune un eveniment' : 'Conectează-te pentru a propune'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;