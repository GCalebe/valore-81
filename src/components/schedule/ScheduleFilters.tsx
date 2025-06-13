
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface ScheduleFiltersProps {
  viewMode: 'calendar' | 'list';
  onViewModeChange: (mode: 'calendar' | 'list') => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  calendarFilter: string;
  onCalendarFilterChange: (calendar: string) => void;
  hostFilter: string;
  onHostFilterChange: (host: string) => void;
  onAddEvent: () => void;
}

export function ScheduleFilters({
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  calendarFilter,
  onCalendarFilterChange,
  hostFilter,
  onHostFilterChange,
  onAddEvent
}: ScheduleFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 mb-6">
      {/* Header with title and new event button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agenda</h1>
        <Button onClick={onAddEvent} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          NOVO EVENTO
        </Button>
      </div>

      {/* View mode buttons */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('calendar')}
            className={viewMode === 'calendar' ? 'bg-blue-600 text-white' : ''}
          >
            Visualização em Calendário
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? 'bg-blue-600 text-white' : ''}
          >
            Visualização em Lista
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="confirmed">Confirmados</SelectItem>
              <SelectItem value="tentative">Provisórios</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Calendários
          </label>
          <Select value={calendarFilter} onValueChange={onCalendarFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os Calendários" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Calendários</SelectItem>
              <SelectItem value="primary">Calendário Principal</SelectItem>
              <SelectItem value="work">Trabalho</SelectItem>
              <SelectItem value="personal">Pessoal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Anfitriões
          </label>
          <Select value={hostFilter} onValueChange={onHostFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os Anfitriões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Anfitriões</SelectItem>
              <SelectItem value="me">Eu</SelectItem>
              <SelectItem value="others">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
