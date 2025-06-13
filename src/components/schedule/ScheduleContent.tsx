
import React, { useState } from 'react';
import { isSameDay, parseISO, startOfWeek, endOfWeek, isSameWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { Appointment } from '@/types/calendar';
import { ScheduleFilters } from './ScheduleFilters';
import { ScheduleTimeFilter } from './ScheduleTimeFilter';
import { CalendarView } from './CalendarView';
import { EventsTable } from './EventsTable';

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
  openEventLink
}: ScheduleContentProps) {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState('all');
  const [calendarFilter, setCalendarFilter] = useState('all');
  const [hostFilter, setHostFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState<'hoje' | 'mes' | 'semana' | 'dia'>('mes');
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  // Função para determinar o período de filtro - APENAS para modo lista
  const getListModeFilterPeriod = () => {
    const today = new Date();
    
    switch (timeFilter) {
      case 'hoje':
        return {
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        };
      case 'dia':
        if (selectedDate) {
          return {
            start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
            end: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59)
          };
        }
        return null;
      case 'semana':
        const weekStart = startOfWeek(today, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
        return { start: weekStart, end: weekEnd };
      case 'mes':
      default:
        return null; // Mostrar todos os eventos
    }
  };
  
  const filteredEvents = events.filter(event => {
    // First, validate that the event has a valid start date
    if (!event.start || typeof event.start !== 'string') {
      console.warn('Event with invalid start date found:', event);
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && event.status !== statusFilter) {
      return false;
    }

    // Time filter - APENAS aplicar no modo lista
    if (viewMode === 'list') {
      try {
        const eventDate = parseISO(event.start);
        
        // Check if the parsed date is valid
        if (isNaN(eventDate.getTime())) {
          console.warn('Event with invalid date format found:', event.start);
          return false;
        }
        
        const filterPeriod = getListModeFilterPeriod();
        
        // Se não há período definido, mostrar todos os eventos
        if (!filterPeriod) {
          return true;
        }
        
        // Verificar se o evento está dentro do período
        return isWithinInterval(eventDate, {
          start: filterPeriod.start,
          end: filterPeriod.end
        });
        
      } catch (error) {
        console.error('Error parsing event date:', event.start, error);
        return false;
      }
    }
    
    // No modo calendário, não aplicar filtro de tempo - deixar o CalendarView gerenciar
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
    // Add safe date parsing for sorting as well
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

  return (
    <div className="container mx-auto px-4 py-6">
      <ScheduleFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        calendarFilter={calendarFilter}
        onCalendarFilterChange={setCalendarFilter}
        hostFilter={hostFilter}
        onHostFilterChange={setHostFilter}
        onAddEvent={() => setIsAddEventDialogOpen(true)}
      />

      <ScheduleTimeFilter
        activeFilter={timeFilter}
        onFilterChange={setTimeFilter}
      />

      {viewMode === 'calendar' ? (
        <CalendarView
          selectedDate={selectedDate || new Date()}
          onDateChange={(date) => setSelectedDate(date)}
          events={filteredEvents}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
          timeFilter={timeFilter}
          onEventClick={handleEventClick}
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
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
  );
}
