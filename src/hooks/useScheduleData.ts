import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/utils/logger";

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

  const transformClient = (client: any): ScheduleEvent => {
    const clientDate = new Date(client.created_at || new Date());
    return {
      id: client.id,
      title: `Consulta de Marketing - ${client.nome || "Cliente"}`,
      date: clientDate,
      time: clientDate.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      clientName: client.nome || "Cliente não identificado",
      phone: client.telefone || "Não informado",
      service: `Consultoria ${client.client_type || "Marketing Digital"}`,
      status: client.kanban_stage || "Entraram",
      notes: `Cliente: ${client.client_name || "Não especificado"} - Tipo: ${
        client.client_type || "Não especificado"
      }`,
    };
  };

  const fetchScheduleData = useCallback(async (showRefreshingState = false) => {
    try {
      if (showRefreshingState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      logger.debug("Fetching schedule data from dados_cliente table...");

      // Since agendamentos table doesn't exist, we'll simulate schedule events using client data
      const { data: clientsData, error: clientsError } = await supabase
        .from("dados_cliente")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(20);

      if (clientsError) {
        logger.error("Error fetching clients for schedule:", clientsError);
        throw clientsError;
      }

      logger.debug(
        `Found ${clientsData?.length || 0} clients for schedule simulation`,
      );

      if (clientsData && clientsData.length > 0) {
        // Transform client data into schedule events
        const scheduleEvents: ScheduleEvent[] =
          clientsData.map(transformClient);

        setEvents(scheduleEvents);
        logger.debug(
          `Successfully processed ${scheduleEvents.length} schedule events`,
        );

        if (showRefreshingState) {
          toast.success("Dados atualizados", {
            description: `${scheduleEvents.length} eventos de agenda carregados com sucesso.`,
          });
        }
      } else {
        logger.debug("No clients found for schedule simulation");
        setEvents([]);

        if (showRefreshingState) {
          toast.info("Nenhum evento encontrado", {
            description: "Não há eventos de agenda no momento.",
          });
        }
      }
    } catch (error) {
      logger.error("Error fetching schedule data:", error);
      toast.error("Erro ao carregar agenda", {
        description:
          "Ocorreu um erro ao carregar os eventos da agenda. Tente novamente.",
      });
      // Em caso de erro, definir array vazio para evitar estados indefinidos
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refreshScheduleData = useCallback(async () => {
    logger.debug("Manual refresh of schedule data requested");
    await fetchScheduleData(true);
  }, [fetchScheduleData]);

  useEffect(() => {
    logger.debug("useScheduleData: Initial data fetch");
    fetchScheduleData();
  }, [fetchScheduleData]);

  return {
    events,
    loading,
    refreshing,
    refetchScheduleData: refreshScheduleData,
  };
}
