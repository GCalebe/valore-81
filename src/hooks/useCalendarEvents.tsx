
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
      const start = format(dateToUse, 'yyyy-MM-dd') + 'T00:00:00.000-03:00';
      const end = format(dateToUse, 'yyyy-MM-dd') + 'T23:59:59.999-03:00';
      
      console.log('Enviando requisição com datas:', { start, end });
      
      const url = new URL('https://webhook.comercial247.com.br/webhook/agenda');
      url.searchParams.append('start', start);
      url.searchParams.append('end', end);
      
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

  // Função para adicionar evento
  const addEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Adicionando novo evento:', formData);
      
      // Formar as datas no formato ISO com timezone
      const startDateTime = `${format(formData.date, 'yyyy-MM-dd')}T${formData.startTime}:00-03:00`;
      const endDateTime = `${format(formData.date, 'yyyy-MM-dd')}T${formData.endTime}:00-03:00`;
      
      const eventData = {
        summary: formData.summary,
        description: formData.description,
        start: startDateTime,
        end: endDateTime,
        email: formData.email
      };
      
      console.log('Dados do evento para envio:', eventData);
      
      const response = await fetch('https://webhook.comercial247.com.br/webhook/agenda/adicionar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao adicionar evento: ${response.status} ${response.statusText}`);
      }
      
      console.log('Evento adicionado com sucesso');
      toast.success("Evento adicionado com sucesso!");
      
      // Atualizar lista de eventos
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erro ao adicionar evento:', err);
      toast.error("Erro ao adicionar evento. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para editar evento
  const editEvent = async (eventId: string, formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Editando evento:', eventId, formData);
      
      // Formar as datas no formato ISO com timezone
      const startDateTime = `${format(formData.date, 'yyyy-MM-dd')}T${formData.startTime}:00-03:00`;
      const endDateTime = `${format(formData.date, 'yyyy-MM-dd')}T${formData.endTime}:00-03:00`;
      
      const eventData = {
        id: eventId,
        summary: formData.summary,
        description: formData.description,
        start: startDateTime,
        end: endDateTime,
        email: formData.email
      };
      
      console.log('Dados do evento para edição:', eventData);
      
      const response = await fetch('https://webhook.n8nlabz.com.br/webhook/agenda/alterar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao editar evento: ${response.status} ${response.statusText}`);
      }
      
      console.log('Evento editado com sucesso');
      toast.success("Evento editado com sucesso!");
      
      // Atualizar lista de eventos
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erro ao editar evento:', err);
      toast.error("Erro ao editar evento. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para excluir evento
  const deleteEvent = async (eventId: string) => {
    setIsSubmitting(true);
    try {
      console.log('Excluindo evento:', eventId);
      
      // Encontrar o evento para obter todos os dados necessários
      const eventToDelete = events.find(e => e.id === eventId);
      if (!eventToDelete) {
        throw new Error('Evento não encontrado');
      }
      
      const eventData = {
        id: eventId,
        summary: eventToDelete.summary,
        description: eventToDelete.description || '',
        start: eventToDelete.start,
        end: eventToDelete.end,
        email: eventToDelete.attendees?.find(a => a?.email)?.email || ''
      };
      
      console.log('Dados do evento para exclusão:', eventData);
      
      const response = await fetch('https://webhook.n8nlabz.com.br/webhook/agenda/excluir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir evento: ${response.status} ${response.statusText}`);
      }
      
      console.log('Evento excluído com sucesso');
      toast.success("Evento excluído com sucesso!");
      
      // Atualizar lista de eventos
      await fetchEvents();
      
      return true;
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      toast.error("Erro ao excluir evento. Tente novamente.");
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
