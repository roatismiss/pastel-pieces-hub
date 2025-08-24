import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunityFeed from '@/components/community/CommunityFeed';
import CommunityPostForm from '@/components/community/CommunityPostForm';
import { Users, MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);

  const handlePostCreated = () => {
    setShowPostForm(false);
  };

  const handleCancelPost = () => {
    setShowPostForm(false);
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Comunitatea Healio</h1>
            <p className="text-muted-foreground mt-2">
              Un spațiu sigur pentru partajarea experiențelor și sprijinul reciproc
            </p>
          </div>
          {user && (
            <Button
              onClick={() => setShowPostForm(true)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Postare Nouă
            </Button>
          )}
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Membri activi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-sm text-muted-foreground">Postări astăzi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ThumbsUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">456</p>
                  <p className="text-sm text-muted-foreground">Reacții pozitive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Fluxul Comunității</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            {showPostForm && (
              <CommunityPostForm
                onPostCreated={handlePostCreated}
                onCancel={handleCancelPost}
              />
            )}

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liniile Directoare ale Comunității</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Respectă ceilalți</Badge>
                  <Badge variant="secondary">Păstrează confidențialitatea</Badge>
                  <Badge variant="secondary">Oferă suport constructiv</Badge>
                  <Badge variant="secondary">Evită diagnosticele medicale</Badge>
                </div>
              </CardContent>
            </Card>

            {!user && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Pentru a vedea și interacționa cu postările comunității, te rugăm să te autentifici.
                  </p>
                  <Button onClick={() => window.location.href = '/auth'}>
                    Autentificare
                  </Button>
                </CardContent>
              </Card>
            )}

            <CommunityFeed />
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Trending în curând</h3>
                <p className="text-muted-foreground">
                  Această secțiune va afișa postările cu cele mai multe interacțiuni din comunitate.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Community;