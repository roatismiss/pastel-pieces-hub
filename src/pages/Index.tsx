import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PuzzleGrid, PuzzleCard } from '@/components/PuzzleGrid';
import { TherapistCard } from '@/components/TherapistCard';
import { CommunityCard } from '@/components/CommunityCard';
import { FloatingNodes } from '@/components/FloatingNodes';
import ConnectedParticles from '@/components/ConnectedParticles';
import CloudNodes from '@/components/CloudNodes';
import { Link } from 'react-router-dom';
import { Search, Filter, Users, BookOpen, Calendar, Heart, Plus, Shield, Clock, Star, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

import heroImage from '@/assets/hero-healio.jpg';
import therapist1 from '@/assets/therapist-1.jpg';
import therapist2 from '@/assets/therapist-2.jpg';
import therapist3 from '@/assets/therapist-3.jpg';

const Index = () => {
  console.log('Index component is rendering');
  
  const therapists = [
    {
      id: '1',
      name: 'Dr. Ana Popescu',
      avatar: therapist1,
      specialization: 'Anxietate și Depresie',
      rating: 4.9,
      reviewCount: 127,
      price: '200 lei',
      languages: ['Română', 'Engleză'],
      availability: 'Disponibilă azi',
      bio: 'Experiență de 15 ani în terapia cognitiv-comportamentală. Specialist în anxietate, depresie și tulburări de stres post-traumatic.'
    },
    {
      id: '2', 
      name: 'Psih. Mihai Ionescu',
      avatar: therapist2,
      specialization: 'Terapie de Cuplu',
      rating: 4.8,
      reviewCount: 89,
      price: '180 lei',
      languages: ['Română'],
      availability: 'Disponibil mâine',
      bio: 'Psiholog clinician cu focalizare pe relații și comunicare în cuplu. Abordare sistemică și humanistă.'
    },
    {
      id: '3',
      name: 'Dr. Elena Radu',
      avatar: therapist3,
      specialization: 'Mindfulness și Stres',
      rating: 5.0,
      reviewCount: 203,
      price: '220 lei',
      languages: ['Română', 'Engleză', 'Germană'],
      availability: 'Disponibilă acum',
      bio: 'Expert în tehnici de mindfulness și gestionarea stresului. Combină terapia tradițională cu practici meditative.'
    }
  ];

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
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="relative group">
                <h1 className="text-2xl md:text-4xl font-orbitron font-black animated-gradient-text animate-logo-bounce hover:animate-logo-glow cursor-pointer transition-all duration-1000 drop-shadow-2xl">
                  <span className="inline-block animate-letter-dance" style={{ animationDelay: '0s' }}>H</span>
                  <span className="inline-block animate-letter-dance" style={{ animationDelay: '1s' }}>e</span>
                  <span className="inline-block animate-letter-dance" style={{ animationDelay: '2s' }}>a</span>
                  <span className="inline-block animate-letter-dance" style={{ animationDelay: '3s' }}>l</span>
                  <span className="inline-block animate-letter-dance" style={{ animationDelay: '4s' }}>i</span>
                  <span className="inline-block animate-letter-dance" style={{ animationDelay: '5s' }}>o</span>
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-healio-orange/20 via-healio-turquoise/20 to-healio-mint/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-1000 -z-10 blur-2xl animate-gradient-shift"></div>
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
      <section className="py-12 md:py-20 px-4 relative hero-background">
        <div className="container mx-auto max-w-6xl">
          <PuzzleGrid className="gap-4 md:gap-6">
            <PuzzleCard size="2x2" className="hero-glass-card flex items-center justify-center relative overflow-hidden min-h-[500px] md:min-h-[600px]">
              <FloatingNodes />
              <img 
                src={heroImage} 
                alt="Healio - Echilibru interior"
                className="absolute inset-0 w-full h-full object-cover opacity-5"
              />
              <div className="relative z-10 text-center p-6 md:p-10">
                <div className="mb-6 md:mb-8">
                  <Badge className="hero-badge text-white mb-4 text-xs md:text-sm px-4 py-2 hero-animate-headline">
                    ✨ Platforma #1 pentru sănătatea mentală în România
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-merriweather hero-headline mb-6 md:mb-8 leading-tight hero-animate-headline">
                  Nu mai suferi în 
                  <span className="hero-gradient-text"> tăcere</span>
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Găsește-ți echilibrul cu Healio
                </h1>
                <p className="text-sm sm:text-base md:text-xl hero-subheadline mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 hero-animate-subheadline">
                  <strong className="hero-headline">Știm că e greu să ceri ajutor.</strong> De aceea am creat Healio - locul unde găsești 
                  rapid terapeuți licențiați de încredere și o comunitate care te înțelege cu adevărat. 
                  <span className="hero-gradient-text font-medium italic">Fără judecăți. Doar sprijin.</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 text-sm hero-proof-text hero-animate-subheadline">
                  <div className="flex items-center gap-2 justify-center hero-subheadline">
                    <Shield className="h-4 md:h-5 w-4 md:w-5 text-healio-turquoise flex-shrink-0" />
                    <span>100% Confidențial</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center hero-subheadline">
                    <Clock className="h-4 md:h-5 w-4 md:w-5 text-healio-mint flex-shrink-0" />
                    <span>Disponibil 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center hero-subheadline">
                    <Star className="h-4 md:h-5 w-4 md:w-5 text-healio-orange flex-shrink-0" />
                    <span>Terapeuți verificați</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 md:gap-6 justify-center max-w-md mx-auto md:max-w-none md:flex-row px-2 hero-animate-cta">
                  <Button 
                    size="lg" 
                    className="hero-cta-primary text-sm sm:text-base md:text-lg"
                  >
                    <Users className="mr-2 h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
                    <span className="truncate">Vorbește cu terapeut ACUM</span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 border-2 border-healio-orange text-healio-orange hover:bg-healio-orange hover:text-white shadow-lg hover:shadow-xl transition-all w-full md:w-auto rounded-2xl font-medium"
                  >
                    <Heart className="mr-2 h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
                    <span className="truncate">Alătură-te comunității</span>
                  </Button>
                </div>
                
                <p className="text-xs md:text-sm hero-proof-text mt-6 md:mt-8 hero-subheadline hero-animate-cta">
                  <strong className="hero-headline">Peste 10.000+ români</strong> și-au regăsit echilibrul cu ajutorul Healio
                </p>
              </div>
            </PuzzleCard>
          </PuzzleGrid>
        </div>
      </section>

      {/* Beautiful Cloud Animation Section */}
      <section className="py-8 text-center">
        <CloudNodes />
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-12 md:py-16 px-4 bg-muted/30 relative overflow-hidden">
        <ConnectedParticles />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3 md:mb-4">
              Terapeutul perfect te așteaptă
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Nu mai pierde timpul cu căutări nesfârșite. Terapeuții noștri sunt 
              <strong> licențiați, verificați și specializați</strong> în ceea ce ai nevoie. 
              <span className="text-healio-turquoise">Prima consultație poate fi chiar azi.</span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Search className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Caută
            </Button>
            <Button variant="outline" size="sm" className="text-xs md:text-sm">
              <Filter className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              Specializare
            </Button>
            <Badge variant="secondary" className="bg-healio-orange text-xs rounded-none">Anxietate</Badge>
            <Badge variant="secondary" className="bg-healio-orange text-xs rounded-none">Depresie</Badge>
            <Badge variant="secondary" className="bg-healio-orange text-xs rounded-none">Stres</Badge>
            <Badge variant="secondary" className="bg-healio-orange text-xs rounded-none">Relații</Badge>
          </div>

          <PuzzleGrid>
            {therapists.map((therapist, index) => (
              <PuzzleCard 
                key={therapist.id} 
                size={index === 0 ? '2x1' : index === 1 ? '1x2' : '1x1'}
              >
                <TherapistCard 
                  therapist={therapist} 
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
        </div>
      </section>

      {/* Community Feed Section */}
      <section id="community" className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3 md:mb-4">
              Aici nu ești singur cu gândurile tale
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              <strong>Mii de români ca tine</strong> își împărtășesc zilnic experiențele, 
              primesc sprijin și se vindecă împreună. 
              <span className="text-healio-mint">Anonimitatea ta este protejată 100%.</span>
            </p>
          </div>

          <PuzzleGrid>
            {/* Write post CTA */}
            <PuzzleCard size="2x1" variant="orange">
              <div className="p-4 md:p-6 text-center">
                <h3 className="text-lg md:text-xl font-playfair font-semibold mb-2 md:mb-3">
                  Ce simți chiar acum? Spune-ne...
                </h3>
                <p className="text-xs md:text-sm text-healio-orange-foreground/80 mb-3 md:mb-4">
                  Comunitatea noastră te ascultă fără să te judece. 
                  <strong>Primul pas către vindecare e să vorbești.</strong>
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-healio-orange-foreground text-healio-orange-foreground hover:bg-healio-orange-foreground hover:text-healio-orange text-xs md:text-sm"
                >
                  <Plus className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  Începe să vorbești
                </Button>
              </div>
            </PuzzleCard>

            {communityPosts.map((post, index) => (
              <PuzzleCard 
                key={post.id}
                size={
                  index === 0 ? '2x2' : 
                  index === 1 ? '1x1' : 
                  index === 2 ? '2x1' : '1x2'
                }
                variant={
                  index === 1 ? 'turquoise' :
                  index === 2 ? 'mint' : 'default'
                }
              >
                <CommunityCard 
                  post={post}
                  size={
                    index === 0 ? '2x2' : 
                    index === 1 ? '1x1' : 
                    index === 2 ? '2x1' : '1x2'
                  }
                />
              </PuzzleCard>
            ))}
          </PuzzleGrid>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
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

      {/* Events Section */}
      <section id="events" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold mb-4">
              Nu mai trece prin asta singur
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <strong>Grupurile noastre de sprijin</strong> te conectează cu oameni care înțeleg exact prin ce treci. 
              <span className="text-healio-orange">Vindecarea e mai rapidă când nu ești singur.</span>
            </p>
          </div>

          <PuzzleGrid>
            <PuzzleCard size="2x2" variant="orange">
              <div className="p-6">
                <Calendar className="w-8 h-8 mb-3 text-healio-orange-foreground" />
                <h3 className="text-2xl font-playfair font-semibold mb-3">
                  💬 Grup Anxietate: "Nu ești nebun, doar ai nevoie de ajutor"
                </h3>
                <p className="text-healio-orange-foreground/80 mb-4">
                  <strong>Miercuri, 20:00 - 21:30</strong><br />
                  Moderator: Dr. Ana Popescu (Psiholog Clinician)
                </p>
                <p className="text-sm text-healio-orange-foreground/70 mb-4">
                  <strong>"M-am simțit înțeles pentru prima dată"</strong> - Maria, 32 ani<br />
                  Un spațiu unde poți vorbi liber despre frici, atacuri de panică și gânduri negative.
                </p>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-healio-orange-foreground text-healio-orange-foreground hover:bg-healio-orange-foreground hover:text-healio-orange font-medium"
                >
                  Salvează-mi locul GRATUIT
                </Button>
              </div>
            </PuzzleCard>

            <PuzzleCard size="1x1" variant="turquoise">
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">📅</div>
                <h4 className="font-medium mb-2">Workshop Mindfulness</h4>
                <p className="text-xs text-healio-turquoise-foreground/70">Sâmbătă, 10:00</p>
              </div>
            </PuzzleCard>

            <PuzzleCard size="1x1" variant="mint">
              <div className="p-4 text-center">
                <div className="text-2xl mb-2">💬</div>
                <h4 className="font-medium mb-2">Cerc de povești</h4>
                <p className="text-xs text-healio-mint-foreground/70">Duminică, 19:00</p>
              </div>
            </PuzzleCard>
          </PuzzleGrid>
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
