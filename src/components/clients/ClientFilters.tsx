
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface ClientFiltersProps {
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSegmentFilterChange: (value: string) => void;
  onLastContactFilterChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const ClientFilters = ({
  statusFilter,
  segmentFilter,
  lastContactFilter,
  onStatusFilterChange,
  onSegmentFilterChange,
  onLastContactFilterChange,
  onClearFilters,
  hasActiveFilters
}: ClientFiltersProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
            <Label htmlFor="status-filter">Status do cliente</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Status do cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Active">Ativo</SelectItem>
                <SelectItem value="Inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="grid gap-2">
            <Label htmlFor="segment-filter">Segmento</Label>
            <Select value={segmentFilter} onValueChange={onSegmentFilterChange}>
              <SelectTrigger id="segment-filter" className="w-full">
                <SelectValue placeholder="Segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os segmentos</SelectItem>
                <SelectItem value="Entraram">Entraram</SelectItem>
                <SelectItem value="Conversaram">Conversaram</SelectItem>
                <SelectItem value="Agendaram">Agendaram</SelectItem>
                <SelectItem value="Compareceram">Compareceram</SelectItem>
                <SelectItem value="Negociaram">Negociaram</SelectItem>
                <SelectItem value="Postergaram">Postergaram</SelectItem>
                <SelectItem value="Converteram">Converteram</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <div className="grid gap-2">
            <Label htmlFor="last-contact-filter">Último Contato</Label>
            <Select value={lastContactFilter} onValueChange={onLastContactFilterChange}>
              <SelectTrigger id="last-contact-filter" className="w-full">
                <SelectValue placeholder="Último Contato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="older">Mais antigo</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="flex items-center gap-2 w-full"
        >
          <X className="h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
};

export default ClientFilters;
