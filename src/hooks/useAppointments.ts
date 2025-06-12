
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
      
      // Since the agendamentos table doesn't exist, we'll return an empty array
      // This prevents the application from breaking while the proper table structure is being set up
      console.log('Agendamentos table not found in database. Returning empty appointments list.');
      setAppointments([]);
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "A tabela de agendamentos não foi encontrada no banco de dados.",
        variant: "destructive"
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'cliente' | 'servico'>) => {
    try {
      // Since the table doesn't exist, we'll show a message to the user
      toast({
        title: "Funcionalidade não disponível",
        description: "A tabela de agendamentos ainda não foi configurada no banco de dados.",
        variant: "destructive",
      });
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
      toast({
        title: "Funcionalidade não disponível",
        description: "A tabela de agendamentos ainda não foi configurada no banco de dados.",
        variant: "destructive",
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
      toast({
        title: "Funcionalidade não disponível",
        description: "A tabela de agendamentos ainda não foi configurada no banco de dados.",
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
