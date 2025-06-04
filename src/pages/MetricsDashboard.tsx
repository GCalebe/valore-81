
import React, { useEffect, useState } from 'react';
import { LineChart, Users, Clock, TrendingUp, MessageCircle, Target } from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';

// Import components
import DashboardHeader from '@/components/metrics/DashboardHeader';
import StatCard from '@/components/metrics/StatCard';
import ClientGrowthChart from '@/components/metrics/ClientGrowthChart';
import ConversationChart from '@/components/metrics/ConversationChart';
import ConversionFunnelChart from '@/components/metrics/ConversionFunnelChart';
import LeadsTable from '@/components/metrics/LeadsTable';
import ConversionByTimeChart from '@/components/metrics/ConversionByTimeChart';
import MetricsFilters from '@/components/metrics/MetricsFilters';

const MetricsDashboard = () => {
  const { stats, loading, refetchStats } = useClientStats();
  const [dateFilter, setDateFilter] = useState('week');
  
  // Initialize real-time updates for the metrics dashboard
  useDashboardRealtime();
  
  // Fetch data when component mounts
  useEffect(() => {
    refetchStats();
  }, [refetchStats]);
  
  // Use real data for monthly customers growth
  const monthlyCustomersData = stats.monthlyGrowth?.length > 0 
    ? stats.monthlyGrowth 
    : [
        { month: 'Jan', clients: 0 },
        { month: 'Fev', clients: 0 },
        { month: 'Mar', clients: 0 },
        { month: 'Abr', clients: 0 },
        { month: 'Mai', clients: 0 },
        { month: 'Jun', clients: 0 },
        { month: 'Jul', clients: 0 },
        { month: 'Ago', clients: 0 },
        { month: 'Set', clients: 0 },
        { month: 'Out', clients: 0 },
        { month: 'Nov', clients: 0 },
        { month: 'Dez', clients: 0 }
      ];

  // Mock data for new conversation metrics
  const conversationData = [
    { date: '01/12', respondidas: 45, naoRespondidas: 12 },
    { date: '02/12', respondidas: 52, naoRespondidas: 8 },
    { date: '03/12', respondidas: 38, naoRespondidas: 15 },
    { date: '04/12', respondidas: 65, naoRespondidas: 10 },
    { date: '05/12', respondidas: 48, naoRespondidas: 18 },
    { date: '06/12', respondidas: 72, naoRespondidas: 6 },
    { date: '07/12', respondidas: 55, naoRespondidas: 13 }
  ];

  const funnelData = [
    { stage: 'Lead criado', value: 100, percentage: 100 },
    { stage: 'Contato feito', value: 75, percentage: 75 },
    { stage: 'Conversa iniciada', value: 60, percentage: 60 },
    { stage: 'Reunião', value: 40, percentage: 40 },
    { stage: 'Proposta', value: 25, percentage: 25 },
    { stage: 'Fechamento', value: 15, percentage: 15 }
  ];

  const conversionByTimeData = [
    { day: 'Segunda', morning: 12, afternoon: 18, evening: 8 },
    { day: 'Terça', morning: 15, afternoon: 22, evening: 10 },
    { day: 'Quarta', morning: 18, afternoon: 25, evening: 12 },
    { day: 'Quinta', morning: 20, afternoon: 28, evening: 15 },
    { day: 'Sexta', morning: 16, afternoon: 30, evening: 18 },
    { day: 'Sábado', morning: 8, afternoon: 15, evening: 20 },
    { day: 'Domingo', morning: 5, afternoon: 10, evening: 12 }
  ];
  
  // Use real client data from the database for leads table
  const leadsData = stats.recentClients?.length > 0
    ? stats.recentClients.map(client => ({
        id: client.id,
        name: client.name,
        lastContact: client.lastVisit,
        status: 'Contato feito'
      }))
    : [
        { id: 1, name: 'Carregando...', lastContact: '...', status: 'Entraram' }
      ];

  // Calculate conversation metrics
  const totalConversations = conversationData.reduce((acc, day) => acc + day.respondidas + day.naoRespondidas, 0);
  const totalRespondidas = conversationData.reduce((acc, day) => acc + day.respondidas, 0);
  const responseRate = totalConversations > 0 ? Math.round((totalRespondidas / totalConversations) * 100) : 0;
  const avgResponseTime = '2.5'; // Mock data - would come from real metrics
  const conversionRate = 15; // Mock data - calculated from funnel
  const avgClosingTime = '12'; // Mock data - days

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <LineChart className="h-6 w-6 text-Valore-blue dark:text-blue-400" />
            Dashboard de Métricas
          </h2>
          <MetricsFilters 
            dateFilter={dateFilter} 
            onDateFilterChange={setDateFilter} 
          />
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total de Conversas"
            value={totalConversations}
            icon={<MessageCircle />}
            trend={`${totalRespondidas} respondidas de ${totalConversations} totais`}
            loading={loading}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
            iconTextClass="text-blue-600 dark:text-blue-400"
          />
          
          <StatCard 
            title="Taxa de Resposta"
            value={`${responseRate}%`}
            icon={<TrendingUp />}
            trend={`${totalRespondidas} conversas respondidas`}
            loading={loading}
            iconBgClass="bg-green-100 dark:bg-green-900/30"
            iconTextClass="text-green-600 dark:text-green-400"
          />
          
          <StatCard 
            title="Tempo Médio de Resposta"
            value={`${avgResponseTime}h`}
            icon={<Clock />}
            trend="Tempo médio para primeira resposta"
            loading={loading}
            iconBgClass="bg-orange-100 dark:bg-orange-900/30"
            iconTextClass="text-orange-600 dark:text-orange-400"
          />
          
          <StatCard 
            title="Taxa de Conversão"
            value={`${conversionRate}%`}
            icon={<Target />}
            trend="De lead para fechamento"
            loading={loading}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
            iconTextClass="text-purple-600 dark:text-purple-400"
          />
          
          <StatCard 
            title="Tempo Médio de Fechamento"
            value={`${avgClosingTime} dias`}
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ConversationChart data={conversationData} loading={loading} />
          <ConversionFunnelChart data={funnelData} loading={loading} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ClientGrowthChart data={monthlyCustomersData} loading={loading} />
          <ConversionByTimeChart data={conversionByTimeData} loading={loading} />
        </div>
        
        {/* Leads Table */}
        <div className="mb-8">
          <LeadsTable leads={leadsData} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default MetricsDashboard;
