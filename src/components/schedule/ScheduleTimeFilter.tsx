
import React from 'react';
import { Button } from '@/components/ui/button';

interface ScheduleTimeFilterProps {
  activeFilter: 'hoje' | 'mes' | 'semana' | 'dia';
  onFilterChange: (filter: 'hoje' | 'mes' | 'semana' | 'dia') => void;
}

export function ScheduleTimeFilter({ activeFilter, onFilterChange }: ScheduleTimeFilterProps) {
  const filters = [
    { key: 'hoje', label: 'Hoje' },
    { key: 'mes', label: 'Mês' },
    { key: 'semana', label: 'Semana' },
    { key: 'dia', label: 'Dia' }
  ] as const;

  return (
    <div className="flex gap-2 mb-4">
      {filters.map(filter => (
        <Button
          key={filter.key}
          variant={activeFilter === filter.key ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className={
            activeFilter === filter.key
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-gray-600 dark:text-gray-400'
          }
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
}
