import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { isSameDay, parseISO, addDays, addHours, addMinutes, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  ArrowLeft, RefreshCw, LoaderCircle
} from 'lucide-react';
import { useCalendarEvents, CalendarEvent, EventFormData } from '@/hooks/useCalendarEvents';
import { EventFormDialog } from '@/components/EventFormDialog';
import { DeleteEventDialog } from '@/components/DeleteEventDialog';
import { Appointment, AppointmentFormData } from '@/types/calendar';
import { CalendarSidebar } from '@/components/schedule/CalendarSidebar';
import { EventsCard } from '@/components/schedule/EventsCard';
import { AppointmentsSection } from '@/components/schedule/AppointmentsSection';
import { useScheduleData } from '@/hooks/useScheduleData';

// Dados mock para os agendamentos 
const mockAppointments: Appointment[] = [
  {
    id: 1,
    petName: 'Veleiro Azul',
    ownerName: 'João Silva',
    phone: '(11) 98765-4321',
    date: new Date(2023, 5, 15, 10, 30),
    service: 'Manutenção de Casco',
    status: 'confirmado',
    notes: 'Verificar sistema de ancoragem'
  },
  {
    id: 2,
    petName: 'Lancha Luna',
    ownerName: 'Maria Oliveira',
    phone: '(11) 91234-5678',
    date: new Date(2023, 5, 15, 14, 0),
    service: 'Inspeção de Segurança',
    status: 'pendente',
    notes: 'Renovação de licenças'
  },
  {
    id: 3,
    petName: 'Iate Toby',
    ownerName: 'Pedro Santos',
    phone: '(11) 99876-5432',
    date: new Date(2023, 5, 16, 9, 0),
    service: 'Vistoria Completa',
    status: 'confirmado',
    notes: 'Vistoria anual obrigatória'
  },
  {
    id: 4,
    petName: 'Catamarã Bella',
    ownerName: 'Ana Costa',
    phone: '(11) 98765-1234',
    date: addDays(new Date(), 1),
    service: 'Limpeza e Enceramento',
    status: 'confirmado',
    notes: 'Preparação para temporada'
  },
  {
    id: 5,
    petName: 'Barco Thor',
    ownerName: 'Lucas Ferreira',
    phone: '(11) 97654-3210',
    date: addDays(new Date(), 1),
    service: 'Revisão de Motor',
    status: 'pendente',
    notes: 'Motor apresentando ruídos'
  },
  {
    id: 6,
    petName: 'Jet Ski Nina',
    ownerName: 'Carla Souza',
    phone: '(11) 98888-7777',
    date: addHours(new Date(), 3),
    service: 'Manutenção Preventiva',
    status: 'confirmado',
    notes: 'Chegará 15 minutos antes'
  },
  {
    id: 7,
    petName: 'Escuna Rex',
    ownerName: 'Roberto Almeida',
    phone: '(11) 99999-8888',
    date: addMinutes(new Date(), 90),
    service: 'Vistoria de Segurança',
    status: 'confirmado',
    notes: 'Documentação em dia'
  }
];

const Schedule = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
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
  
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    petName: '',
    ownerName: '',
    phone: '',
    date: new Date(),
    service: 'Manutenção de Casco',
    status: 'pendente',
    notes: ''
  });
  
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('day');
  
  const isAnyLoading = isEventsLoading || isScheduleLoading;
  const isAnyRefreshing = isSubmitting || isScheduleRefreshing;
  
  const handleRefreshAll = async () => {
    console.log('Atualizando todos os dados...');
    
    // Atualizar tanto eventos do calendário quanto dados do Supabase
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditDialogOpen && currentAppointment) {
      setAppointments(appointments.map(app => 
        app.id === currentAppointment.id ? {
          ...formData,
          id: app.id
        } : app
      ));
      setIsEditDialogOpen(false);
    } else {
      const newId = Math.max(0, ...appointments.map(a => a.id)) + 1;
      setAppointments([...appointments, {
        ...formData,
        id: newId
      }]);
      setIsAddDialogOpen(false);
    }
    setFormData({
      petName: '',
      ownerName: '',
      phone: '',
      date: new Date(),
      service: 'Manutenção de Casco',
      status: 'pendente',
      notes: ''
    });
  };
  
  const handleEditClick = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      petName: appointment.petName,
      ownerName: appointment.ownerName,
      phone: appointment.phone,
      date: appointment.date,
      service: appointment.service,
      status: appointment.status,
      notes: appointment.notes
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (currentAppointment) {
      setAppointments(appointments.filter(app => app.id !== currentAppointment.id));
      setIsDeleteDialogOpen(false);
      setCurrentAppointment(null);
    }
  };
  
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
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Agenda Náutica Valore
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefreshAll}
              className="flex items-center gap-2" 
              disabled={isAnyLoading || isAnyRefreshing}
            >
              {isAnyRefreshing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isAnyRefreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
            {lastUpdated && (
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:inline-block">
                Última atualização: {format(lastUpdated, "dd/MM/yyyy HH:mm:ss")}
              </span>
            )}
          </div>
        </div>

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
      </div>

      <EventFormDialog
        open={isAddEventDialogOpen}
        onOpenChange={setIsAddEventDialogOpen}
        onSubmit={handleAddEvent}
        isSubmitting={isSubmitting}
        title="Adicionar Evento Náutico"
        description="Preencha os campos para adicionar um novo evento náutico ao calendário."
        submitLabel="Salvar Evento"
      />

      <EventFormDialog
        open={isEditEventDialogOpen}
        onOpenChange={setIsEditEventDialogOpen}
        onSubmit={handleEditEvent}
        isSubmitting={isSubmitting}
        event={selectedEvent || undefined}
        title="Editar Evento Náutico"
        description="Modifique os campos para atualizar este evento náutico."
        submitLabel="Salvar Alterações"
      />

      <DeleteEventDialog
        open={isDeleteEventDialogOpen}
        onOpenChange={setIsDeleteEventDialogOpen}
        onConfirmDelete={handleDeleteEvent}
        event={selectedEvent}
        isDeleting={isSubmitting}
      />

      <AppointmentsSection 
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
