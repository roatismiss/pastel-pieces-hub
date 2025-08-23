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
    <div className="min-h-screen bg-[#f0f0f3]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#f0f0f3] shadow-[0_4px_12px_rgba(209,209,212,0.5)] border-0">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <div className="relative">
                <h1 className="text-2xl md:text-4xl font-inter font-light text-[#5a5a5a] cursor-pointer transition-all duration-300">
                  Healio
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="#marketplace" className="text-sm font-light text-[#6a6a6a] hover:text-[#4a4a4a] transition-colors">
                  Terapeuți
                </a>
                <a href="#community" className="text-sm font-light text-[#6a6a6a] hover:text-[#4a4a4a] transition-colors">
                  Comunitate
                </a>
                <a href="#education" className="text-sm font-light text-[#6a6a6a] hover:text-[#4a4a4a] transition-colors">
                  Educație
                </a>
                <a href="#events" className="text-sm font-light text-[#6a6a6a] hover:text-[#4a4a4a] transition-colors">
                  Evenimente
                </a>
                <a href="/admin" className="text-sm font-light text-[#6a6a6a] hover:text-[#4a4a4a] transition-colors">
                  Admin
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button className="hidden sm:inline-flex bg-[#f0f0f3] text-[#6a6a6a] font-normal text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all duration-200">
                <Link to="/auth">Conectează-te</Link>
              </button>
              <button className="bg-[#f0f0f3] text-[#5a5a5a] font-normal text-xs md:text-sm px-3 md:px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all duration-200">
                <Link to="/auth">Începe acum</Link>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 bg-[#f0f0f3] relative">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-[#f0f0f3] rounded-[20px] p-8 md:p-12 shadow-[12px_12px_24px_#d1d1d4,-12px_-12px_24px_#ffffff] min-h-[500px] md:min-h-[600px] flex items-center justify-center relative overflow-hidden">
            <img 
              src={heroImage} 
              alt="Healio - Echilibru interior"
              className="absolute inset-0 w-full h-full object-cover opacity-10 rounded-[20px]"
            />
            <div className="relative z-10 text-center max-w-4xl">
              <div className="mb-6 md:mb-8">
                <div className="bg-[#f0f0f3] text-[#6a6a6a] mb-4 text-xs md:text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] inline-block font-light">
                  ✨ Platforma #1 pentru sănătatea mentală în România
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-inter font-light mb-6 md:mb-8 leading-tight text-[#5a5a5a]">
                Nu mai suferi în 
                <span className="font-normal text-[#4a4a4a]"> tăcere</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Găsește-ți echilibrul cu Healio
              </h1>
              <p className="text-sm sm:text-base md:text-xl mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2 text-[#6a6a6a] font-light">
                <span className="font-normal">Știm că e greu să ceri ajutor.</span> De aceea am creat Healio - locul unde găsești 
                rapid terapeuți licențiați de încredere și o comunitate care te înțelege cu adevărat. 
                <span className="text-[#4a4a4a] font-normal italic">Fără judecăți. Doar sprijin.</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 text-sm">
                <div className="flex items-center gap-2 justify-center bg-[#f0f0f3] px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] text-[#6a6a6a] font-light">
                  <Shield className="h-4 md:h-5 w-4 md:w-5 text-[#7a8a9a] flex-shrink-0" />
                  <span>100% Confidențial</span>
                </div>
                <div className="flex items-center gap-2 justify-center bg-[#f0f0f3] px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] text-[#6a6a6a] font-light">
                  <Clock className="h-4 md:h-5 w-4 md:w-5 text-[#8a9a7a] flex-shrink-0" />
                  <span>Disponibil 24/7</span>
                </div>
                <div className="flex items-center gap-2 justify-center bg-[#f0f0f3] px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] text-[#6a6a6a] font-light">
                  <Star className="h-4 md:h-5 w-4 md:w-5 text-[#9a8a7a] flex-shrink-0" />
                  <span>Terapeuți verificați</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 md:gap-6 justify-center max-w-md mx-auto md:max-w-none md:flex-row px-2">
                <button className="bg-[#f0f0f3] text-[#5a5a5a] font-normal text-sm sm:text-base md:text-lg px-6 py-3 rounded-[12px] shadow-[6px_6px_12px_#d1d1d4,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] transition-all duration-200 flex items-center justify-center gap-2">
                  <Users className="h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
                  <span className="truncate">Vorbește cu terapeut ACUM</span>
                </button>
                <button className="bg-[#f0f0f3] text-[#6a6a6a] font-light text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all duration-200 flex items-center justify-center gap-2">
                  <Heart className="h-4 md:h-5 w-4 md:w-5 flex-shrink-0" />
                  <span className="truncate">Alătură-te comunității</span>
                </button>
              </div>
              
              <div className="text-xs md:text-sm mt-6 md:mt-8 text-[#7a7a7a] font-light bg-[#f0f0f3] px-4 py-2 rounded-[12px] shadow-[inset_2px_2px_4px_#d1d1d4,inset_-2px_-2px_4px_#ffffff] inline-block">
                <span className="font-normal">Peste 10.000+ români</span> și-au regăsit echilibrul cu ajutorul Healio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beautiful Cloud Animation Section */}
      <section className="py-8 text-center">
        <CloudNodes />
      </section>

      {/* Marketplace Section */}
      <section id="marketplace" className="py-12 md:py-16 px-4 bg-[#e0e0e3] relative overflow-hidden">
        <ConnectedParticles />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-8 md:mb-12 bg-[#e0e0e3] rounded-[20px] p-8 shadow-[10px_10px_20px_#cbcbce,-10px_-10px_20px_#f5f5f8]">
            <h2 className="text-3xl md:text-4xl font-inter font-light mb-3 md:mb-4 text-[#5a5a5a]">
              Terapeutul perfect te așteaptă
            </h2>
            <p className="text-lg md:text-xl text-[#7a7a7a] max-w-2xl mx-auto font-light">
              Nu mai pierde timpul cu căutări nesfârșite. Terapeuții noștri sunt 
              <span className="font-normal"> licențiați, verificați și specializați</span> în ceea ce ai nevoie. 
              <span className="text-[#6a8a7a] font-normal">Prima consultație poate fi chiar azi.</span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 justify-center">
            <button className="bg-[#e0e0e3] text-[#6a6a6a] font-normal text-xs md:text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#cbcbce,-4px_-4px_8px_#f5f5f8] hover:shadow-[2px_2px_4px_#cbcbce,-2px_-2px_4px_#f5f5f8] transition-all duration-200 flex items-center gap-2">
              <Search className="h-3 md:h-4 w-3 md:w-4" />
              Caută
            </button>
            <button className="bg-[#e0e0e3] text-[#6a6a6a] font-normal text-xs md:text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#cbcbce,-4px_-4px_8px_#f5f5f8] hover:shadow-[2px_2px_4px_#cbcbce,-2px_-2px_4px_#f5f5f8] transition-all duration-200 flex items-center gap-2">
              <Filter className="h-3 md:h-4 w-3 md:w-4" />
              Specializare
            </button>
            <div className="bg-[#e0e0e3] text-[#7a7a7a] px-3 py-1 rounded-[8px] text-xs shadow-[2px_2px_4px_#cbcbce,-2px_-2px_4px_#f5f5f8] font-light">Anxietate</div>
            <div className="bg-[#e0e0e3] text-[#7a7a7a] px-3 py-1 rounded-[8px] text-xs shadow-[2px_2px_4px_#cbcbce,-2px_-2px_4px_#f5f5f8] font-light">Depresie</div>
            <div className="bg-[#e0e0e3] text-[#7a7a7a] px-3 py-1 rounded-[8px] text-xs shadow-[2px_2px_4px_#cbcbce,-2px_-2px_4px_#f5f5f8] font-light">Stres</div>
            <div className="bg-[#e0e0e3] text-[#7a7a7a] px-3 py-1 rounded-[8px] text-xs shadow-[2px_2px_4px_#cbcbce,-2px_-2px_4px_#f5f5f8] font-light">Relații</div>
          </div>

          <PuzzleGrid>
            {therapists.map((therapist, index) => (
              <PuzzleCard 
                key={therapist.id} 
                size={index === 0 ? '2x1' : index === 1 ? '1x2' : '1x1'}
                className="bg-[#e0e0e3] rounded-[20px] shadow-[8px_8px_16px_#cbcbce,-8px_-8px_16px_#f5f5f8] border-0"
              >
                <TherapistCard 
                  therapist={therapist} 
                  size={index === 0 ? '2x1' : index === 1 ? '1x2' : '1x1'}
                />
              </PuzzleCard>
            ))}
            
            <PuzzleCard size="1x1" className="bg-[#e0e0e3] rounded-[20px] shadow-[8px_8px_16px_#cbcbce,-8px_-8px_16px_#f5f5f8] border-0">
              <div className="p-4 text-center">
                <Plus className="w-6 md:w-8 h-6 md:h-8 mx-auto mb-2 text-[#8a8a8a]" />
                <p className="text-xs md:text-sm font-light text-[#7a7a7a]">Vezi mai mulți terapeuți</p>
              </div>
            </PuzzleCard>
          </PuzzleGrid>
        </div>
      </section>

      {/* Community Feed Section */}
      <section id="community" className="py-12 md:py-16 px-4 bg-[#f0f0f3] relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12 bg-[#f0f0f3] rounded-[20px] p-6 md:p-8 shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] mx-4">
            <h2 className="text-3xl md:text-4xl font-inter font-light mb-3 md:mb-4 text-[#5a5a5a]">
              Aici nu ești singur cu gândurile tale
            </h2>
            <p className="text-lg md:text-xl text-[#7a7a7a] max-w-2xl mx-auto font-light">
              <span className="font-normal">Mii de români ca tine</span> își împărtășesc zilnic experiențele, 
              primesc sprijin și se vindecă împreună. 
              <span className="text-[#6a8a7a] font-normal">Anonimitatea ta este protejată 100%.</span>
            </p>
          </div>

          <PuzzleGrid>
            {/* Write post CTA */}
            <PuzzleCard size="2x1" className="bg-[#f0f0f3] rounded-[20px] shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] border-0">
              <div className="p-4 md:p-6 text-center">
                <h3 className="text-lg md:text-xl font-inter font-light mb-2 md:mb-3 text-[#5a5a5a]">
                  Ce simți chiar acum? Spune-ne...
                </h3>
                <p className="text-xs md:text-sm text-[#7a7a7a] mb-3 md:mb-4 font-light">
                  Comunitatea noastră te ascultă fără să te judece. 
                  <span className="font-normal">Primul pas către vindecare e să vorbești.</span>
                </p>
                <button className="bg-[#f0f0f3] text-[#5a5a5a] font-normal text-xs md:text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d1d1d4,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#d1d1d4,-2px_-2px_4px_#ffffff] transition-all duration-200 flex items-center gap-2 mx-auto">
                  <Plus className="h-3 md:h-4 w-3 md:w-4" />
                  Începe să vorbești
                </button>
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
                className="bg-[#f0f0f3] rounded-[20px] shadow-[8px_8px_16px_#d1d1d4,-8px_-8px_16px_#ffffff] border-0"
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
            ))}
          </PuzzleGrid>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 px-4 bg-[#e8e8eb]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 bg-[#e8e8eb] rounded-[20px] p-8 md:p-10 shadow-[10px_10px_20px_#d3d3d6,-10px_-10px_20px_#fdfdff]">
            <h2 className="text-4xl font-inter font-light mb-4 text-[#5a5a5a]">
              Înțelege-te mai bine cu resurse gratuite
            </h2>
            <p className="text-xl text-[#7a7a7a] max-w-2xl mx-auto font-light">
              <span className="font-normal">Cunoașterea de sine</span> e primul pas spre vindecare. 
              Testele noastre validate științific și ghidurile practice te ajută să 
              <span className="text-[#6a8a7a] font-normal">descoperi ce ai cu adevărat nevoie.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff] min-h-[300px]">
              <div className="w-12 h-12 bg-[#e8e8eb] rounded-[12px] shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-[#7a8a9a]" />
              </div>
              <h3 className="text-lg font-inter font-normal mb-2 text-[#5a5a5a]">
                Suferi de anxietate? Află acum!
              </h3>
              <p className="text-sm text-[#7a7a7a] mb-4 font-light leading-relaxed">
                Test profesional de 5 minute care îți arată exact unde te afli și ce pași să faci.
              </p>
              <button className="bg-[#e8e8eb] text-[#6a6a6a] font-normal text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] hover:shadow-[2px_2px_4px_#d3d3d6,-2px_-2px_4px_#fdfdff] transition-all duration-200">
                Începe testul
              </button>
            </div>

            <div className="bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff] md:col-span-2 lg:col-span-1 min-h-[300px]">
              <h3 className="text-xl font-inter font-normal mb-3 text-[#5a5a5a]">
                Stresul îți distruge viața? Nu mai lăsa!
              </h3>
              <p className="text-[#7a7a7a] mb-4 font-light leading-relaxed">
                <span className="font-normal">Ghidul complet</span> cu 15+ tehnici dovedite științific pentru a-ți recâștiga controlul. 
                Include exerciții practice pentru rezultate imediate.
              </p>
              <button className="bg-[#e8e8eb] text-[#6a6a6a] font-normal text-sm px-4 py-2 rounded-[12px] shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] hover:shadow-[2px_2px_4px_#d3d3d6,-2px_-2px_4px_#fdfdff] transition-all duration-200">
                Citește ghidul
              </button>
            </div>

            <div className="bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff] text-center md:col-span-2 lg:col-span-1 min-h-[300px] flex flex-col justify-center">
              <div className="w-16 h-16 bg-[#e8e8eb] rounded-full shadow-[6px_6px_12px_#d3d3d6,-6px_-6px_12px_#fdfdff] flex items-center justify-center mx-auto mb-4 text-2xl">
                🧘‍♀️
              </div>
              <h4 className="font-inter font-normal mb-2 text-[#5a5a5a]">Micro-curs Mindfulness</h4>
              <p className="text-xs text-[#7a7a7a] font-light">5 min/zi</p>
            </div>
          </div>
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
      <footer className="bg-[#e8e8eb] py-16 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1 bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#e8e8eb] rounded-full shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#7a8a9a]" />
                </div>
                <h2 className="text-2xl font-inter font-normal text-[#5a5a5a]">Healio</h2>
              </div>
              
              <p className="text-[#7a7a7a] mb-6 text-sm leading-relaxed font-light">
                Platforma digitală de sănătate mentală din România care combină terapia profesională cu 
                căldura unei comunități de suport.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-[#7a7a7a] font-light">
                  <Phone className="w-4 h-4 text-[#7a8a9a]" />
                  <span>+40 21 123 4567</span>
                </div>
                <div className="flex items-center gap-3 text-[#7a7a7a] font-light">
                  <Mail className="w-4 h-4 text-[#7a8a9a]" />
                  <span>contact@healio.ro</span>
                </div>
                <div className="flex items-center gap-3 text-[#7a7a7a] font-light">
                  <MapPin className="w-4 h-4 text-[#7a8a9a]" />
                  <span>București, România</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <div className="w-8 h-8 bg-[#e8e8eb] rounded-full shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] flex items-center justify-center hover:shadow-[2px_2px_4px_#d3d3d6,-2px_-2px_4px_#fdfdff] transition-all duration-200 cursor-pointer">
                  <Facebook className="w-4 h-4 text-[#8a9a7a]" />
                </div>
                <div className="w-8 h-8 bg-[#e8e8eb] rounded-full shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] flex items-center justify-center hover:shadow-[2px_2px_4px_#d3d3d6,-2px_-2px_4px_#fdfdff] transition-all duration-200 cursor-pointer">
                  <Instagram className="w-4 h-4 text-[#8a9a7a]" />
                </div>
                <div className="w-8 h-8 bg-[#e8e8eb] rounded-full shadow-[4px_4px_8px_#d3d3d6,-4px_-4px_8px_#fdfdff] flex items-center justify-center hover:shadow-[2px_2px_4px_#d3d3d6,-2px_-2px_4px_#fdfdff] transition-all duration-200 cursor-pointer">
                  <Linkedin className="w-4 h-4 text-[#8a9a7a]" />
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div className="bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff]">
              <h3 className="font-inter font-normal text-lg mb-4 text-[#5a5a5a]">Servicii</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Terapie Online</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Comunitate</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Resurse Educaționale</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Evenimente & Workshop-uri</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Pentru Companii</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div className="bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff]">
              <h3 className="font-inter font-normal text-lg mb-4 text-[#5a5a5a]">Suport</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Centru de Ajutor</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Întrebări Frecvente</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Contact</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Feedback</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Raportează o Problemă</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div className="bg-[#e8e8eb] rounded-[20px] p-6 shadow-[8px_8px_16px_#d3d3d6,-8px_-8px_16px_#fdfdff]">
              <h3 className="font-inter font-normal text-lg mb-4 text-[#5a5a5a]">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Termeni și Condiții</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Politica de Confidențialitate</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Politica Cookie</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">GDPR</a></li>
                <li><a href="#" className="text-[#7a7a7a] font-light hover:text-[#5a5a5a] transition-colors">Cod de Conduită</a></li>
              </ul>
            </div>
          </div>
          
          {/* Emergency Section */}
          <div className="pt-8 mb-8">
            <div className="bg-[#f5e5e5] rounded-[20px] p-6 shadow-[8px_8px_16px_#e0d0d0,-8px_-8px_16px_#ffffff] border-l-4 border-[#e57373]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#f5e5e5] rounded-full shadow-[4px_4px_8px_#e0d0d0,-4px_-4px_8px_#ffffff] flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-4 h-4 text-[#c62828]" />
                </div>
                <div>
                  <h4 className="font-inter font-normal text-lg text-[#c62828] mb-2">
                    Urgență Psihiatrică
                  </h4>
                  <p className="text-sm text-[#d32f2f] mb-3 font-light">
                    Dacă ești în criză sau ai gânduri suicidale, contactează imediat: 
                    <span className="font-normal"> 0800 801 200</span> (Telefonul Vieții) sau 
                    <span className="font-normal"> 112</span> pentru urgențe.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#e8e8eb] rounded-[20px] p-6 shadow-[inset_4px_4px_8px_#d3d3d6,inset_-4px_-4px_8px_#fdfdff]">
            <div className="text-sm text-[#7a7a7a] font-light">
              © 2025 Healio. Toate drepturile rezervate.
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#7a7a7a] font-light">Certificat de</span>
              <div className="flex items-center gap-1 text-[#6a8a7a] font-normal">
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
