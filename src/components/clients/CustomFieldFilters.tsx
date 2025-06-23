import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from 'lucide-react';
import { CustomField } from '@/types/customFields';

interface CustomFieldFilter {
  fieldId: string;
  value: string;
  fieldName: string;
}

interface CustomFieldFiltersProps {
  activeFilters: CustomFieldFilter[];
  onAddCustomFieldFilter: (filter: CustomFieldFilter) => void;
  onRemoveCustomFieldFilter: (fieldId: string) => void;
  onClearCustomFieldFilters: () => void;
  preselectedFieldId?: string;
  compact?: boolean;
}

// Lista estática de propriedades do cliente para filtros
const clientProperties = [
  { id: 'name', name: 'Nome', type: 'text' },
  { id: 'email', name: 'Email', type: 'text' },
  { id: 'phone', name: 'Telefone', type: 'text' },
  { id: 'status', name: 'Status', type: 'select', options: ['Ativo', 'Inativo', 'Pendente'] },
  { id: 'consultationStage', name: 'Etapa da Consulta', type: 'select', options: ['Agendada', 'Realizada', 'Cancelada'] },
  { id: 'source', name: 'Origem', type: 'text' },
  { id: 'city', name: 'Cidade', type: 'text' },
  { id: 'state', name: 'Estado', type: 'text' },
  { id: 'lastContact', name: 'Último Contato', type: 'date' },
  { id: 'nextContact', name: 'Próximo Contato', type: 'date' },
];

export function CustomFieldFilters({
  activeFilters,
  onAddCustomFieldFilter,
  onRemoveCustomFieldFilter,
  onClearCustomFieldFilters,
  preselectedFieldId,
  compact = false
}: CustomFieldFiltersProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string>(preselectedFieldId || '');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedField, setSelectedField] = useState<any | null>(null);

  useEffect(() => {
    if (preselectedFieldId) {
      setSelectedFieldId(preselectedFieldId);
    }
  }, [preselectedFieldId]);

  useEffect(() => {
    if (selectedFieldId) {
      const field = clientProperties.find(f => f.id === selectedFieldId);
      setSelectedField(field || null);
    } else {
      setSelectedField(null);
    }
  }, [selectedFieldId]);

  const handleAddFilter = () => {
    if (selectedFieldId && filterValue.trim() !== '') {
      onAddCustomFieldFilter({
        fieldId: selectedFieldId,
        value: filterValue,
        fieldName: selectedField?.name || 'Propriedade'
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
                <SelectValue placeholder="Selecione uma propriedade" />
              </SelectTrigger>
              <SelectContent>
                {clientProperties.map(field => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.name}
                  </SelectItem>
                ))}
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
                placeholder={`Digite o valor para ${selectedField.name}`}
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

        {activeFilters.length > 0 && (
          <div className="mt-2">
            <div className="space-y-1">
              {activeFilters.map((filter) => (
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
          <Label htmlFor="custom-field-filter">Propriedade do Cliente</Label>
          <Select value={selectedFieldId} onValueChange={setSelectedFieldId}>
            <SelectTrigger id="custom-field-filter" className="w-full">
              <SelectValue placeholder="Selecione uma propriedade" />
            </SelectTrigger>
            <SelectContent>
              {clientProperties.map(field => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
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
            Adicionar Propriedade
          </Button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm font-medium">Filtros Ativos</div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
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
            Limpar filtros de propriedades
          </Button>
        </div>
      )}
    </div>
  );
};
export default CustomFieldFilters;
