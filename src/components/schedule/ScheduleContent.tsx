
import React, { useState } from 'react';
import { isSameDay, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { Appointment } from '@/types/calendar';
import { ScheduleFilters } from './ScheduleFilters';
// import { ScheduleTimeFilter } from './ScheduleTimeFilter';
import { CalendarView } from './CalendarView';
import { EventsTable } from './EventsTable';
import { CalendarViewSwitcher } from "./CalendarViewSwitcher";

interface ScheduleContentProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  events: CalendarEvent[];
  appointments: Appointment[];
  selectedTab: string;
  searchTerm: string;
  isAnyLoading: boolean;
  eventsError: Error | null;
  lastUpdated: Date | null;
  setSearchTerm: (term: string) => void;
  setSelectedTab: (tab: string) => void;
  setIsAddEventDialogOpen: (open: boolean) => void;
  openEditEventDialog: (event: CalendarEvent) => void;
  openDeleteEventDialog: (event: CalendarEvent) => void;
  openEventLink: (url: string) => void;
  onPeriodChange?: (start: Date, end: Date) => void;
}

export function ScheduleContent({
  selectedDate,
  setSelectedDate,
  events,
  appointments,
  selectedTab,
  searchTerm,
  isAnyLoading,
  eventsError,
  lastUpdated,
  setSearchTerm,
  setSelectedTab,
  setIsAddEventDialogOpen,
  openEditEventDialog,
  openDeleteEventDialog,
  openEventLink,
  onPeriodChange
}: ScheduleContentProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [calendarViewType, setCalendarViewType] = useState<"mes" | "semana" | "dia" | "agenda">("mes");
  // Remover o timeFilter separado, agora é só calendarViewType
  const [statusFilter, setStatusFilter] = useState('all');
  const [calendarFilter, setCalendarFilter] = useState('all');
  const [hostFilter, setHostFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  // Função para determinar o período de filtro - APENAS para modo lista
  const getListModeFilterPeriod = () => {
    const today = new Date();
    switch (calendarViewType) {
      case 'dia':
        if (selectedDate) {
          return {
            start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
            end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59)
          };
        }
        return null;
      case 'semana':
        const weekStart = startOfWeek(selectedDate || today, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(selectedDate || today, { weekStartsOn: 0 });
        return { start: weekStart, end: weekEnd };
      case 'mes':
        // Mostrar todos os eventos do mês atual
        return null;
      case 'agenda':
        // Agenda mostra todos
        return null;
      default:
        // fallback: mostrar lista do dia atual
        return {
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        };
    }
  };

  const filteredEvents = events.filter(event => {
    if (!event.start || typeof event.start !== 'string') {
      console.warn('Event with invalid start date found:', event);
      return false;
    }
    // Status filter
    if (statusFilter !== 'all' && event.status !== statusFilter) {
      return false;
    }
    // Time filter - APENAS modo lista (agora respeita calendarViewType)
    if (viewMode === 'list') {
      try {
        const eventDate = parseISO(event.start);
        if (isNaN(eventDate.getTime())) {
          console.warn('Event with invalid date format found:', event.start);
          return false;
        }
        const filterPeriod = getListModeFilterPeriod();
        if (!filterPeriod) {
          return true;
        }
        return isWithinInterval(eventDate, {
          start: filterPeriod.start,
          end: filterPeriod.end
        });
      } catch (error) {
        console.error('Error parsing event date:', event.start, error);
        return false;
      }
    }
    // No modo calendário, não aplicar filtro de tempo
    return true;
  }).filter(event => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (event.summary && event.summary.toLowerCase().includes(searchLower)) || 
           (event.description && event.description.toLowerCase().includes(searchLower)) ||
           (event.attendees && event.attendees.some(attendee => 
             attendee?.email && attendee.email.toLowerCase().includes(searchLower)
           ));
  }).sort((a, b) => {
    try {
      const dateA = a.start ? parseISO(a.start) : new Date(0);
      const dateB = b.start ? parseISO(b.start) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    } catch (error) {
      console.error('Error sorting events by date:', error);
      return 0;
    }
  });

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    openEditEventDialog(event);
  };

  // Handler para adicionar evento
  const handleAddEventClick = () => setIsAddEventDialogOpen(true);

  // Garantir full screen sem card/cabeçalho extra da agenda
  return (
    <div className="w-full h-[calc(100vh-48px)] bg-white dark:bg-gray-900 flex flex-col gap-2 p-0 m-0 min-h-0">
      <CalendarViewSwitcher
        view={calendarViewType}
        onChange={setCalendarViewType}
        onAddEvent={handleAddEventClick}
        onFilter={() => {
          alert("Funcionalidade de filtros avançados em breve!");
        }}
      />
      <ScheduleFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        calendarFilter={calendarFilter}
        onCalendarFilterChange={setCalendarFilter}
        hostFilter={hostFilter}
        onHostFilterChange={setHostFilter}
        onAddEvent={handleAddEventClick}
      />
      {/* Removido ScheduleTimeFilter */}
      <div className="flex-1 w-full flex flex-col min-h-0">       
        {viewMode === 'calendar' ? (
          <CalendarView
            selectedDate={selectedDate || new Date()}
            onDateChange={(date) => setSelectedDate(date)}
            events={filteredEvents}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            view={calendarViewType}
            onEventClick={handleEventClick}
            onPeriodChange={onPeriodChange}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6 flex-1 overflow-auto">
            <EventsTable 
              events={filteredEvents}
              isLoading={isAnyLoading}
              onEditEvent={openEditEventDialog}
              onDeleteEvent={openDeleteEventDialog}
              onOpenEventLink={openEventLink}
            />
          </div>
        )}
      </div>
    </div>
  );
}
