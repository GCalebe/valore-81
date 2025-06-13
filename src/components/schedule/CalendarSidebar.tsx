
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Plus, ShipWheel } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

interface CalendarSidebarProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onAddEvent: () => void;
}

export function CalendarSidebar({ selectedDate, onDateChange, onAddEvent }: CalendarSidebarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShipWheel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Calendário Náutico
        </CardTitle>
        <CardDescription>Selecione uma data para visualizar eventos</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar 
          mode="single" 
          selected={selectedDate} 
          onSelect={onDateChange} 
          className="border rounded-md" 
          locale={pt} 
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {selectedDate && format(selectedDate, "EEEE, dd 'de' MMMM", {
            locale: pt
          })}
        </p>
        <Button 
          onClick={onAddEvent} 
          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo Evento
        </Button>
      </CardFooter>
    </Card>
  );
}
