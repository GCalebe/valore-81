
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CalendarEvent } from '@/types/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  events: CalendarEvent[];
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  timeFilter: 'hoje' | 'mes' | 'semana' | 'dia';
  onEventClick?: (event: CalendarEvent) => void;
  onPeriodChange?: (start: Date, end: Date) => void;
}

export function CalendarView({ 
  selectedDate, 
  onDateChange, 
  events, 
  currentMonth, 
  onMonthChange,
  timeFilter,
  onEventClick,
  onPeriodChange
}: CalendarViewProps) {
  // Ajuste: Semana deve ser baseada na data selecionada, e não na data de hoje!
  const getDisplayPeriod = () => {
    const today = new Date();
    
    switch (timeFilter) {
      case 'hoje':
        return {
          start: startOfDay(today),
          end: endOfDay(today)
        };
      case 'dia':
        return {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate)
        };
      case 'semana': {
        // AGORA: Semana baseada na data selecionada, não mais no "today"
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Domingo
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
        return {
          start: weekStart,
          end: weekEnd
        };
      }
      case 'mes':
      default:
        return {
          start: startOfMonth(currentMonth),
          end: endOfMonth(currentMonth)
        };
    }
  };

  const displayPeriod = getDisplayPeriod();

  // Notificar o pai sobre mudança de período para todas as views que precisam
  React.useEffect(() => {
    if (onPeriodChange && (timeFilter === 'mes' || timeFilter === 'semana')) {
      onPeriodChange(displayPeriod.start, displayPeriod.end);
    }
  }, [timeFilter, currentMonth, selectedDate, onPeriodChange]);

  const days = eachDayOfInterval({ 
    start: displayPeriod.start, 
    end: displayPeriod.end 
  });

  // Get events for a specific day - buscar em TODOS os eventos disponíveis
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      if (!event.start) { return false; }
      try {
        const eventDate = parseISO(event.start);
        return isSameDay(eventDate, day);
      } catch {
        return false;
      }
    });
  };

  const weekDays = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.'];

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    onMonthChange(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    onMonthChange(nextMonth);
  };

  // Personalizar o título baseado no filtro
  const getCalendarTitle = () => {
    const today = new Date();
    switch (timeFilter) {
      case 'hoje':
        return `Hoje - ${format(today, "dd 'de' MMMM 'de' yyyy", { locale: pt })}`;
      case 'dia':
        return `${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })}`;
      case 'semana': {
        // AGORA: Semana baseada na data selecionada
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
        return `Semana de ${format(weekStart, "dd/MM", { locale: pt })} a ${format(weekEnd, "dd/MM", { locale: pt })}`;
      }
      case 'mes':
      default:
        return format(currentMonth, 'MMMM \'de\' yyyy', { locale: pt });
    }
  };

  const showMonthNavigation = timeFilter === 'mes';

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getCalendarTitle()}
        </h2>
        {showMonthNavigation && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week days header - apenas para visualização mensal e semanal */}
        {(timeFilter === 'mes' || timeFilter === 'semana') && (
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Calendar days */}
        <div className={`
          grid gap-1
          ${timeFilter === 'hoje' || timeFilter === 'dia' ? 'grid-cols-1' : 'grid-cols-7'}
        `}>
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, new Date());

            // No modo semana, mostrar apenas dias da semana vigente, sem opacidade.
            const dayOpacity = (timeFilter === 'mes' && !isCurrentMonth) ? 'opacity-50' : '';

            return (
              <div
                key={day.toString()}
                className={`
                  ${timeFilter === 'hoje' || timeFilter === 'dia' ? 'min-h-[300px]' : 'min-h-[120px]'} 
                  p-1 border border-gray-200 dark:border-gray-700 cursor-pointer
                  ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                  ${dayOpacity}
                  ${isToday ? 'ring-2 ring-blue-400' : ''}
                `}
                onClick={() => onDateChange(day)}
              >
                <div className={`
                  text-sm font-medium text-gray-900 dark:text-white mb-1
                  ${timeFilter === 'hoje' || timeFilter === 'dia' ? 'text-lg text-center border-b pb-2 mb-3' : ''}
                `}>
                  {timeFilter === 'hoje' || timeFilter === 'dia' 
                    ? format(day, "EEEE, dd 'de' MMMM", { locale: pt })
                    : format(day, 'd')
                  }
                </div>
                
                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.slice(0, timeFilter === 'hoje' || timeFilter === 'dia' ? 10 : 3).map((event, index) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded truncate cursor-pointer
                        hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors
                        ${timeFilter === 'hoje' || timeFilter === 'dia' ? 'p-2 text-sm' : ''}
                      `}
                      title={`${event.summary} - Clique para editar`}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {format(parseISO(event.start), 'HH:mm')} {event.summary}
                    </div>
                  ))}
                  
                  {dayEvents.length > (timeFilter === 'hoje' || timeFilter === 'dia' ? 10 : 3) && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - (timeFilter === 'hoje' || timeFilter === 'dia' ? 10 : 3)} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
