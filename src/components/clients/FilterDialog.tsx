
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ClientFilters from './ClientFilters';
import CustomFieldFilters from './CustomFieldFilters';
import { CustomFieldFilter } from '@/hooks/useClientsFilters';

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  customFieldFilters: CustomFieldFilter[];
  onStatusFilterChange: (value: string) => void;
  onSegmentFilterChange: (value: string) => void;
  onLastContactFilterChange: (value: string) => void;
  onAddCustomFieldFilter: (filter: CustomFieldFilter) => void;
  onRemoveCustomFieldFilter: (fieldId: string) => void;
  onClearFilters: () => void;
  onClearCustomFieldFilters: () => void;
  hasActiveFilters: boolean;
}

interface FilterCategoryProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

// Componente para categoria de filtro colapsável
const FilterCategory = ({ title, children, defaultOpen = false }: FilterCategoryProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full border rounded-md mb-3">
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left font-medium">
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-3 pt-0 border-t">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const FilterDialog = ({
  isOpen,
  onOpenChange,
  statusFilter,
  segmentFilter,
  lastContactFilter,
  customFieldFilters,
  onStatusFilterChange,
  onSegmentFilterChange,
  onLastContactFilterChange,
  onAddCustomFieldFilter,
  onRemoveCustomFieldFilter,
  onClearFilters,
  onClearCustomFieldFilters,
  hasActiveFilters
}: FilterDialogProps) => {
  const [filterSearch, setFilterSearch] = useState('');
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="relative border-white text-white bg-transparent hover:bg-white/20"
          style={{ height: 40, borderRadius: 8, borderWidth: 1.4 }}
        >
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Filtrar Clientes</DialogTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar todos os filtros
              </Button>
            )}
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tags..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          {filterSearch.trim() !== '' && (
            <div className="mt-2 p-2 border rounded-md bg-muted/50">
              <p className="text-sm font-medium mb-2">Tags encontradas:</p>
              <div className="flex flex-wrap gap-2">
                {['Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram']
                  .filter(tag => tag.toLowerCase().includes(filterSearch.toLowerCase()))
                  .map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => onSegmentFilterChange(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 mt-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <FilterCategory title="Propriedades de Lead" defaultOpen={true}>
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      <Label htmlFor="status-filter">Status do cliente</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="status-all" 
                            checked={statusFilter === 'all'} 
                            onCheckedChange={() => onStatusFilterChange('all')} 
                          />
                          <label htmlFor="status-all" className="text-sm">Todos os status</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="status-active" 
                            checked={statusFilter === 'Active'} 
                            onCheckedChange={() => onStatusFilterChange('Active')} 
                          />
                          <label htmlFor="status-active" className="text-sm">Ativo</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="status-inactive" 
                            checked={statusFilter === 'Inactive'} 
                            onCheckedChange={() => onStatusFilterChange('Inactive')} 
                          />
                          <label htmlFor="status-inactive" className="text-sm">Inativo</label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <Label htmlFor="segment-filter">Tags do Cliente</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-all" 
                            checked={segmentFilter === 'all'} 
                            onCheckedChange={() => onSegmentFilterChange('all')} 
                          />
                          <label htmlFor="segment-all" className="text-sm">Todas as tags</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-entraram" 
                            checked={segmentFilter === 'Entraram'} 
                            onCheckedChange={() => onSegmentFilterChange('Entraram')} 
                          />
                          <label htmlFor="segment-entraram" className="text-sm">Entraram</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-conversaram" 
                            checked={segmentFilter === 'Conversaram'} 
                            onCheckedChange={() => onSegmentFilterChange('Conversaram')} 
                          />
                          <label htmlFor="segment-conversaram" className="text-sm">Conversaram</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-agendaram" 
                            checked={segmentFilter === 'Agendaram'} 
                            onCheckedChange={() => onSegmentFilterChange('Agendaram')} 
                          />
                          <label htmlFor="segment-agendaram" className="text-sm">Agendaram</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-compareceram" 
                            checked={segmentFilter === 'Compareceram'} 
                            onCheckedChange={() => onSegmentFilterChange('Compareceram')} 
                          />
                          <label htmlFor="segment-compareceram" className="text-sm">Compareceram</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-negociaram" 
                            checked={segmentFilter === 'Negociaram'} 
                            onCheckedChange={() => onSegmentFilterChange('Negociaram')} 
                          />
                          <label htmlFor="segment-negociaram" className="text-sm">Negociaram</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-postergaram" 
                            checked={segmentFilter === 'Postergaram'} 
                            onCheckedChange={() => onSegmentFilterChange('Postergaram')} 
                          />
                          <label htmlFor="segment-postergaram" className="text-sm">Postergaram</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="segment-converteram" 
                            checked={segmentFilter === 'Converteram'} 
                            onCheckedChange={() => onSegmentFilterChange('Converteram')} 
                          />
                          <label htmlFor="segment-converteram" className="text-sm">Converteram</label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid gap-2">
                      <Label htmlFor="last-contact-filter">Último Contato</Label>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="last-contact-all" 
                            checked={lastContactFilter === 'all'} 
                            onCheckedChange={() => onLastContactFilterChange('all')} 
                          />
                          <label htmlFor="last-contact-all" className="text-sm">Todos os períodos</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="last-contact-today" 
                            checked={lastContactFilter === 'today'} 
                            onCheckedChange={() => onLastContactFilterChange('today')} 
                          />
                          <label htmlFor="last-contact-today" className="text-sm">Hoje</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="last-contact-week" 
                            checked={lastContactFilter === 'week'} 
                            onCheckedChange={() => onLastContactFilterChange('week')} 
                          />
                          <label htmlFor="last-contact-week" className="text-sm">Esta semana</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="last-contact-month" 
                            checked={lastContactFilter === 'month'} 
                            onCheckedChange={() => onLastContactFilterChange('month')} 
                          />
                          <label htmlFor="last-contact-month" className="text-sm">Este mês</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="last-contact-older" 
                            checked={lastContactFilter === 'older'} 
                            onCheckedChange={() => onLastContactFilterChange('older')} 
                          />
                          <label htmlFor="last-contact-older" className="text-sm">Mais antigo</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </FilterCategory>
              </div>
              
              <div className="space-y-4">
                <FilterCategory title="Propriedades Adicionais" defaultOpen={true}>
                  <div className="space-y-4">
                    <CustomFieldFilters
                      activeFilters={customFieldFilters}
                      onAddCustomFieldFilter={onAddCustomFieldFilter}
                      onRemoveCustomFieldFilter={onRemoveCustomFieldFilter}
                      onClearCustomFieldFilters={onClearCustomFieldFilters}
                      compact={false}
                    />
                  </div>
                </FilterCategory>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="pt-4 border-t mt-4">
          <Button onClick={() => onOpenChange(false)}>Aplicar Filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
