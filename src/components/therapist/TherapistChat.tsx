import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Clock } from 'lucide-react';

interface TherapistChatProps {
  therapistId: string;
}

const TherapistChat: React.FC<TherapistChatProps> = ({ therapistId }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat cu clienții
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Mesaje</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <span className="text-sm font-medium">Clienți activi</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">Disponibilitate</span>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-2">
              Sistemul de chat va fi disponibil în curând
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Dezvoltăm o platformă completă de comunicare care vă va permite să discutați 
              în timp real cu clienții dvs., să programați consultații și să gestionați 
              conversațiile în mod eficient.
            </p>
            
            <div className="bg-muted/20 rounded-lg p-6 mt-8">
              <h4 className="font-semibold mb-3">Funcționalități planificate:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Chat în timp real</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Notificări instant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Istoricul conversațiilor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Partajarea documentelor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Programări rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Status de disponibilitate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistChat;