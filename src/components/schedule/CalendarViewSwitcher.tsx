
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";

interface CalendarViewSwitcherProps {
  view: "mes" | "semana" | "dia" | "agenda";
  onChange: (view: "mes" | "semana" | "dia" | "agenda") => void;
  onAddEvent: () => void;
  onFilter: () => void;
}

export const CalendarViewSwitcher: React.FC<CalendarViewSwitcherProps> = ({
  view,
  onChange,
  onAddEvent,
  onFilter,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex gap-2 md:ml-auto">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onFilter}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden xs:inline">Filtros</span>
        </Button>
        <Button
          variant="refresh"
          className="flex items-center gap-2"
          onClick={onAddEvent}
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Novo Evento</span>
        </Button>
      </div>
      <div className="flex gap-1 bg-muted rounded-lg px-1 py-1">
        {[
          { key: "mes", label: "Mês" },
          { key: "semana", label: "Semana" },
          { key: "dia", label: "Dia" },
          { key: "agenda", label: "Agenda" },
        ].map((item) => (
          <Button
            key={item.key}
            size="sm"
            variant={view === item.key ? "default" : "ghost"}
            className={
              view === item.key
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-50 dark:hover:bg-blue-900/30"
            }
            onClick={() => onChange(item.key as any)}
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
