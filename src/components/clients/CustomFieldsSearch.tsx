
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface CustomFieldsSearchProps {
  onSearch: (searchTerm: string) => void;
  onFilterByType: (type: string | null) => void;
  onFilterByCategory: (category: string | null) => void;
  onClearFilters: () => void;
  searchTerm: string;
  activeFilters: {
    type?: string;
    category?: string;
  };
}

const CustomFieldsSearch = ({
  onSearch,
  onFilterByType,
  onFilterByCategory,
  onClearFilters,
  searchTerm,
  activeFilters
}: CustomFieldsSearchProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleTypeFilter = (value: string) => {
    if (value === 'all') {
      onFilterByType(null);
    } else {
      onFilterByType(value);
    }
  };

  const handleCategoryFilter = (value: string) => {
    if (value === 'all') {
      onFilterByCategory(null);
    } else {
      onFilterByCategory(value);
    }
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Pesquisar campos personalizados..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Tipo de Campo
              </label>
              <Select 
                value={activeFilters.type || 'all'} 
                onValueChange={handleTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="single_select">Seleção única</SelectItem>
                  <SelectItem value="multi_select">Seleção múltipla</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                Categoria
              </label>
              <Select 
                value={activeFilters.category || 'all'} 
                onValueChange={handleCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                  <SelectItem value="personalized">Personalizado</SelectItem>
                  <SelectItem value="documents">Documentos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {activeFilters.type && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Tipo: {activeFilters.type}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterByType(null)}
                  />
                </Badge>
              )}
              {activeFilters.category && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Categoria: {activeFilters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFilterByCategory(null)}
                  />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-red-600 hover:text-red-700"
              >
                Limpar todos
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CustomFieldsSearch;
