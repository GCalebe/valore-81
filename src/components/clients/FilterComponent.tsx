import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomField } from '@/types/customField';
import { ClientFilters } from '@/types/client';
import { FilterCategory } from '@/components/clients/FilterCategory';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface FilterComponentProps {
  /**
   * Estado atual dos filtros aplicados
   */
  filters: ClientFilters;
  
  /**
   * Função para atualizar os filtros
   */
  setFilters: (filters: ClientFilters) => void;
  
  /**
   * Lista de campos personalizados disponíveis para filtro
   * @default []
   */
  customFields?: CustomField[];
  
  /**
   * Função chamada quando os filtros são aplicados
   */
  onApplyFilters: () => void;
  
  /**
   * Função chamada quando os filtros são resetados
   */
  onResetFilters: () => void;
  
  /**
   * Conteúdo adicional a ser renderizado no componente
   * @default null
   */
  children?: React.ReactNode;
  
  /**
   * Classes CSS adicionais para o componente
   * @default ''
   */
  className?: string;
}

/**
 * Componente base que encapsula a lógica de filtro para clientes,
 * permitindo sua reutilização em diferentes contextos de UI.
 */
export const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  setFilters,
  customFields = [],
  onApplyFilters,
  onResetFilters,
  children,
  className = '',
}) => {
  // Status disponíveis para filtro
  const availableStatuses = [
    { id: 'active', label: 'Ativo' },
    { id: 'inactive', label: 'Inativo' },
    { id: 'lead', label: 'Lead' },
    { id: 'client', label: 'Cliente' },
    { id: 'prospect', label: 'Prospecto' },
  ];

  // Segmentos disponíveis para filtro
  const availableSegments = [
    { id: 'retail', label: 'Varejo' },
    { id: 'wholesale', label: 'Atacado' },
    { id: 'corporate', label: 'Corporativo' },
    { id: 'government', label: 'Governo' },
    { id: 'education', label: 'Educação' },
  ];

  // Handlers para atualização de filtros
  const handleStatusChange = (statusId: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        status: [...filters.status, statusId],
      });
    } else {
      setFilters({
        ...filters,
        status: filters.status.filter((id) => id !== statusId),
      });
    }
  };

  const handleSegmentChange = (segmentId: string, checked: boolean) => {
    if (checked) {
      setFilters({
        ...filters,
        segment: [...filters.segment, segmentId],
      });
    } else {
      setFilters({
        ...filters,
        segment: filters.segment.filter((id) => id !== segmentId),
      });
    }
  };

  const handleLastContactFromChange = (date: Date | null) => {
    setFilters({
      ...filters,
      lastContact: {
        ...filters.lastContact,
        from: date,
      },
    });
  };

  const handleLastContactToChange = (date: Date | null) => {
    setFilters({
      ...filters,
      lastContact: {
        ...filters.lastContact,
        to: date,
      },
    });
  };

  const handleCustomFieldChange = (
    fieldId: string,
    value: string | string[] | number | boolean | null
  ) => {
    setFilters({
      ...filters,
      customFields: {
        ...filters.customFields,
        [fieldId]: value,
      },
    });
  };

  // Renderiza os controles de filtro para campos personalizados com base no tipo
  const renderCustomFieldControl = (field: CustomField) => {
    const currentValue = filters.customFields[field.id];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={currentValue as string || ''}
            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
            placeholder={`Filtrar por ${field.label}`}
          />
        );
      case 'select':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={Array.isArray(currentValue) && currentValue.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const newValue = Array.isArray(currentValue) 
                        ? [...currentValue, option.value]
                        : [option.value];
                      handleCustomFieldChange(field.id, newValue);
                    } else {
                      const newValue = Array.isArray(currentValue)
                        ? currentValue.filter((v) => v !== option.value)
                        : [];
                      handleCustomFieldChange(field.id, newValue);
                    }
                  }}
                />
                <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={Boolean(currentValue)}
              onCheckedChange={(checked) => {
                handleCustomFieldChange(field.id, Boolean(checked));
              }}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
          </div>
        );
      case 'date':
        return (
          <DatePicker
            date={currentValue ? new Date(currentValue as string) : null}
            setDate={(date) => handleCustomFieldChange(field.id, date?.toISOString() || null)}
            placeholder={`Selecione uma data`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`filter-component space-y-4 ${className}`}>
      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className="space-y-4">
          <FilterCategory title="Status">
            <div className="space-y-2">
              {availableStatuses.map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.id}`}
                    checked={filters.status.includes(status.id)}
                    onCheckedChange={(checked) => handleStatusChange(status.id, Boolean(checked))}
                  />
                  <Label htmlFor={`status-${status.id}`}>{status.label}</Label>
                </div>
              ))}
            </div>
          </FilterCategory>

          <FilterCategory title="Segmento">
            <div className="space-y-2">
              {availableSegments.map((segment) => (
                <div key={segment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`segment-${segment.id}`}
                    checked={filters.segment.includes(segment.id)}
                    onCheckedChange={(checked) => handleSegmentChange(segment.id, Boolean(checked))}
                  />
                  <Label htmlFor={`segment-${segment.id}`}>{segment.label}</Label>
                </div>
              ))}
            </div>
          </FilterCategory>

          <FilterCategory title="Último Contato">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="last-contact-from">De</Label>
                <DatePicker
                  id="last-contact-from"
                  date={filters.lastContact.from}
                  setDate={handleLastContactFromChange}
                  placeholder="Data inicial"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="last-contact-to">Até</Label>
                <DatePicker
                  id="last-contact-to"
                  date={filters.lastContact.to}
                  setDate={handleLastContactToChange}
                  placeholder="Data final"
                />
              </div>
            </div>
          </FilterCategory>

          {customFields.length > 0 && (
            <FilterCategory title="Campos Personalizados">
              <div className="space-y-4">
                {customFields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    {renderCustomFieldControl(field)}
                  </div>
                ))}
              </div>
            </FilterCategory>
          )}

          {children}
        </div>
      </ScrollArea>

      <div className="filter-actions flex justify-between pt-4 border-t mt-4">
        <Button variant="outline" onClick={onResetFilters}>Resetar</Button>
        <Button onClick={onApplyFilters}>Aplicar Filtros</Button>
      </div>
    </div>
  );
};

export default FilterComponent;