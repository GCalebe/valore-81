import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCalendarEvents, CalendarEvent, EventFormData } from '@/hooks/useCalendarEvents';
import { useScheduleData } from '@/hooks/useScheduleData';
import { useScheduleState } from '@/hooks/useScheduleState';
import { ScheduleHeader } from '@/components/schedule/ScheduleHeader';
import { ScheduleContent } from '@/components/schedule/ScheduleContent';
import { ScheduleDialogs } from '@/components/schedule/ScheduleDialogs';

const Schedule = () => {
  const { user, loading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  
  const {
    selectedDate,
    setSelectedDate,
    appointments,
    searchTerm,
    setSearchTerm,
    selectedTab,
    setSelectedTab,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentAppointment,
    isAddEventDialogOpen,
    setIsAddEventDialogOpen,
    isEditEventDialogOpen,
    setIsEditEventDialogOpen,
    isDeleteEventDialogOpen,
    setIsDeleteEventDialogOpen,
    selectedEvent,
    setSelectedEvent,
    formData,
    setFormData,
    handleSubmit,
    confirmDelete
  } = useScheduleState();
  
  const {
    events,
    isLoading: isEventsLoading,
    error: eventsError,
    lastUpdated,
    refreshEventsPost,
    addEvent,
    editEvent,
    deleteEvent,
    isSubmitting
  } = useCalendarEvents(selectedDate);

  const {
    events: scheduleEvents,
    loading: isScheduleLoading,
    refreshing: isScheduleRefreshing,
    refetchScheduleData: refreshScheduleData
  } = useScheduleData();
  
  const isAnyLoading = isEventsLoading || isScheduleLoading;
  const isAnyRefreshing = isSubmitting || isScheduleRefreshing;
  
  const handleRefreshAll = async () => {
    console.log('Atualizando todos os dados...');
    
    const refreshPromises = [
      refreshEventsPost(),
      refreshScheduleData()
    ];
    
    try {
      await Promise.all(refreshPromises);
      console.log('Todos os dados atualizados com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };
  
  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);
  
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  const handleAddEvent = (formData: EventFormData) => {
    addEvent(formData).then(success => {
      if (success) {
        setIsAddEventDialogOpen(false);
      }
    });
  };
  
  const handleEditEvent = (formData: EventFormData) => {
    if (selectedEvent) {
      editEvent(selectedEvent.id, formData).then(success => {
        if (success) {
          setIsEditEventDialogOpen(false);
          setSelectedEvent(null);
        }
      });
    }
  };
  
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id).then(success => {
        if (success) {
          setIsDeleteEventDialogOpen(false);
          setSelectedEvent(null);
        }
      });
    }
  };
  
  const openEditEventDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditEventDialogOpen(true);
  };
  
  const openDeleteEventDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDeleteEventDialogOpen(true);
  };
  
  const openEventLink = (url: string) => {
    window.open(url, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ScheduleHeader 
        isAnyLoading={isAnyLoading}
        isAnyRefreshing={isAnyRefreshing}
        lastUpdated={lastUpdated}
        onRefreshAll={handleRefreshAll}
      />
      
      <ScheduleContent 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        events={events}
        appointments={appointments}
        selectedTab={selectedTab}
        searchTerm={searchTerm}
        isAnyLoading={isAnyLoading}
        eventsError={eventsError}
        lastUpdated={lastUpdated}
        setSearchTerm={setSearchTerm}
        setSelectedTab={setSelectedTab}
        setIsAddEventDialogOpen={setIsAddEventDialogOpen}
        openEditEventDialog={openEditEventDialog}
        openDeleteEventDialog={openDeleteEventDialog}
        openEventLink={openEventLink}
      />

      <ScheduleDialogs 
        isAddEventDialogOpen={isAddEventDialogOpen}
        setIsAddEventDialogOpen={setIsAddEventDialogOpen}
        isEditEventDialogOpen={isEditEventDialogOpen}
        setIsEditEventDialogOpen={setIsEditEventDialogOpen}
        isDeleteEventDialogOpen={isDeleteEventDialogOpen}
        setIsDeleteEventDialogOpen={setIsDeleteEventDialogOpen}
        selectedEvent={selectedEvent}
        isSubmitting={isSubmitting}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
        appointments={appointments}
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentAppointment={currentAppointment}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default Schedule;
