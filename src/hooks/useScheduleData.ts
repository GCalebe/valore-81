
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  clientName: string;
  phone: string;
  service: string;
  status: string;
  notes?: string;
}

export function useScheduleData() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchScheduleData = useCallback(async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('Fetching schedule data from agendamentos table...');
      
      // Buscar agendamentos com dados do cliente e serviço
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('agendamentos')
        .select(`
          *,
          dados_cliente (
            id,
            nome,
            telefone,
            email
          ),
          servicos (
            id,
            nome,
            preco,
            duracao_minutos
          )
        `)
        .order('data_agendamento', { ascending: true });
      
      if (appointmentsError) {
        console.error('Error fetching appointments:', appointmentsError);
        throw appointmentsError;
      }
      
      console.log(`Found ${appointmentsData?.length || 0} appointments from database`);
      console.log('Appointments data:', appointmentsData);
      
      if (appointmentsData && appointmentsData.length > 0) {
        const scheduleEvents: ScheduleEvent[] = appointmentsData.map((appointment) => {
          const appointmentDate = new Date(appointment.data_agendamento);
          const clientName = appointment.dados_cliente?.nome || 'Cliente não identificado';
          const serviceName = appointment.servicos?.nome || appointment.observacoes || 'Serviço não especificado';
          
          return {
            id: appointment.id,
            title: `${serviceName} - ${clientName}`,
            date: appointmentDate,
            time: appointmentDate.toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            clientName: clientName,
            phone: appointment.dados_cliente?.telefone || 'Não informado',
            service: serviceName,
            status: appointment.status || 'agendado',
            notes: appointment.observacoes
          };
        });
        
        setEvents(scheduleEvents);
        console.log(`Successfully processed ${scheduleEvents.length} schedule events`);
        
        if (showRefreshingState) {
          toast({
            title: "Dados atualizados",
            description: `${scheduleEvents.length} agendamentos carregados com sucesso.`,
          });
        }
      } else {
        console.log('No appointments found in database');
        setEvents([]);
        
        if (showRefreshingState) {
          toast({
            title: "Nenhum agendamento encontrado",
            description: "Não há agendamentos cadastrados no momento.",
          });
        }
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Ocorreu um erro ao carregar os agendamentos. Tente novamente.",
        variant: "destructive"
      });
      // Em caso de erro, definir array vazio para evitar estados indefinidos
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toast]);

  const refreshScheduleData = useCallback(async () => {
    console.log('Manual refresh of schedule data requested');
    await fetchScheduleData(true);
  }, [fetchScheduleData]);

  useEffect(() => {
    console.log('useScheduleData: Initial data fetch');
    fetchScheduleData();
  }, [fetchScheduleData]);

  return {
    events,
    loading,
    refreshing,
    refetchScheduleData: refreshScheduleData
  };
}
