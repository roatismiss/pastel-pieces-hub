import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, Users, TrendingUp, Star, Award } from 'lucide-react';
import TherapistFeed from '@/components/therapist/TherapistFeed';

const TherapistFeedPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Conținut de la Terapeuți Licențiați
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Articole profesionale, evenimente și resurse de la terapeuții verificați pe Healio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-4">
              <BookOpen className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Articole publicate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Evenimente active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Terapeuți activi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Award className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Rating mediu</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed Principal</TabsTrigger>
            <TabsTrigger value="featured">Conținut Recomandat</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Professional Content Guidelines */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Award className="w-5 h-5" />
                  Conținut Profesional Verificat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Toate articolele sunt scrise de terapeuți licențiați și verificați</p>
                <p>• Conținutul este revizuit pentru acuratețe și profesionalism</p>
                <p>• Evenimentele sunt organizate de profesioniști autorizați</p>
                <p>• Informațiile nu înlocuiesc consultul medical profesional</p>
              </CardContent>
            </Card>

            {/* Main Feed */}
            <TherapistFeed />
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Conținut Recomandat
                </CardTitle>
                <CardDescription>
                  Cele mai apreciate articole și evenimente din această lună
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Funcționalitatea va fi disponibilă în curând</p>
                  <p className="text-sm">
                    Aici veți găsi cele mai populare articole și evenimente recomandate de comunitate
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TherapistFeedPage;