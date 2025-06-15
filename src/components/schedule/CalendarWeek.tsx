
import React from "react";
import { CalendarEvent } from "@/types/calendar";
import { DayCell } from "./DayCell";

interface CalendarWeekProps {
  week: Date[];
  currentMonth: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent, e: React.MouseEvent) => void;
}

export const CalendarWeek = React.memo(function CalendarWeek({
  week,
  currentMonth,
  selectedDate,
  events,
  onDateChange,
  onEventClick,
}: CalendarWeekProps) {
  return (
    <div
      className="grid grid-cols-7 border-b last:border-b-0 border-gray-200 dark:border-gray-700 flex-1 min-h-[90px]"
      style={{ minHeight: 0 }}
    >
      {week.map((day) => (
        <DayCell
          key={day.toISOString()}
          day={day}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          events={events}
          onDateChange={onDateChange}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  );
});
