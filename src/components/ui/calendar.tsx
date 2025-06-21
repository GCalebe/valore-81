import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function Calendar({ selectedDate, onDateChange }) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onDateChange}
      className="calendar"
    />
  );
}
Calendar.displayName = "Calendar";

// The Calendar component is already exported via the function declaration
