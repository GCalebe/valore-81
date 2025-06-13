
import React, { useEffect, useState } from 'react';
import { LineChart, Users, Clock, TrendingUp, MessageCircle, Target } from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useConversationMetrics } from '@/hooks/useConversationMetrics';
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
  const { stats, loading: statsLoading, refetchStats } = useClientStats();
  const { metrics, loading: metricsLoading, refetchMetrics } = useConversationMetrics();
  const [dateFilter, setDateFilter] = useState('week');
  
  // Initialize real-time updates for the metrics dashboard
  useDashboardRealtime();
  
  // Fetch data when component mounts
  useEffect(() => {
    refetchStats();
    refetchMetrics();
  }, [refetchStats, refetchMetrics]);
  
  const loading = statsLoading || metricsLoading;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <LineChart className="h-6 w-6 text-petshop-blue dark:text-blue-400" />
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ConversationChart data={metrics.conversationData} loading={loading} />
          <ConversionFunnelChart data={metrics.funnelData} loading={loading} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ClientGrowthChart data={stats.monthlyGrowth} loading={loading} />
          <ConversionByTimeChart data={metrics.conversionByTimeData} loading={loading} />
        </div>
        
        {/* Leads Table */}
        <div className="mb-8">
          <LeadsTable leads={metrics.leadsData} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default MetricsDashboard;
