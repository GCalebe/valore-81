
// Refatorado: importações reorganizadas + delegação para helpers externos
import * as React from "react";
import type { CalendarEvent, EventFormData } from "@/types/calendar";
import { fetchCalendarEvents } from "./useFetchCalendarEvents";
import { getCacheKey, loadFromCache, saveToCache } from "./calendarCache";
import { useDebouncedCallback } from "./useDebouncedCallback";
import {
  addCalendarEvent,
  editCalendarEvent,
  deleteCalendarEvent,
} from "./calendarEventActions";
import { toast } from "sonner";

// Sync com os outros arquivos utilitários
type DateRange = { start: Date; end: Date };

// Função principal
export function useCalendarEvents(
  selectedDate?: Date | null,
  dateRange?: DateRange | null
) {
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const cacheKey = getCacheKey(selectedDate || undefined, dateRange || undefined);
  const lastUpdateRef = React.useRef<number>(0);

  // Armazenar os últimos eventos válidos do cache/disco
  const lastCacheEvents = React.useRef<CalendarEvent[]>([]);

  // Função para buscar eventos (debounced pelo hook externo)
  const fetchEventsDebounced = useDebouncedCallback(async () => {
    setIsLoading(true);
    setError(null);
    let loadedFromCache = false;
    try {
      const cached = loadFromCache(cacheKey);
      if (cached) {
        setEvents(cached);
        lastCacheEvents.current = cached;
        setLastUpdated(new Date());
        loadedFromCache = true;
        console.log("[useCalendarEvents] Eventos carregados do cache local");
      }
      const apiEvents = await fetchCalendarEvents(
        selectedDate || undefined,
        dateRange || undefined
      );
      setEvents(apiEvents);
      lastCacheEvents.current = apiEvents;
      setLastUpdated(new Date());
      saveToCache(cacheKey, apiEvents);
      if (loadedFromCache) toast.success("Agenda atualizada!");
      lastUpdateRef.current = Date.now();
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      if (!loadedFromCache && lastCacheEvents.current.length === 0)
        setEvents([]);
      toast.error(
        "Erro ao buscar eventos. Verifique sua conexão (retry automático)."
      );
    } finally {
      setIsLoading(false);
    }
  }, 400);

  // Atualização manual
  const refreshEventsPost = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const apiEvents = await fetchCalendarEvents(
        selectedDate || undefined,
        dateRange || undefined
      );
      setEvents(apiEvents);
      lastCacheEvents.current = apiEvents;
      setLastUpdated(new Date());
      saveToCache(cacheKey, apiEvents);
      lastUpdateRef.current = Date.now();
      setError(null);
      toast.success("Eventos atualizados com sucesso!");
    } catch (err) {
      console.error("[useCalendarEvents] Erro no refresh manual:", err);
      toast.error("Erro ao atualizar eventos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, dateRange, cacheKey]);

  // Visibilidade/tab focus
  React.useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastUpdateRef.current > 2.5 * 60 * 1000) {
          fetchEventsDebounced();
        }
      }
    }
    window.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      window.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchEventsDebounced]);

  // Carregar eventos ao carregar/mudar data/período (com debounce)
  React.useEffect(() => {
    fetchEventsDebounced();
  }, [fetchEventsDebounced]);

  // --- Funções de manipulação de eventos (delegadas para helpers) ---
  const addEvent = React.useCallback(
    async (formData: EventFormData) => {
      setIsSubmitting(true);
      const ok = await addCalendarEvent(formData);
      if (ok) await fetchEventsDebounced();
      setIsSubmitting(false);
      return ok;
    },
    [fetchEventsDebounced]
  );

  const editEvent = React.useCallback(
    async (eventId: string, formData: EventFormData) => {
      setIsSubmitting(true);
      const ok = await editCalendarEvent(eventId, formData);
      if (ok) await fetchEventsDebounced();
      setIsSubmitting(false);
      return ok;
    },
    [fetchEventsDebounced]
  );

  const deleteEvent = React.useCallback(
    async (eventId: string) => {
      setIsSubmitting(true);
      // Para manter compatibilidade, busca pelos dados do evento a partir do cache local
      const eventToDelete = events.find((e) => e.id === eventId);
      let ok = false;
      if (!eventToDelete) {
        toast.error("Evento não encontrado");
      } else {
        ok = await deleteCalendarEvent(eventToDelete);
        if (ok) await fetchEventsDebounced();
      }
      setIsSubmitting(false);
      return ok;
    },
    [fetchEventsDebounced, events]
  );

  // Exporta todos os métodos/estados
  return {
    events,
    isLoading,
    error,
    lastUpdated,
    refreshEvents: fetchEventsDebounced,
    refreshEventsPost,
    addEvent,
    editEvent,
    deleteEvent,
    isSubmitting,
  };
}

// Exportação de tipos 
export type { CalendarEvent, EventFormData } from "@/types/calendar";
