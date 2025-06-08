
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent, EventFormData } from '@/types/calendar';
import { toast } from 'sonner';
import { format, parseISO, addDays, addHours } from 'date-fns';

// Dados fictícios para substituir o webhook externo
const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'mock-1',
    summary: 'Manutenção de Veleiro - Marina Santos',
    description: 'Revisão completa do sistema de velas e cordame',
    start: '2025-06-06T09:00:00-03:00',
    end: '2025-06-06T11:00:00-03:00',
    status: 'confirmed',
    htmlLink: '#',
    attendees: [{
      email: 'marina@santos.com',
      responseStatus: 'accepted'
    }]
  },
  {
    id: 'mock-2',
    summary: 'Inspeção de Casco - Yacht Club',
    description: 'Vistoria anual obrigatória para renovação de licença',
    start: '2025-06-06T14:00:00-03:00',
    end: '2025-06-06T16:00:00-03:00',
    status: 'confirmed',
    htmlLink: '#',
    attendees: [{
      email: 'vistoria@yachtclub.com',
      responseStatus: 'accepted'
    }]
  },
  {
    id: 'mock-3',
    summary: 'Curso de Navegação - Escola Náutica',
    description: 'Aula prática de navegação costeira',
    start: '2025-06-07T08:00:00-03:00',
    end: '2025-06-07T12:00:00-03:00',
    status: 'confirmed',
    htmlLink: '#',
    attendees: [{
      email: 'cursos@escolanautica.com',
      responseStatus: 'accepted'
    }]
  },
  {
    id: 'mock-4',
    summary: 'Regata de Fim de Semana',
    description: 'Competição de vela entre embarcações locais',
    start: '2025-06-08T07:00:00-03:00',
    end: '2025-06-08T18:00:00-03:00',
    status: 'tentative',
    htmlLink: '#',
    attendees: [{
      email: 'regata@clubevelico.com',
      responseStatus: 'tentative'
    }]
  },
  {
    id: 'mock-5',
    summary: 'Manutenção de Motor - Oficina Naval',
    description: 'Revisão e troca de óleo do motor de popa',
    start: '2025-06-09T10:00:00-03:00',
    end: '2025-06-09T15:00:00-03:00',
    status: 'confirmed',
    htmlLink: '#',
    attendees: [{
      email: 'manutencao@oficinanaval.com',
      responseStatus: 'accepted'
    }]
  }
];

export function useCalendarEvents(selectedDate?: Date | null) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para filtrar eventos fictícios baseado na data selecionada
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Carregando eventos fictícios...');
      
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredEvents = mockCalendarEvents;
      
      // Filtrar por data se selecionada
      if (selectedDate) {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        filteredEvents = mockCalendarEvents.filter(event => {
          const eventDate = format(parseISO(event.start), 'yyyy-MM-dd');
          return eventDate === dateStr;
        });
        console.log(`Eventos filtrados para ${dateStr}:`, filteredEvents.length);
      }
      
      setEvents(filteredEvents);
      setLastUpdated(new Date());
      setError(null);
      
      console.log(`${filteredEvents.length} eventos carregados com sucesso`);
    } catch (err) {
      console.error('Erro ao carregar eventos fictícios:', err);
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  // Função para refresh (mesmo comportamento que fetch para dados fictícios)
  const refreshEventsPost = useCallback(async () => {
    console.log('Atualizando eventos...');
    await fetchEvents();
    toast.success("Eventos atualizados com sucesso!");
  }, [fetchEvents]);

  // Simular adição de evento (apenas para demonstração)
  const addEvent = async (formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Simulando adição de evento:', formData);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEvent: CalendarEvent = {
        id: `mock-new-${Date.now()}`,
        summary: formData.summary,
        description: formData.description,
        start: `${format(formData.date, 'yyyy-MM-dd')}T${formData.startTime}:00-03:00`,
        end: `${format(formData.date, 'yyyy-MM-dd')}T${formData.endTime}:00-03:00`,
        status: 'confirmed',
        htmlLink: '#',
        attendees: formData.email ? [{
          email: formData.email,
          responseStatus: 'accepted'
        }] : []
      };
      
      mockCalendarEvents.push(newEvent);
      await fetchEvents(); // Refresh events
      
      toast.success("Evento náutico adicionado com sucesso!");
      return true;
    } catch (err) {
      console.error('Erro ao adicionar evento:', err);
      toast.error("Erro ao adicionar evento náutico. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simular edição de evento
  const editEvent = async (eventId: string, formData: EventFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Simulando edição de evento:', eventId, formData);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventIndex = mockCalendarEvents.findIndex(e => e.id === eventId);
      if (eventIndex >= 0) {
        mockCalendarEvents[eventIndex] = {
          ...mockCalendarEvents[eventIndex],
          summary: formData.summary,
          description: formData.description,
          start: `${format(formData.date, 'yyyy-MM-dd')}T${formData.startTime}:00-03:00`,
          end: `${format(formData.date, 'yyyy-MM-dd')}T${formData.endTime}:00-03:00`,
          attendees: formData.email ? [{
            email: formData.email,
            responseStatus: 'accepted'
          }] : []
        };
      }
      
      await fetchEvents(); // Refresh events
      
      toast.success("Evento náutico atualizado com sucesso!");
      return true;
    } catch (err) {
      console.error('Erro ao atualizar evento:', err);
      toast.error("Erro ao atualizar evento náutico. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simular exclusão de evento
  const deleteEvent = async (eventId: string) => {
    setIsSubmitting(true);
    try {
      console.log('Simulando exclusão de evento:', eventId);
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const eventIndex = mockCalendarEvents.findIndex(e => e.id === eventId);
      if (eventIndex >= 0) {
        mockCalendarEvents.splice(eventIndex, 1);
      }
      
      await fetchEvents(); // Refresh events
      
      toast.success("Evento náutico excluído com sucesso!");
      return true;
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      toast.error("Erro ao excluir evento náutico. Tente novamente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Carregar eventos inicialmente e quando a data mudar
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Remover polling automático para evitar requests desnecessários
  // O usuário pode usar o botão de refresh quando precisar

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
