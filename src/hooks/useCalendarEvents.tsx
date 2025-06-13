
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function useCalendarEvents(selectedDate?: Date | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para buscar eventos do endpoint n8n
  const fetchEventsFromN8N = useCallback(async (targetDate?: Date) => {
    try {
      console.log('Buscando eventos do n8n para a data:', targetDate || 'hoje');
      
      const dateToUse = targetDate || new Date();
      
      // Formatar datas para o endpoint (início e fim do dia)
      const startDate = format(dateToUse, 'yyyy-MM-dd') + 'T00:00:00.000-03:00';
      const endDate = format(dateToUse, 'yyyy-MM-dd') + 'T23:59:59.999-03:00';
      
      console.log('Enviando requisição com datas:', { startDate, endDate });
      
      const url = new URL('https://webhook.comercial247.com.br/webhook/agenda');
      url.searchParams.append('startDate', startDate);
      url.searchParams.append('endDate', endDate);
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Resposta do n8n recebida:', data);
      
      // Verificar se os dados são um array ou se precisam ser extraídos
      const eventsArray = Array.isArray(data) ? data : (data.events || []);
      
      // Mapear os dados para o formato CalendarEvent
      const mappedEvents: CalendarEvent[] = eventsArray.map((event: any) => ({
        id: event.id || `event-${Date.now()}-${Math.random()}`,
        summary: event.summary || 'Evento sem título',
        description: event.description || '',
        start: event.start,
        end: event.end,
        status: event.status || 'confirmed',
        htmlLink: event.htmlLink || '#',
        attendees: event.attendees || []
      }));
      
      console.log(`${mappedEvents.length} eventos processados com sucesso`);
      return mappedEvents;
      
    } catch (err) {
      console.error('Erro ao buscar eventos do n8n:', err);
      throw err;
    }
  }, []);

  // Função principal para carregar eventos
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedEvents = await fetchEventsFromN8N(selectedDate || undefined);
      
      setEvents(fetchedEvents);
      setLastUpdated(new Date());
      
      console.log(`Eventos carregados: ${fetchedEvents.length}`);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      
      // Manter eventos anteriores em caso de erro
      if (events.length === 0) {
        setEvents([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, fetchEventsFromN8N, events.length]);

  // Função para refresh manual
  const refreshEventsPost = useCallback(async () => {
    console.log('Refresh manual dos eventos solicitado');
    try {
      const fetchedEvents = await fetchEventsFromN8N(selectedDate || undefined);
      setEvents(fetchedEvents);
      setLastUpdated(new Date());
      setError(null);
      toast.success("Eventos atualizados com sucesso!");
    } catch (err) {
      console.error('Erro no refresh manual:', err);
      toast.error("Erro ao atualizar eventos. Tente novamente.");
    }
  }, [selectedDate, fetchEventsFromN8N]);

  // Simular adição de evento (não implementado para API externa)
  const addEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Simulando adição de evento:', formData);
      
      // Para API externa, você precisaria implementar um endpoint POST
      // Por enquanto, apenas mostramos uma mensagem
      toast.info("Para adicionar eventos, use o Google Calendar diretamente.");
      
      // Após adicionar, buscar eventos atualizados
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar evento:', err);
      toast.error("Erro ao adicionar evento. Use o Google Calendar.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simular edição de evento (não implementado para API externa)
  const editEvent = async (eventId: string, formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Simulando edição de evento:', eventId, formData);
      
      toast.info("Para editar eventos, use o Google Calendar diretamente.");
      
      // Após editar, buscar eventos atualizados
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      toast.error("Erro ao editar evento. Use o Google Calendar.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simular exclusão de evento (não implementado para API externa)
  const deleteEvent = async (eventId: string) => {
    setIsSubmitting(true);
    try {
      console.log('Simulando exclusão de evento:', eventId);
      
      toast.info("Para excluir eventos, use o Google Calendar diretamente.");
      
      // Após excluir, buscar eventos atualizados
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      toast.error("Erro ao excluir evento. Use o Google Calendar.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carregar eventos quando a data mudar
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Polling automático a cada 30 segundos
  useEffect(() => {
    console.log('Iniciando polling automático da agenda (30s)');
    
    const intervalId = setInterval(async () => {
      console.log('Executando atualização automática dos eventos...');
      try {
        const fetchedEvents = await fetchEventsFromN8N(selectedDate || undefined);
        setEvents(fetchedEvents);
        setLastUpdated(new Date());
        setError(null);
        console.log('Atualização automática concluída com sucesso');
      } catch (err) {
        console.error('Erro na atualização automática:', err);
        // Em caso de erro, manter os eventos atuais
      }
    }, 30000); // 30 segundos

    return () => {
      console.log('Parando polling automático da agenda');
      clearInterval(intervalId);
    };
  }, [selectedDate, fetchEventsFromN8N]);

  return { 
    events, 
    isLoading, 
    error, 
    lastUpdated, 
    refreshEvents: fetchEvents,
    refreshEventsPost,
    addEvent,
    editEvent,
    deleteEvent,
    isSubmitting
  };
}

// Re-exportar tipos para compatibilidade
export type { CalendarEvent, EventFormData } from '@/types/calendar';
