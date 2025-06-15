
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import ClientFilters from './ClientFilters';

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSegmentFilterChange: (value: string) => void;
  onLastContactFilterChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterDialog = ({
  isOpen,
  onOpenChange,
  statusFilter,
  segmentFilter,
  lastContactFilter,
  onStatusFilterChange,
  onSegmentFilterChange,
  onLastContactFilterChange,
  onClearFilters,
  hasActiveFilters
}: FilterDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative h-9 border-white/50 text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10">
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar Clientes</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ClientFilters
            statusFilter={statusFilter}
            segmentFilter={segmentFilter}
            lastContactFilter={lastContactFilter}
            onStatusFilterChange={onStatusFilterChange}
            onSegmentFilterChange={onSegmentFilterChange}
            onLastContactFilterChange={onLastContactFilterChange}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Aplicar Filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
