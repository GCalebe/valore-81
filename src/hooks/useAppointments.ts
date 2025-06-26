import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

      // Since agendamentos table doesn't exist, we'll simulate appointments using client data
      const { data, error } = await supabase
        .from("dados_cliente")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching client data for appointments:", error);
        setAppointments([]);
        return;
      }

      // Transform client data into appointment-like structure for compatibility
      const simulatedAppointments: Appointment[] =
        data?.map((client) => ({
          id: client.id,
          cliente_id: client.id,
          data_agendamento: client.created_at || new Date().toISOString(),
          status: client.kanban_stage || "Agendado",
          observacoes: `Cliente de marketing digital - ${
            client.client_type || "Tipo não definido"
          }`,
          created_at: client.created_at,
          updated_at: client.created_at,
          cliente: {
            id: client.id,
            nome: client.nome || "Cliente sem nome",
            telefone: client.telefone || "Não informado",
            email: client.email || "Não informado",
          },
          servico: {
            id: 1,
            nome: `Consultoria ${client.client_type || "Marketing"}`,
            preco: 500,
            duracao_minutos: 120,
          },
        })) || [];

      setAppointments(simulatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Erro ao carregar agendamentos",
        description: "Ocorreu um erro ao carregar os dados de clientes.",
        variant: "destructive",
      });
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const addAppointment = async (
    appointmentData: Omit<
      Appointment,
      "id" | "created_at" | "updated_at" | "cliente" | "servico"
    >,
  ) => {
    try {
      toast({
        title: "Funcionalidade adaptada",
        description:
          "No sistema de agência de marketing, os 'agendamentos' são baseados em interações com clientes.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Erro ao criar agendamento",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const updateAppointment = async (
    id: number,
    appointmentData: Partial<Appointment>,
  ) => {
    try {
      toast({
        title: "Funcionalidade adaptada",
        description:
          "No sistema de agência de marketing, os 'agendamentos' são baseados em interações com clientes.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
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
        title: "Funcionalidade adaptada",
        description:
          "No sistema de agência de marketing, os 'agendamentos' são baseados em interações com clientes.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
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
    deleteAppointment,
  };
}
