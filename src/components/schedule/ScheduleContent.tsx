
import React, { useState } from 'react';
import { isSameDay, parseISO } from 'date-fns';
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
  
  const filteredEvents = events.filter(event => {
    // Status filter
    if (statusFilter !== 'all' && event.status !== statusFilter) {
      return false;
    }

    // Time filter
    const eventDate = parseISO(event.start);
    const today = new Date();
    
    switch (timeFilter) {
      case 'hoje':
        return isSameDay(eventDate, today);
      case 'dia':
        return selectedDate ? isSameDay(eventDate, selectedDate) : false;
      case 'semana':
        // Implementation for week filter can be added
        return true;
      case 'mes':
      default:
        return true;
    }
  }).filter(event => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (event.summary && event.summary.toLowerCase().includes(searchLower)) || 
           (event.description && event.description.toLowerCase().includes(searchLower)) ||
           (event.attendees && event.attendees.some(attendee => 
             attendee?.email && attendee.email.toLowerCase().includes(searchLower)
           ));
  }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

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
