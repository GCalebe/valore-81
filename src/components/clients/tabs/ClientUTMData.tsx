import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { Contact } from '@/types/contact';
import { UTMData } from '@/types/utmData';

interface ClientUTMDataProps {
  /**
   * Dados do contato do cliente
   */
  contact: Contact;
  
  /**
   * Define se o componente deve ser exibido em modo compacto
   * @default false
   */
  compact?: boolean;
}

/**
 * Componente que exibe os dados UTM do cliente
 */
export const ClientUTMData: React.FC<ClientUTMDataProps> = ({
  contact,
  compact = false,
}) => {
  const [utmData, setUtmData] = useState<UTMData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchUTMData = async () => {
      if (!contact?.id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('utm_data')
          .select('*')
          .eq('contact_id', contact.id);

        if (error) throw error;
        setUtmData(data || []);
      } catch (error) {
        console.error('Erro ao buscar dados UTM:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUTMData();
  }, [contact?.id]);

  // Cálculos para o resumo
  const totalInteractions = utmData.length;
  const uniqueCampaigns = [...new Set(utmData.map(item => item.utm_campaign))].filter(Boolean).length;
  const conversionRate = contact?.converted ? 100 : 0; // Simplificado, ajustar conforme lógica real

  // Principais fontes
  const sourcesCount = utmData.reduce((acc, item) => {
    if (item.utm_source) {
      acc[item.utm_source] = (acc[item.utm_source] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topSources = Object.entries(sourcesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Principais campanhas
  const campaignsCount = utmData.reduce((acc, item) => {
    if (item.utm_campaign) {
      acc[item.utm_campaign] = (acc[item.utm_campaign] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCampaigns = Object.entries(campaignsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Agrupar UTMs únicos para a tabela de configurações
  const uniqueUTMCombinations = utmData.reduce((acc, item) => {
    const key = `${item.utm_source || '-'}_${item.utm_medium || '-'}_${item.utm_campaign || '-'}_${item.utm_content || '-'}_${item.utm_term || '-'}`;
    if (!acc[key]) {
      acc[key] = {
        source: item.utm_source || '-',
        medium: item.utm_medium || '-',
        campaign: item.utm_campaign || '-',
        content: item.utm_content || '-',
        term: item.utm_term || '-',
        count: 0,
      };
    }
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { source: string; medium: string; campaign: string; content: string; term: string; count: number }>);

  const utmCombinations = Object.values(uniqueUTMCombinations).sort((a, b) => b.count - a.count);

  // Gerar nome amigável para UTM
  const generateFriendlyName = (utm: { source: string; medium: string; campaign: string }) => {
    const parts = [];
    if (utm.source && utm.source !== '-') parts.push(utm.source);
    if (utm.medium && utm.medium !== '-') parts.push(`via ${utm.medium}`);
    if (utm.campaign && utm.campaign !== '-') parts.push(`(${utm.campaign})`);
    
    return parts.length > 0 ? parts.join(' ') : 'Direto';
  };

  if (loading) {
    return (
      <Card className={compact ? 'p-3' : 'p-4'}>
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-lg">Dados UTM</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (utmData.length === 0) {
    return (
      <Card className={compact ? 'p-3' : 'p-4'}>
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-lg">Dados UTM</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-center py-6 text-gray-500">
            <p>Nenhum dado UTM encontrado para este cliente.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'p-3' : 'p-4'}>
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg">Dados UTM</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-bold">{totalInteractions}</p>
                  <p className="text-sm text-gray-500">Interações Totais</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-bold">{uniqueCampaigns}</p>
                  <p className="text-sm text-gray-500">Campanhas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-2xl font-bold">{conversionRate}%</p>
                  <p className="text-sm text-gray-500">Taxa de Conversão</p>
                </CardContent>
              </Card>
            </div>

            {/* Principais fontes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-md">Principais Fontes</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {topSources.length > 0 ? (
                    <ul className="space-y-2">
                      {topSources.map(([source, count]) => (
                        <li key={source} className="flex justify-between items-center">
                          <span className="text-sm">{source}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhuma fonte encontrada</p>
                  )}
                </CardContent>
              </Card>

              {/* Principais campanhas */}
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-md">Principais Campanhas</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {topCampaigns.length > 0 ? (
                    <ul className="space-y-2">
                      {topCampaigns.map(([campaign, count]) => (
                        <li key={campaign} className="flex justify-between items-center">
                          <span className="text-sm">{campaign}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-2">Nenhuma campanha encontrada</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Amigável</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Medium</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead className="text-right">Contagem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {utmCombinations.map((utm, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {generateFriendlyName(utm)}
                      </TableCell>
                      <TableCell>{utm.source}</TableCell>
                      <TableCell>{utm.medium}</TableCell>
                      <TableCell>{utm.campaign}</TableCell>
                      <TableCell>{utm.content}</TableCell>
                      <TableCell>{utm.term}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{utm.count}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientUTMData;