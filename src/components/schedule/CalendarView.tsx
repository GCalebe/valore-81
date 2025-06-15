
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
  view: 'mes' | 'semana' | 'dia' | 'agenda'; // usamos view em vez de timeFilter
  onEventClick?: (event: CalendarEvent) => void;
  onPeriodChange?: (start: Date, end: Date) => void;
}

export function CalendarView({ 
  selectedDate, 
  onDateChange, 
  events, 
  currentMonth, 
  onMonthChange,
  view,
  onEventClick,
  onPeriodChange
}: CalendarViewProps) {
  // Determina o período de exibição conforme Google/Monday/~Calendar padrão
  const getDisplayPeriod = () => {
    const today = new Date();
    switch (view) {
      case 'dia':
        return {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate)
        };
      case 'semana': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
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

  React.useEffect(() => {
    if (onPeriodChange && (view === 'mes' || view === 'semana')) {
      onPeriodChange(displayPeriod.start, displayPeriod.end);
    }
  }, [view, currentMonth, selectedDate, onPeriodChange]);

  const days = eachDayOfInterval({ start: displayPeriod.start, end: displayPeriod.end });

  // Get events for a specific day
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

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

  const getCalendarTitle = () => {
    switch (view) {
      case 'dia':
        return `${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: pt })}`;
      case 'semana': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
        return `Semana de ${format(weekStart, "dd/MM", { locale: pt })} a ${format(weekEnd, "dd/MM", { locale: pt })}`;
      }
      case 'mes':
      default:
        return format(currentMonth, 'MMMM \'de\' yyyy', { locale: pt });
    }
  };

  const showMonthNavigation = view === 'mes';

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEventClick) {
      onEventClick(event);
    }
  };

  // Layout Google/Monday (só mês/semana com grid), dia/agenda modo lista/único
  const isMonthOrWeekMode = view === 'mes' || view === 'semana';

  const buildWeeks = () => {
    // 7 colunas por semana; em mês pode começar/desalinhado, importante visual Google/Monday!
    const daysArr = [...days];
    let weeks: Date[][] = [];
    for (let i = 0; i < daysArr.length; i += 7) {
      weeks.push(daysArr.slice(i, i + 7));
    }
    return weeks;
  };

  const weeks = buildWeeks();

  // Garantir flex layout height 100%
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border rounded-xl shadow-sm overflow-hidden animate-fade-in">
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

      {/* Calendário Estilo Google/Monday */}
      <div className={`px-2 pb-2 pt-3 animate-fade-in flex-1 min-h-0`}>
        {isMonthOrWeekMode && (
          <div className="grid grid-cols-7 gap-0 border-b border-gray-200 dark:border-gray-700 mb-1">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center uppercase py-2"
              >
                {day}
              </div>
            ))}
          </div>
        )}

        {/* Grid principal das semanas/dias */}
        {isMonthOrWeekMode ? (
          <div className="flex flex-col gap-0 h-full min-h-0">
            {weeks.map((week, weekIdx) => (
              <div
                key={weekIdx}
                className="grid grid-cols-7 border-b last:border-b-0 border-gray-200 dark:border-gray-700 flex-1 min-h-[90px]"
                style={{ minHeight: 0 }}
              >
                {week.map((day, i) => {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => onDateChange(day)}
                      className={`
                        relative px-1 pt-1 pb-4 h-full min-h-[90px] cursor-pointer border-l first:border-l-0 border-gray-100 dark:border-gray-700 
                        group transition-colors
                        ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}
                        ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900/20 text-gray-400 dark:text-gray-500' : ''}
                        hover:bg-gray-100/60 dark:hover:bg-gray-700
                      `}
                      style={{ minWidth: 0 }}
                    >
                      {/* Barra azul vertical para hoje */}
                      {isToday && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-full z-20 animate-fade-in"></div>
                      )}

                      {/* Número do dia */}
                      <div className={`
                        flex items-center justify-between z-10 relative
                        ${isToday ? 'text-blue-600 font-bold' : (isSelected ? 'text-blue-700 font-bold' : '')}
                        pl-2 pr-1
                      `}>
                        <span className={`
                          text-xs select-none
                          ${isCurrentMonth ? '' : 'opacity-50'}
                        `}>{day.getDate()}</span>
                      </div>

                      {/* Eventos do dia como barras ocupando largura total */}
                      <div className="flex flex-col gap-1 mt-1">
                        {dayEvents.slice(0, 4).map((event, idx) => (
                          <div
                            key={event.id}
                            title={event.summary}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`
                              truncate rounded px-2 py-1 text-xs font-medium cursor-pointer 
                              mb-[2px]
                              bg-blue-100 text-blue-900
                              dark:bg-blue-800/60 dark:text-white
                              border border-blue-200 dark:border-blue-500/30
                              hover:bg-blue-300/70 dark:hover:bg-blue-700/90
                              transition
                              shadow-sm
                            `}
                            style={{
                              maxWidth: '100%',
                              width: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {format(parseISO(event.start), 'HH:mm')} {event.summary}
                          </div>
                        ))}
                        {dayEvents.length > 4 && (
                          <div className="text-[11px] text-gray-400 mt-1 pl-2">+{dayEvents.length - 4} mais</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          // Visual "Dia" — lista do dia selecionado
          <div className="bg-white dark:bg-gray-800 rounded-lg min-h-[300px] border border-gray-100 dark:border-gray-700 p-2 flex-1">
            <div className="text-lg font-bold my-2 text-blue-700 dark:text-blue-400">
              {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: pt })}
            </div>
            <div className="space-y-2">
              {getEventsForDay(selectedDate).map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => handleEventClick(event, e)}
                  className={`
                    flex items-center px-3 py-2 rounded bg-blue-100 
                    dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/70
                    text-blue-800 dark:text-blue-200 shadow-sm cursor-pointer
                  `}
                  style={{
                    maxWidth: '100%',
                    overflow: 'hidden',
                  }}
                  title={event.summary}
                >
                  <span className="font-bold mr-2">{format(parseISO(event.start), 'HH:mm')}</span>
                  <span className="truncate">{event.summary}</span>
                </div>
              ))}
              {getEventsForDay(selectedDate).length === 0 && (
                <div className="text-gray-400 text-sm px-4 py-5 text-center">
                  Nenhum evento para este dia.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// O arquivo src/components/schedule/CalendarView.tsx está ficando extenso (mais de 230 linhas).
// Recomendo refatorar em arquivos menores se desejar evoluir mais o visual ou modularizar por tipo de view.
