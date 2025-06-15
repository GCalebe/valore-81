
import React from 'react';
import { MessageCircle, TrendingUp, Clock, Target, Users } from 'lucide-react';
import StatCard from './StatCard';
import ClientGrowthChart from './ClientGrowthChart';
import ConversationChart from './ConversationChart';
import ConversionFunnelChart from './ConversionFunnelChart';
import LeadsTable from './LeadsTable';
import ConversionByTimeChart from './ConversionByTimeChart';

interface ChatMetricsTabProps {
  stats: {
    newClientsThisMonth: number;
    monthlyGrowth: any[];
  };
  metrics: {
    totalConversations: number;
    totalRespondidas: number;
    responseRate: number;
    avgResponseTime: number;
    conversionRate: number;
    avgClosingTime: number;
    conversationData: any[];
    funnelData: any[];
    conversionByTimeData: any[];
    leadsData: any[];
  };
  loading: boolean;
}

const ChatMetricsTab: React.FC<ChatMetricsTabProps> = ({ stats, metrics, loading }) => {
  return (
    <div className="space-y-8">
      {/* Chat KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total de Conversas"
          value={metrics.totalConversations}
          icon={<MessageCircle />}
          trend={`${metrics.totalRespondidas} respondidas de ${metrics.totalConversations} totais`}
          loading={loading}
          iconBgClass="bg-blue-100 dark:bg-blue-900/30"
          iconTextClass="text-blue-600 dark:text-blue-400"
        />
        
        <StatCard 
          title="Taxa de Resposta"
          value={`${metrics.responseRate}%`}
          icon={<TrendingUp />}
          trend={`${metrics.totalRespondidas} conversas respondidas`}
          loading={loading}
          iconBgClass="bg-green-100 dark:bg-green-900/30"
          iconTextClass="text-green-600 dark:text-green-400"
        />
        
        <StatCard 
          title="Tempo Médio de Resposta"
          value={`${metrics.avgResponseTime}h`}
          icon={<Clock />}
          trend="Tempo médio para primeira resposta"
          loading={loading}
          iconBgClass="bg-orange-100 dark:bg-orange-900/30"
          iconTextClass="text-orange-600 dark:text-orange-400"
        />
        
        <StatCard 
          title="Taxa de Conversão"
          value={`${metrics.conversionRate}%`}
          icon={<Target />}
          trend="De lead para projeto"
          loading={loading}
          iconBgClass="bg-purple-100 dark:bg-purple-900/30"
          iconTextClass="text-purple-600 dark:text-purple-400"
        />
        
        <StatCard 
          title="Tempo Médio de Fechamento"
          value={`${metrics.avgClosingTime} dias`}
          icon={<Clock />}
          trend="Do contato inicial ao fechamento"
          loading={loading}
          iconBgClass="bg-pink-100 dark:bg-pink-900/30"
          iconTextClass="text-pink-600 dark:text-pink-400"
        />
        
        <StatCard 
          title="Novos Leads"
          value={stats.newClientsThisMonth}
          icon={<Users />}
          trend={`+${stats.newClientsThisMonth} este mês`}
          loading={loading}
          iconBgClass="bg-indigo-100 dark:bg-indigo-900/30"
          iconTextClass="text-indigo-600 dark:text-indigo-400"
        />
      </div>
      
      {/* Chat Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConversationChart data={metrics.conversationData} loading={loading} />
        <ConversionFunnelChart data={metrics.funnelData} loading={loading} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientGrowthChart data={stats.monthlyGrowth} loading={loading} />
        <ConversionByTimeChart data={metrics.conversionByTimeData} loading={loading} />
      </div>
      
      {/* Chat Tables Section */}
      <div className="grid grid-cols-1 gap-6">
        <LeadsTable leads={metrics.leadsData} loading={loading} />
      </div>
    </div>
  );
};

export default ChatMetricsTab;
