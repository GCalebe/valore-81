
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

interface MetricsFiltersProps {
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
}

const MetricsFilters: React.FC<MetricsFiltersProps> = ({ dateFilter, onDateFilterChange }) => {
  const filterOptions = [
    { value: 'day', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' }
  ];

  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <div className="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border dark:border-gray-700">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={dateFilter === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onDateFilterChange(option.value)}
            className={`text-xs ${
              dateFilter === option.value 
                ? 'bg-Valore-blue text-white dark:bg-blue-600' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Calendar className="h-3 w-3 mr-1" />
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MetricsFilters;
