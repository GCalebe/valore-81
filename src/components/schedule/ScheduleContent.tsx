
import React from 'react';
import { isSameDay, parseISO } from 'date-fns';
import { CalendarSidebar } from '@/components/schedule/CalendarSidebar';
import { EventsCard } from '@/components/schedule/EventsCard';
import { CalendarEvent } from '@/hooks/useCalendarEvents';
import { Appointment } from '@/types/calendar';

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
  
  const filteredAppointments = appointments.filter(appointment => {
    if (selectedTab === 'day' && selectedDate) {
      return isSameDay(appointment.date, selectedDate);
    } else if (selectedTab === 'all') {
      return true;
    }
    return false;
  }).filter(appointment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return appointment.petName.toLowerCase().includes(searchLower) || 
           appointment.ownerName.toLowerCase().includes(searchLower) || 
           appointment.phone.includes(searchTerm) || 
           appointment.service.toLowerCase().includes(searchLower);
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  const filteredEvents = events.filter(event => {
    if (selectedTab === 'day' && selectedDate) {
      const eventStartDate = parseISO(event.start);
      return isSameDay(eventStartDate, selectedDate);
    } else if (selectedTab === 'all') {
      return true;
    }
    return false;
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3">
        <CalendarSidebar 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onAddEvent={() => setIsAddEventDialogOpen(true)}
        />
      </div>

      <div className="lg:col-span-9">
        <EventsCard 
          events={events}
          filteredEvents={filteredEvents}
          selectedTab={selectedTab}
          searchTerm={searchTerm}
          selectedDate={selectedDate}
          isLoading={isAnyLoading}
          error={eventsError}
          lastUpdated={lastUpdated}
          onSearchChange={setSearchTerm}
          onTabChange={setSelectedTab}
          onEditEvent={openEditEventDialog}
          onDeleteEvent={openDeleteEventDialog}
          onOpenEventLink={openEventLink}
        />
      </div>
    </div>
  );
}
