
import React, { useEffect, useState } from 'react';
import { LineChart, Users, Clock, TrendingUp, MessageCircle, Target, Share2 } from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useConversationMetrics } from '@/hooks/useConversationMetrics';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';
import { useUTMTracking } from '@/hooks/useUTMTracking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import components
import DashboardHeader from '@/components/metrics/DashboardHeader';
import StatCard from '@/components/metrics/StatCard';
import ClientGrowthChart from '@/components/metrics/ClientGrowthChart';
import ConversationChart from '@/components/metrics/ConversationChart';
import ConversionFunnelChart from '@/components/metrics/ConversionFunnelChart';
import LeadsTable from '@/components/metrics/LeadsTable';
import ConversionByTimeChart from '@/components/metrics/ConversionByTimeChart';
import MetricsFilters from '@/components/metrics/MetricsFilters';
import UTMCampaignChart from '@/components/metrics/UTMCampaignChart';
import UTMSourceChart from '@/components/metrics/UTMSourceChart';
import UTMTrackingTable from '@/components/metrics/UTMTrackingTable';

const MetricsDashboard = () => {
  const { stats, loading: statsLoading, refetchStats } = useClientStats();
  const { metrics, loading: metricsLoading, refetchMetrics } = useConversationMetrics();
  const { metrics: utmMetrics, loading: utmLoading, refetchUTMData } = useUTMTracking();
  const [dateFilter, setDateFilter] = useState('week');
  
  // Initialize real-time updates for the metrics dashboard
  useDashboardRealtime();
  
  // Fetch data when component mounts
  useEffect(() => {
    refetchStats();
    refetchMetrics();
    refetchUTMData();
  }, [refetchStats, refetchMetrics, refetchUTMData]);
  
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
        
        {/* Tabs for Chat and UTM Metrics */}
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Métricas de Chat
            </TabsTrigger>
            <TabsTrigger value="utm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Métricas UTM
            </TabsTrigger>
          </TabsList>
          
          {/* Chat Metrics Tab */}
          <TabsContent value="chat" className="space-y-8">
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
          </TabsContent>
          
          {/* UTM Metrics Tab */}
          <TabsContent value="utm" className="space-y-8">
            {/* UTM KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard 
                title="Campanhas Ativas"
                value={utmMetrics.totalCampaigns}
                icon={<Share2 />}
                trend="Campanhas UTM únicas"
                loading={utmLoading}
                iconBgClass="bg-cyan-100 dark:bg-cyan-900/30"
                iconTextClass="text-cyan-600 dark:text-cyan-400"
              />
              
              <StatCard 
                title="Leads via UTM"
                value={utmMetrics.totalLeads}
                icon={<Users />}
                trend="Total de leads rastreados"
                loading={utmLoading}
                iconBgClass="bg-emerald-100 dark:bg-emerald-900/30"
                iconTextClass="text-emerald-600 dark:text-emerald-400"
              />
              
              <StatCard 
                title="Taxa de Conversão UTM"
                value={`${utmMetrics.conversionRate}%`}
                icon={<Target />}
                trend="Conversão de campanhas UTM"
                loading={utmLoading}
                iconBgClass="bg-amber-100 dark:bg-amber-900/30"
                iconTextClass="text-amber-600 dark:text-amber-400"
              />
            </div>

            {/* UTM Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UTMCampaignChart data={utmMetrics.campaignData} loading={utmLoading} />
              <UTMSourceChart data={utmMetrics.sourceData} loading={utmLoading} />
            </div>
            
            {/* UTM Tables Section */}
            <div className="grid grid-cols-1 gap-6">
              <UTMTrackingTable data={utmMetrics.recentTracking} loading={utmLoading} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MetricsDashboard;
