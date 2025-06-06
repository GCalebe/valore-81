
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Appointment {
  id: number;
  cliente_id?: number;
  servico_id?: number;
  data_agendamento: string;
  status?: string;
  observacoes?: string;
  created_at?: string;
  updated_at?: string;
  // Related data
  cliente?: {
    id: number;
    nome: string;
    telefone: string;
    email: string;
  };
  servico?: {
    id: number;
    nome: string;
    preco: number;
    duracao_minutos: number;
  };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Get appointments first
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('agendamentos')
        .select('*')
        .order('data_agendamento', { ascending: true });
      
      if (appointmentsError) throw appointmentsError;
      
      if (!appointmentsData) {
        setAppointments([]);
        return;
      }

      // Get related cliente and servico data separately to avoid foreign key conflicts
      const appointmentsWithRelated = await Promise.all(
        appointmentsData.map(async (appointment) => {
          const appointmentWithRelated: Appointment = { ...appointment };

          // Fetch cliente data if cliente_id exists
          if (appointment.cliente_id) {
            const { data: clienteData } = await supabase
              .from('dados_cliente')
              .select('id, nome, telefone, email')
              .eq('id', appointment.cliente_id)
              .single();
            
            if (clienteData) {
              appointmentWithRelated.cliente = clienteData;
            }
          }

          // Fetch servico data if servico_id exists
          if (appointment.servico_id) {
            const { data: servicoData } = await supabase
              .from('servicos')
              .select('id, nome, preco, duracao_minutos')
              .eq('id', appointment.servico_id)
              .single();
            
            if (servicoData) {
              appointmentWithRelated.servico = servicoData;
            }
          }

          return appointmentWithRelated;
        })
      );
      
      setAppointments(appointmentsWithRelated);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Ocorreu um erro ao buscar os agendamentos do banco de dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'cliente' | 'servico'>) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([appointmentData])
        .select();
      
      if (error) throw error;
      
      if (data) {
        // Refresh appointments to get the complete data with relations
        await fetchAppointments();
        toast({
          title: "Agendamento criado",
          description: "O agendamento foi criado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const updateAppointment = async (id: number, appointmentData: Partial<Appointment>) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update(appointmentData)
        .eq('id', id);
      
      if (error) throw error;
      
      // Refetch to get updated data
      await fetchAppointments();
      
      toast({
        title: "Agendamento atualizado",
        description: "As informações do agendamento foram atualizadas.",
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erro ao atualizar agendamento",
        description: "Não foi possível atualizar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      
      toast({
        title: "Agendamento removido",
        description: "O agendamento foi removido com sucesso.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erro ao remover agendamento",
        description: "Não foi possível remover o agendamento.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
}
