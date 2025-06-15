import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DateRange {
  start: Date;
  end: Date;
}

export function useCalendarEvents(selectedDate?: Date | null, dateRange?: DateRange | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para buscar eventos do endpoint n8n
  const fetchEventsFromN8N = useCallback(async (targetDate?: Date, targetRange?: DateRange) => {
    try {
      console.log('=== INÍCIO DEBUG EVENTOS ===');
      console.log('Buscando eventos do n8n para:', { targetDate, targetRange });
      
      let start: string;
      let end: string;
      
      if (targetRange) {
        // Se temos um intervalo, usar ele
        start = format(targetRange.start, 'yyyy-MM-dd') + 'T00:00:00.000-03:00';
        end = format(targetRange.end, 'yyyy-MM-dd') + 'T23:59:59.999-03:00';
        console.log('Usando intervalo de datas:', { start: targetRange.start, end: targetRange.end });
      } else {
        // Caso contrário, usar apenas a data específica
        const dateToUse = targetDate || new Date();
        start = format(dateToUse, 'yyyy-MM-dd') + 'T00:00:00.000-03:00';
        end = format(dateToUse, 'yyyy-MM-dd') + 'T23:59:59.999-03:00';
        console.log('Usando data específica:', dateToUse);
      }
      
      console.log('Enviando requisição com datas:', { start, end });
      
      const url = new URL('https://webhook.comercial247.com.br/webhook/agenda');
      url.searchParams.append('start', start);
      url.searchParams.append('end', end);
      
      console.log('URL completa da requisição:', url.toString());
      
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
      console.log('=== RESPOSTA BRUTA DA API ===');
      console.log('Tipo da resposta:', typeof data);
      console.log('É array?', Array.isArray(data));
      console.log('Resposta completa:', JSON.stringify(data, null, 2));
      
      // Verificar se os dados são um array ou se precisam ser extraídos
      const eventsArray = Array.isArray(data) ? data : (data.events || []);
      console.log('=== ARRAY DE EVENTOS EXTRAÍDO ===');
      console.log('Quantidade de eventos no array:', eventsArray.length);
      
      // Log detalhado de cada evento antes do mapeamento
      eventsArray.forEach((event, index) => {
        console.log(`Evento ${index + 1} (antes do mapeamento):`, {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          status: event.status,
          hasValidData: !!(event.id && event.summary && event.start && event.end)
        });
      });
      
      // Mapear os dados para o formato CalendarEvent
      const mappedEvents: CalendarEvent[] = eventsArray.map((event: any, index: number) => {
        const mappedEvent = {
          id: event.id || `event-${Date.now()}-${Math.random()}`,
          summary: event.summary || 'Evento sem título',
          description: event.description || '',
          start: event.start,
          end: event.end,
          status: event.status || 'confirmed',
          htmlLink: event.htmlLink || '#',
          attendees: event.attendees || [],
          hostName: event.hostName || ''
        };
        
        console.log(`Evento ${index + 1} (após mapeamento):`, {
          id: mappedEvent.id,
          summary: mappedEvent.summary,
          start: mappedEvent.start,
          end: mappedEvent.end,
          hasValidDates: !!(mappedEvent.start && mappedEvent.end)
        });
        
        return mappedEvent;
      });
      
      // Filtrar eventos com dados válidos
      const validEvents = mappedEvents.filter(event => {
        const isValid = !!(event.start && event.end && event.summary && event.summary !== 'Evento sem título');
        if (!isValid) {
          console.log('Evento inválido filtrado:', {
            id: event.id,
            summary: event.summary,
            start: event.start,
            end: event.end
          });
        }
        return isValid;
      });
      
      console.log('=== EVENTOS FINAIS ===');
      console.log(`Eventos válidos processados: ${validEvents.length} de ${mappedEvents.length} total`);
      validEvents.forEach((event, index) => {
        console.log(`Evento válido ${index + 1}:`, {
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          startDate: event.start ? new Date(event.start).toLocaleDateString('pt-BR') : 'Data inválida',
          startTime: event.start ? new Date(event.start).toLocaleTimeString('pt-BR') : 'Hora inválida'
        });
      });
      
      console.log('=== FIM DEBUG EVENTOS ===');
      return validEvents;
      
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
      
      const fetchedEvents = await fetchEventsFromN8N(selectedDate || undefined, dateRange || undefined);
      
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
  }, [selectedDate, dateRange, fetchEventsFromN8N, events.length]);

  // Função para refresh manual
  const refreshEventsPost = useCallback(async () => {
    console.log('Refresh manual dos eventos solicitado');
    try {
      const fetchedEvents = await fetchEventsFromN8N(selectedDate || undefined, dateRange || undefined);
      setEvents(fetchedEvents);
      setLastUpdated(new Date());
      setError(null);
      toast.success("Eventos atualizados com sucesso!");
    } catch (err) {
      console.error('Erro no refresh manual:', err);
      toast.error("Erro ao atualizar eventos. Tente novamente.");
    }
  }, [selectedDate, dateRange, fetchEventsFromN8N]);

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
        email: formData.email,
        hostName: formData.hostName
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
        email: formData.email,
        hostName: formData.hostName
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
        email: eventToDelete.attendees?.find(a => a?.email)?.email || '',
        hostName: eventToDelete.hostName || ''
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
