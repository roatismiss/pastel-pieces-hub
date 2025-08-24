import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Users, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import CommunityPostForm from '@/components/community/CommunityPostForm';
import CommunityFeed from '@/components/community/CommunityFeed';

const Community = () => {
  const { user } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Comunitatea Healio
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Un spațiu sigur pentru împărtășirea experiențelor și sprijinul mutual
          </p>
          
          {user && (
            <Button
              onClick={() => setShowPostForm(!showPostForm)}
              className="mb-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Postare Nouă
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Membri activi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <MessageCircle className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">567</p>
                <p className="text-sm text-muted-foreground">Postări astăzi</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-2xl font-bold">2,890</p>
                <p className="text-sm text-muted-foreground">Reacții pozitive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Feed Comunitate</TabsTrigger>
            <TabsTrigger value="trending">În Tendințe</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {/* Post Form */}
            {showPostForm && (
              <CommunityPostForm
                onPostCreated={() => setShowPostForm(false)}
                onCancel={() => setShowPostForm(false)}
              />
            )}

            {/* Community Guidelines */}
            {!user && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Alăturați-vă comunității noastre
                  </CardTitle>
                  <CardDescription>
                    Pentru a posta și a interacționa în comunitate, vă rugăm să vă autentificați
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => window.location.href = '/auth'}>
                    Autentificare
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Community Guidelines */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Heart className="w-5 h-5" />
                  Regulile Comunității
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Tratați-vă cu respect și empatie</p>
                <p>• Nu împărtășiți informații personale sensibile</p>
                <p>• Postările anonime sunt permise pentru confidențialitate</p>
                <p>• Raportați conținutul nepotrivit</p>
                <p>• Căutați ajutor profesional pentru probleme grave</p>
              </CardContent>
            </Card>

            {/* Community Feed */}
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Postări Populare
                </CardTitle>
                <CardDescription>
                  Cele mai apreciate postări din această săptămână
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Funcționalitatea "În Tendințe" va fi disponibilă în curând
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;