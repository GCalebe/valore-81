import React, { useState, useMemo, useCallback } from "react";
import {
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { CalendarEvent } from "@/hooks/useCalendarEvents";
import { Appointment } from "@/types/calendar";
import { ScheduleFilters } from "./ScheduleFilters";
import { CalendarView } from "./CalendarView";
import { EventsTable } from "./EventsTable";
import { CalendarViewSwitcher } from "./CalendarViewSwitcher";
import { CalendarHeaderBar } from "./CalendarHeaderBar";
import { useThemeSettings } from "@/context/ThemeSettingsContext";

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
  // Novos props para controle externo da view:
  calendarViewType: "mes" | "semana" | "dia" | "agenda";
  setCalendarViewType: (v: "mes" | "semana" | "dia" | "agenda") => void;
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
  onPeriodChange,
  calendarViewType,
  setCalendarViewType,
}: ScheduleContentProps) {
  const { settings } = useThemeSettings();
  const [viewMode, setViewMode] = React.useState<"calendar" | "list">(
    "calendar",
  );
  // Remover estado local de calendarViewType
  // const [calendarViewType, setCalendarViewType] = React.useState<"mes" | "semana" | "dia" | "agenda">("mes");
  const [statusFilter, setStatusFilter] = useState("all");
  const [calendarFilter, setCalendarFilter] = useState("all");
  const [hostFilter, setHostFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const goToPrevious = useCallback(() => {
    switch (calendarViewType) {
      case "mes": {
        const prevMonth = new Date(currentMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setCurrentMonth(prevMonth);
        break;
      }
      case "semana": {
        const prevWeek = new Date(selectedDate || new Date());
        prevWeek.setDate(prevWeek.getDate() - 7);
        setSelectedDate(prevWeek);
        break;
      }
      case "dia": {
        const prevDay = new Date(selectedDate || new Date());
        prevDay.setDate(prevDay.getDate() - 1);
        setSelectedDate(prevDay);
        break;
      }
      case "agenda": {
        if (viewMode === "list") {
          const prevMonth = new Date(currentMonth);
          prevMonth.setMonth(prevMonth.getMonth() - 1);
          setCurrentMonth(prevMonth);
        } else {
          // viewMode === 'calendar'
          const prevDay = new Date(selectedDate || new Date());
          prevDay.setDate(prevDay.getDate() - 1);
          setSelectedDate(prevDay);
        }
        break;
      }
    }
  }, [
    calendarViewType,
    viewMode,
    currentMonth,
    selectedDate,
    setCurrentMonth,
    setSelectedDate,
  ]);

  const goToNext = useCallback(() => {
    switch (calendarViewType) {
      case "mes": {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setCurrentMonth(nextMonth);
        break;
      }
      case "semana": {
        const nextWeek = new Date(selectedDate || new Date());
        nextWeek.setDate(nextWeek.getDate() + 7);
        setSelectedDate(nextWeek);
        break;
      }
      case "dia": {
        const nextDay = new Date(selectedDate || new Date());
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
        break;
      }
      case "agenda": {
        if (viewMode === "list") {
          const nextMonth = new Date(currentMonth);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          setCurrentMonth(nextMonth);
        } else {
          // viewMode === 'calendar'
          const nextDay = new Date(selectedDate || new Date());
          nextDay.setDate(nextDay.getDate() + 1);
          setSelectedDate(nextDay);
        }
        break;
      }
    }
  }, [
    calendarViewType,
    viewMode,
    currentMonth,
    selectedDate,
    setCurrentMonth,
    setSelectedDate,
  ]);

  // Período de filtro do modo lista
  const getListModeFilterPeriod = useCallback(() => {
    const today = new Date();
    switch (calendarViewType) {
      case "dia":
        if (selectedDate) {
          return {
            start: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
            ),
            end: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              23,
              59,
              59,
            ),
          };
        }
        return null;
      case "semana":
        const weekStart = startOfWeek(selectedDate || today, {
          weekStartsOn: 0,
        });
        const weekEnd = endOfWeek(selectedDate || today, { weekStartsOn: 0 });
        return { start: weekStart, end: weekEnd };
      case "mes":
      case "agenda":
        return {
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth),
        };
      default:
        return {
          start: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
          ),
          end: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            23,
            59,
            59,
          ),
        };
    }
  }, [calendarViewType, selectedDate, currentMonth]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (!event.start || typeof event.start !== "string") return false;
        if (statusFilter !== "all" && event.status !== statusFilter)
          return false;
        if (viewMode === "list") {
          try {
            const eventDate = parseISO(event.start);
            if (isNaN(eventDate.getTime())) return false;
            const filterPeriod = getListModeFilterPeriod();
            if (!filterPeriod) return true;
            return isWithinInterval(eventDate, {
              start: filterPeriod.start,
              end: filterPeriod.end,
            });
          } catch {
            return false;
          }
        }
        return true;
      })
      .filter((event) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          (event.summary &&
            event.summary.toLowerCase().includes(searchLower)) ||
          (event.description &&
            event.description.toLowerCase().includes(searchLower)) ||
          (event.attendees &&
            event.attendees.some(
              (attendee) =>
                attendee?.email &&
                attendee.email.toLowerCase().includes(searchLower),
            ))
        );
      })
      .sort((a, b) => {
        try {
          const dateA = a.start ? parseISO(a.start) : new Date(0);
          const dateB = b.start ? parseISO(b.start) : new Date(0);
          return dateA.getTime() - dateB.getTime();
        } catch {
          return 0;
        }
      });
  }, [events, statusFilter, viewMode, getListModeFilterPeriod, searchTerm]);

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      openEditEventDialog(event);
    },
    [openEditEventDialog],
  );

  // Handler para adicionar evento
  const handleAddEventClick = useCallback(
    () => setIsAddEventDialogOpen(true),
    [setIsAddEventDialogOpen],
  );

  return (
    <div className="w-full h-[calc(100vh-48px)] bg-white dark:bg-gray-900 flex flex-col gap-2 p-0 m-0 min-h-0">
      {/* <CalendarViewSwitcher ... /> REMOVIDO! */}
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

      {/* Cards de Métricas */}
      <div className="grid grid-cols-5 gap-4 px-4">
        <div
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            <span className="text-white text-sm font-semibold">📅</span>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Hoje</p>
            <p className="text-white text-xl font-bold">2</p>
          </div>
        </div>

        <div
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            <span className="text-white text-sm font-semibold">📊</span>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Esta Semana</p>
            <p className="text-white text-xl font-bold">4</p>
          </div>
        </div>

        <div
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            <span className="text-white text-sm font-semibold">📈</span>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Este Mês</p>
            <p className="text-white text-xl font-bold">4</p>
          </div>
        </div>

        <div
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            <span className="text-white text-sm font-semibold">✅</span>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Confirmados</p>
            <p className="text-white text-xl font-bold">2</p>
          </div>
        </div>

        <div
          className="rounded-lg p-4 flex items-center gap-3"
          style={{ backgroundColor: settings.primaryColor }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: settings.secondaryColor }}
          >
            <span className="text-white text-sm font-semibold">🎯</span>
          </div>
          <div>
            <p className="text-gray-200 text-sm">Total</p>
            <p className="text-white text-xl font-bold">4</p>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col min-h-0">
        {viewMode === "calendar" ? (
          <CalendarView
            selectedDate={selectedDate || new Date()}
            onDateChange={(date) => setSelectedDate(date)}
            events={filteredEvents}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            view={calendarViewType}
            onEventClick={handleEventClick}
            onPeriodChange={onPeriodChange}
            goToPrevious={goToPrevious}
            goToNext={goToNext}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 border rounded-lg flex-1 overflow-auto flex flex-col">
            <CalendarHeaderBar
              view={calendarViewType}
              currentMonth={currentMonth}
              selectedDate={selectedDate || new Date()}
              goToPrevious={goToPrevious}
              goToNext={goToNext}
            />
            <div className="p-6 flex-1 overflow-auto">
              <EventsTable
                events={filteredEvents}
                isLoading={isAnyLoading}
                onEditEvent={openEditEventDialog}
                onDeleteEvent={openDeleteEventDialog}
                onOpenEventLink={openEventLink}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
