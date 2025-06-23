import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomFieldFilters from './CustomFieldFilters';
import { CustomFieldFilter } from '@/hooks/useClientsFilters';

interface FilterSidePanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

const FilterSidePanel = ({
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
}: FilterSidePanelProps) => {
  const [filterSearch, setFilterSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Lista de tags disponíveis
  const availableTags = ['Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'];
  
  // Filtrar tags com base na pesquisa
  const filteredTags = tagInput.trim() !== '' 
    ? availableTags.filter(tag => tag.toLowerCase().includes(tagInput.toLowerCase()))
    : [];
  
  // Adicionar tag como filtro
  const handleAddTag = (tag: string) => {
    onSegmentFilterChange(tag);
    setTagInput('');
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Filtros</SheetTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters} 
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar todos
              </Button>
            )}
          </div>
          <SheetDescription>
            Filtre seus clientes por diferentes critérios
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="quick">Filtros Rápidos</TabsTrigger>
            <TabsTrigger value="advanced">Busca Avançada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="space-y-4">
            {/* Filtros Rápidos - Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={statusFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onStatusFilterChange('all')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={statusFilter === 'Active' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onStatusFilterChange('Active')}
                >
                  Ativos
                </Badge>
                <Badge 
                  variant={statusFilter === 'Inactive' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onStatusFilterChange('Inactive')}
                >
                  Inativos
                </Badge>
              </div>
            </div>
            
            <Separator />
            
            {/* Filtros Rápidos - Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={segmentFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onSegmentFilterChange('all')}
                >
                  Todas
                </Badge>
                {availableTags.map(tag => (
                  <Badge 
                    key={tag}
                    variant={segmentFilter === tag ? 'default' : 'outline'} 
                    className="cursor-pointer"
                    onClick={() => onSegmentFilterChange(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Adicionar Tag */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Adicionar Tag</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Digite uma tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  {filteredTags.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-700">
                      {filteredTags.map(tag => (
                        <div 
                          key={tag} 
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700"
                          onClick={() => handleAddTag(tag)}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  disabled={!tagInput.trim()}
                  onClick={() => handleAddTag(tagInput)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            {/* Filtros Rápidos - Último Contato */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Último Contato</Label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={lastContactFilter === 'all' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onLastContactFilterChange('all')}
                >
                  Todos
                </Badge>
                <Badge 
                  variant={lastContactFilter === 'today' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onLastContactFilterChange('today')}
                >
                  Hoje
                </Badge>
                <Badge 
                  variant={lastContactFilter === 'week' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onLastContactFilterChange('week')}
                >
                  Esta semana
                </Badge>
                <Badge 
                  variant={lastContactFilter === 'month' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onLastContactFilterChange('month')}
                >
                  Este mês
                </Badge>
                <Badge 
                  variant={lastContactFilter === 'older' ? 'default' : 'outline'} 
                  className="cursor-pointer"
                  onClick={() => onLastContactFilterChange('older')}
                >
                  Mais antigo
                </Badge>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <ScrollArea className="h-[calc(100vh-220px)] pr-4">
              {/* Busca Avançada - Propriedades Adicionais */}
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
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="pt-4 border-t mt-4">
          <Button onClick={() => onOpenChange(false)}>Aplicar Filtros</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSidePanel;