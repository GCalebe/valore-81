import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CustomFieldFilter } from '@/hooks/useClientsFilters';
import { useCustomFields } from '@/hooks/useCustomFields';

interface CustomFieldFiltersProps {
  customFieldFilters: CustomFieldFilter[];
  onAddCustomFieldFilter: (filter: CustomFieldFilter) => void;
  onRemoveCustomFieldFilter: (fieldId: string) => void;
  onClearCustomFieldFilters: () => void;
  preselectedFieldId?: string;
  compact?: boolean;
}

const CustomFieldFilters = ({
  customFieldFilters,
  onAddCustomFieldFilter,
  onRemoveCustomFieldFilter,
  onClearCustomFieldFilters,
  preselectedFieldId,
  compact = false
}: CustomFieldFiltersProps) => {
  const { customFields, loading } = useCustomFields();
  const [selectedFieldId, setSelectedFieldId] = useState<string>(preselectedFieldId || '');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState<any>(null);

  useEffect(() => {
    if (preselectedFieldId) {
      setSelectedFieldId(preselectedFieldId);
    }
  }, [preselectedFieldId]);

  useEffect(() => {
    if (selectedFieldId && customFields) {
      const field = customFields.find(field => field.id === selectedFieldId);
      setSelectedField(field);
    } else {
      setSelectedField(null);
    }
  }, [selectedFieldId, customFields]);

  const handleAddFilter = () => {
    if (selectedFieldId && filterValue.trim() !== '') {
      onAddCustomFieldFilter({
        fieldId: selectedFieldId,
        value: filterValue,
        fieldName: selectedField?.name || 'Campo personalizado'
      });
      if (!preselectedFieldId) {
        setSelectedFieldId('');
      }
      setFilterValue('');
      setSelectedField(null);
    }
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {!preselectedFieldId && (
          <div className="grid gap-2">
            <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
              <SelectTrigger id="custom-field-filter" className="w-full">
                <SelectValue placeholder="Selecione um campo" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>Carregando...</SelectItem>
                ) : (
                  customFields?.map(field => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedField && (
          <div className="grid gap-2">
            {selectedField.type === 'select' ? (
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger id="filter-value" className="w-full">
                  <SelectValue placeholder="Selecione um valor" />
                </SelectTrigger>
                <SelectContent>
                  {selectedField.options?.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="filter-value"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Digite o valor"
              />
            )}
          </div>
        )}

        {selectedFieldId && (
          <Button 
            onClick={handleAddFilter} 
            className="flex items-center gap-2 w-full"
            disabled={!filterValue.trim()}
            size="sm"
          >
            <Plus className="h-3 w-3" />
            Adicionar
          </Button>
        )}

        {customFieldFilters.length > 0 && (
          <div className="mt-2">
            <div className="space-y-1">
              {customFieldFilters.map((filter) => (
                <div
                  key={filter.fieldId}
                  className="flex items-center justify-between bg-muted p-1.5 rounded-md text-xs"
                >
                  <span>
                    {!preselectedFieldId && `${filter.fieldName}: `}<strong>{filter.value}</strong>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onRemoveCustomFieldFilter(filter.fieldId)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="custom-field-filter">Campo Personalizado</Label>
          <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
            <SelectTrigger id="custom-field-filter" className="w-full">
              <SelectValue placeholder="Selecione um campo" />
            </SelectTrigger>
            <SelectContent>
              {loading ? (
                <SelectItem value="loading" disabled>Carregando...</SelectItem>
              ) : (
                customFields?.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {selectedField && (
          <div className="grid gap-2">
            <Label htmlFor="filter-value">Valor</Label>
            {selectedField.type === 'select' ? (
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger id="filter-value" className="w-full">
                  <SelectValue placeholder="Selecione um valor" />
                </SelectTrigger>
                <SelectContent>
                  {selectedField.options?.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="filter-value"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder={`Valor para ${selectedField.name}`}
              />
            )}
          </div>
        )}

        {selectedFieldId && (
          <Button 
            onClick={handleAddFilter} 
            className="flex items-center gap-2"
            disabled={!filterValue.trim()}
          >
            <Plus className="h-4 w-4" />
            Adicionar Filtro
          </Button>
        )}
      </div>

      {customFieldFilters.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium">Filtros Ativos</div>
          <div className="flex flex-wrap gap-2">
            {customFieldFilters.map((filter) => (
              <Badge key={filter.fieldId} variant="secondary" className="flex items-center gap-1">
                {filter.fieldName}: {filter.value}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => onRemoveCustomFieldFilter(filter.fieldId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCustomFieldFilters}
            className="flex items-center gap-2 mt-2"
          >
            <X className="h-4 w-4" />
            Limpar filtros personalizados
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomFieldFilters;