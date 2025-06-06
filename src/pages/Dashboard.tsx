import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, Calendar, Users, BarChart3, 
  TrendingUp, PhoneCall, Clock, CheckCircle,
  Settings
} from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';

interface MockData {
  date: string;
  agendados: number;
  compareceram: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { stats, loading: statsLoading } = useClientStats();
  
  // Set up dashboard-wide real-time updates
  useDashboardRealtime();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mock data for charts and recent activities
  const mockScheduleData: MockData[] = [
    { date: '01/06', agendados: 12, compareceram: 10 },
    { date: '02/06', agendados: 15, compareceram: 14 },
    { date: '03/06', agendados: 8, compareceram: 7 },
    { date: '04/06', agendados: 20, compareceram: 18 },
    { date: '05/06', agendados: 18, compareceram: 16 },
    { date: '06/06', agendados: 25, compareceram: 22 },
  ];

  const mockConversationData = [
    { date: '01/06', respondidas: 45, naoRespondidas: 8 },
    { date: '02/06', respondidas: 52, naoRespondidas: 12 },
    { date: '03/06', respondidas: 38, naoRespondidas: 6 },
    { date: '04/06', respondidas: 61, naoRespondidas: 15 },
    { date: '05/06', respondidas: 49, naoRespondidas: 9 },
    { date: '06/06', respondidas: 58, naoRespondidas: 11 },
  ];

  const mockRecentActivities = [
    { id: 1, type: 'Novo Cliente', description: 'João Silva se cadastrou', time: '2 min atrás', icon: Users },
    { id: 2, type: 'Chat Respondido', description: 'Conversa com Maria Santos finalizada', time: '5 min atrás', icon: MessageCircle },
    { id: 3, type: 'Agendamento', description: 'Reunião marcada com Pedro Costa', time: '12 min atrás', icon: Calendar },
    { id: 4, type: 'Conversão', description: 'Ana Oliveira converteu em cliente', time: '18 min atrás', icon: TrendingUp },
    { id: 5, type: 'Ligação', description: 'Ligação realizada para Carlos Pereira', time: '25 min atrás', icon: PhoneCall },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Dashboard Valore Marketing Náutico
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Bem-vindo de volta, {user.email}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Button>
              <Button variant="destructive" onClick={signOut}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Connection Status */}
        <div className="mb-8">
          <ConnectionStatus />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-800 dark:text-white">
                Total de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statsLoading ? <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" /> : stats?.totalClients || 0}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                <Users className="inline-block h-4 w-4 mr-1" />
                Clientes cadastrados no sistema
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-800 dark:text-white">
                Agendamentos do Mês
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statsLoading ? <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" /> : stats?.monthlyAppointments || 0}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                Agendamentos confirmados este mês
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-800 dark:text-white">
                Novas Conversas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {statsLoading ? <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" /> : stats?.newConversations || 0}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                <MessageCircle className="inline-block h-4 w-4 mr-1" />
                Novas conversas iniciadas
              </p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-800 dark:text-white">
                Serviços Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {statsLoading ? <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-md" /> : stats?.activeServices || 0}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                <BarChart3 className="inline-block h-4 w-4 mr-1" />
                Serviços atualmente em oferta
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* <ScheduleChart data={mockScheduleData} loading={statsLoading} />
          <ConversationChart data={mockConversationData} loading={statsLoading} /> */}
        </div>

        {/* Recent Activities */}
        <Card className="mb-8 dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* {mockRecentActivities.map((activity) => (
                <li key={activity.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <activity.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-gray-800 dark:text-white">{activity.type}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{activity.description}</p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                  </div>
                </li>
              ))} */}
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="dark:bg-blue-700 hover:dark:bg-blue-600" onClick={() => handleNavigation('/clients')}>
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Clientes
            </Button>
            <Button className="dark:bg-green-700 hover:dark:bg-green-600" onClick={() => handleNavigation('/schedule')}>
              <Calendar className="h-4 w-4 mr-2" />
              Ver Agendamentos
            </Button>
            <Button className="dark:bg-orange-700 hover:dark:bg-orange-600" onClick={() => handleNavigation('/chats')}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Acessar Chats
            </Button>
            <Button className="dark:bg-teal-700 hover:dark:bg-teal-600" onClick={() => handleNavigation('/calls')}>
              <PhoneCall className="h-4 w-4 mr-2" />
              Registrar Ligações
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
