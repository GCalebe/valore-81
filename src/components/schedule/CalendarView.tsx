
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, parseISO } from 'date-fns';
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
}

export function CalendarView({ 
  selectedDate, 
  onDateChange, 
  events, 
  currentMonth, 
  onMonthChange 
}: CalendarViewProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.start);
      return isSameDay(eventDate, day);
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

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(currentMonth, 'MMMM \'de\' yyyy', { locale: pt })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map(day => {
            const dayEvents = getEventsForDay(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[120px] p-1 border border-gray-200 dark:border-gray-700 cursor-pointer
                  ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                  ${!isCurrentMonth ? 'opacity-50' : ''}
                `}
                onClick={() => onDateChange(day)}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {format(day, 'd')}
                </div>
                
                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded truncate"
                      title={event.summary}
                    >
                      {format(parseISO(event.start), 'HH:mm')} {event.summary}
                    </div>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{dayEvents.length - 3} more
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
