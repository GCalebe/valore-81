
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export function MetricsFilters({ customDate, setCustomDate }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {customDate ? customDate.toLocaleDateString() : "Personalizado"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            selectedDate={customDate}
            onDateChange={(date) => {
              setCustomDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <Button variant="outline" onClick={() => { setCustomDate(new Date()); setOpen(false); }}>Hoje</Button>
      <Button variant="outline" onClick={() => {
        const now = new Date();
        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        setCustomDate(firstDayOfWeek);
        setOpen(false);
      }}>Semana</Button>
      <Button variant="outline" onClick={() => {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        setCustomDate(firstDayOfMonth);
        setOpen(false);
      }}>Mês</Button>
    </div>
  );
}

MetricsFilters.displayName = "MetricsFilters";

export default MetricsFilters;
