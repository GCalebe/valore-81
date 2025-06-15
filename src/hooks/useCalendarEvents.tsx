
// Refatorado! Toda lógica de cache e fetch extraída para hooks/utilitários menores
import { useState, useEffect, useCallback, useRef } from 'react';
import type { CalendarEvent, EventFormData } from '@/types/calendar';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fetchCalendarEvents } from './useFetchCalendarEvents';
import { getCacheKey, loadFromCache, saveToCache } from './calendarCache';

// Sync com os outros arquivos utilitários
type DateRange = { start: Date; end: Date; };

export function useCalendarEvents(selectedDate?: Date | null, dateRange?: DateRange | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cacheKey = getCacheKey(selectedDate || undefined, dateRange || undefined);
  const lastUpdateRef = useRef<number>(0);

  // Usando função isolada
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let loadedFromCache = false;
    try {
      // Cache local primeiro (otimização)
      const cached = loadFromCache(cacheKey);
      if (cached) {
        setEvents(cached);
        setLastUpdated(new Date());
        loadedFromCache = true;
        console.log("[useCalendarEvents] Eventos carregados do cache local");
      }
      // Busca sempre
      const apiEvents = await fetchCalendarEvents(selectedDate || undefined, dateRange || undefined);
      setEvents(apiEvents);
      setLastUpdated(new Date());
      saveToCache(cacheKey, apiEvents);
      if (loadedFromCache) toast.success("Agenda atualizada!");
      lastUpdateRef.current = Date.now();
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      if (!loadedFromCache) setEvents([]);
      toast.error("Erro ao buscar eventos. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, dateRange, cacheKey]);

  // Atualização manual
  const refreshEventsPost = useCallback(async () => {
    setIsLoading(true);
    try {
      const apiEvents = await fetchCalendarEvents(selectedDate || undefined, dateRange || undefined);
      setEvents(apiEvents);
      setLastUpdated(new Date());
      saveToCache(cacheKey, apiEvents);
      lastUpdateRef.current = Date.now();
      setError(null);
      toast.success("Eventos atualizados com sucesso!");
    } catch (err) {
      console.error('[useCalendarEvents] Erro no refresh manual:', err);
      toast.error("Erro ao atualizar eventos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, dateRange, cacheKey]);

  // Visibilidade/tab focus
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        const now = Date.now();
        if (now - lastUpdateRef.current > 2.5 * 60 * 1000) {
          fetchEvents();
        }
      }
    }
    window.addEventListener('visibilitychange', onVisibilityChange);
    return () => window.removeEventListener('visibilitychange', onVisibilityChange);
  }, [fetchEvents]);

  // Carregar eventos ao carregar/mudar data/período
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --- Funções de manipulação de eventos (add/edit/delete) mantidas aqui ---
  const addEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
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
      const response = await fetch('https://webhook.comercial247.com.br/webhook/agenda/adicionar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error(`Erro ao adicionar evento: ${response.status} ${response.statusText}`);
      toast.success("Evento adicionado com sucesso!");
      await fetchEvents();
      return true;
    } catch (err) {
      console.error('[useCalendarEvents] Erro ao adicionar evento:', err);
      toast.error("Erro ao adicionar evento. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editEvent = async (eventId: string, formData: EventFormData) => {
    setIsSubmitting(true);
    try {
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
      const response = await fetch('https://webhook.n8nlabz.com.br/webhook/agenda/alterar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error(`Erro ao editar evento: ${response.status} ${response.statusText}`);
      toast.success("Evento editado com sucesso!");
      await fetchEvents();
      return true;
    } catch (err) {
      console.error('[useCalendarEvents] Erro ao editar evento:', err);
      toast.error("Erro ao editar evento. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    setIsSubmitting(true);
    try {
      const eventToDelete = events.find(e => e.id === eventId);
      if (!eventToDelete) throw new Error('Evento não encontrado');
      const eventData = {
        id: eventId,
        summary: eventToDelete.summary,
        description: eventToDelete.description || '',
        start: eventToDelete.start,
        end: eventToDelete.end,
        email: eventToDelete.attendees?.find(a => a?.email)?.email || '',
        hostName: eventToDelete.hostName || ''
      };
      const response = await fetch('https://webhook.n8nlabz.com.br/webhook/agenda/excluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error(`Erro ao excluir evento: ${response.status} ${response.statusText}`);
      toast.success("Evento excluído com sucesso!");
      await fetchEvents();
      return true;
    } catch (err) {
      console.error('[useCalendarEvents] Erro ao excluir evento:', err);
      toast.error("Erro ao excluir evento. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Exporta todos os métodos/estados
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

// Exportação de tipos 
export type { CalendarEvent, EventFormData } from '@/types/calendar';
