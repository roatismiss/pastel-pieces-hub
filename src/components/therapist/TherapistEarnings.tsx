import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react';

interface Earning {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  processed_at?: string;
  created_at: string;
  appointment_id?: string;
}

interface TherapistEarningsProps {
  therapistId: string;
}

const TherapistEarnings: React.FC<TherapistEarningsProps> = ({ therapistId }) => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    pendingEarnings: 0,
    completedEarnings: 0,
    totalWithdrawals: 0
  });

  useEffect(() => {
    fetchEarnings();
  }, [therapistId]);

  const fetchEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('therapist_earnings')
        .select('*')
        .eq('therapist_id', therapistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEarnings(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (earningsData: Earning[]) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const totals = earningsData.reduce((acc, earning) => {
      const amount = parseFloat(earning.amount.toString());
      
      if (earning.transaction_type === 'earning') {
        acc.totalEarnings += amount;
        
        if (earning.status === 'completed') {
          acc.completedEarnings += amount;
        } else {
          acc.pendingEarnings += amount;
        }
        
        if (new Date(earning.created_at) >= monthStart) {
          acc.thisMonthEarnings += amount;
        }
      } else if (earning.transaction_type === 'withdrawal' && earning.status === 'completed') {
        acc.totalWithdrawals += amount;
      }
      
      return acc;
    }, {
      totalEarnings: 0,
      thisMonthEarnings: 0,
      pendingEarnings: 0,
      completedEarnings: 0,
      totalWithdrawals: 0
    });

    setStats(totals);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completată';
      case 'pending': return 'În așteptare';
      case 'cancelled': return 'Anulată';
      default: return status;
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'earning' ? (
      <ArrowUpRight className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-red-600" />
    );
  };

  const getTransactionLabel = (type: string) => {
    return type === 'earning' ? 'Venit' : 'Retragere';
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venituri totale</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalEarnings.toFixed(2)} RON
            </div>
            <p className="text-xs text-muted-foreground">
              Din toate consultațiile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Luna aceasta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.thisMonthEarnings.toFixed(2)} RON
            </div>
            <p className="text-xs text-muted-foreground">
              Venituri curente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">În așteptare</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingEarnings.toFixed(2)} RON
            </div>
            <p className="text-xs text-muted-foreground">
              Neprocessate încă
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibil</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {(stats.completedEarnings - stats.totalWithdrawals).toFixed(2)} RON
            </div>
            <p className="text-xs text-muted-foreground">
              Pentru retragere
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Istoric tranzacții
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {earnings.map((earning) => (
            <div key={earning.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTransactionIcon(earning.transaction_type)}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {getTransactionLabel(earning.transaction_type)}
                    </span>
                    <Badge variant={getStatusBadgeVariant(earning.status)}>
                      {getStatusLabel(earning.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(earning.created_at).toLocaleString('ro-RO')}
                    {earning.processed_at && (
                      <span className="ml-2">
                        • Procesat: {new Date(earning.processed_at).toLocaleString('ro-RO')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className={`text-lg font-semibold ${
                earning.transaction_type === 'earning' ? 'text-green-600' : 'text-red-600'
              }`}>
                {earning.transaction_type === 'earning' ? '+' : '-'}{earning.amount} RON
              </div>
            </div>
          ))}
          
          {earnings.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nu aveți încă tranzacții înregistrate.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sumar financiar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.completedEarnings.toFixed(2)} RON
              </div>
              <p className="text-sm text-muted-foreground">Venituri confirmate</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {stats.totalWithdrawals.toFixed(2)} RON
              </div>
              <p className="text-sm text-muted-foreground">Total retrăgeri</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {(stats.completedEarnings - stats.totalWithdrawals).toFixed(2)} RON
              </div>
              <p className="text-sm text-muted-foreground">Sold disponibil</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapistEarnings;