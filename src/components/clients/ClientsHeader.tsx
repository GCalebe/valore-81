
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShipWheel, X, RefreshCw, Users, Grid, List, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import FilterDialog from '@/components/clients/FilterDialog';
import AddClientDialog from '@/components/clients/AddClientDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Contact } from '@/types/client';

interface ClientsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilterDialogOpen: boolean;
  setIsFilterDialogOpen: (isOpen: boolean) => void;
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSegmentFilterChange: (value:string) => void;
  onLastContactFilterChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isAddContactOpen: boolean;
  onAddContactOpenChange: (open: boolean) => void;
  newContact: Partial<Contact>;
  setNewContact: (contact: Partial<Contact>) => void;
  handleAddContact: () => void;
  // Novas props:
  viewMode: 'table' | 'kanban';
  setViewMode: (v: 'table' | 'kanban') => void;
  isCompactView: boolean;
  setIsCompactView: (val: boolean) => void;
  refreshing: boolean;
  handleRefresh: () => void;
}

const ClientsHeader = ({
  searchTerm,
  setSearchTerm,
  isFilterDialogOpen,
  setIsFilterDialogOpen,
  statusFilter,
  segmentFilter,
  lastContactFilter,
  onStatusFilterChange,
  onSegmentFilterChange,
  onLastContactFilterChange,
  onClearFilters,
  hasActiveFilters,
  isAddContactOpen,
  onAddContactOpenChange,
  newContact,
  setNewContact,
  handleAddContact,
  viewMode,
  setViewMode,
  isCompactView,
  setIsCompactView,
  refreshing,
  handleRefresh,
}: ClientsHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useThemeSettings();

  return (
    <header 
      className="text-white shadow-md transition-colors duration-300"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="container mx-auto px-2 py-3 flex flex-wrap justify-between items-center gap-4 min-h-[56px]">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Users className="h-6 w-6 text-blue-200/80" />
          {settings.logo ? (
            <img 
              src={settings.logo} 
              alt="Logo" 
              className="h-8 w-8 object-contain"
            />
          ) : (
            <ShipWheel 
              className="h-8 w-8"
              style={{ color: settings.secondaryColor }}
            />
          )}
          <h1 className="text-2xl font-bold">{settings.brandName}</h1>
          <span className="text-lg ml-2">- Clientes</span>
        </div>

        {/* BLOCO DE BOTOES/CONTROLES DO CABEÇALHO */}
        <div className="flex flex-1 sm:flex-initial items-center justify-end gap-2 flex-wrap">
          {/* Barra de busca */}
          <div className="relative flex-1 min-w-[180px] sm:flex-initial sm:w-auto sm:max-w-xs">
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-2 h-9 w-full bg-white/10 text-white placeholder-gray-200 border-0 rounded-md focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
              style={{ minWidth: 160 }}
            />
          </div>
          
          <FilterDialog
            isOpen={isFilterDialogOpen}
            onOpenChange={setIsFilterDialogOpen}
            statusFilter={statusFilter}
            segmentFilter={segmentFilter}
            lastContactFilter={lastContactFilter}
            onStatusFilterChange={onStatusFilterChange}
            onSegmentFilterChange={onSegmentFilterChange}
            onLastContactFilterChange={onLastContactFilterChange}
            onClearFilters={() => {
              onClearFilters();
              setIsFilterDialogOpen(false);
            }}
            hasActiveFilters={hasActiveFilters}
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}

          {/* Botão novo cliente - mais destacado sobre azul */}
          <AddClientDialog
            isOpen={isAddContactOpen}
            onOpenChange={onAddContactOpenChange}
            newContact={newContact}
            setNewContact={setNewContact}
            handleAddContact={handleAddContact}
          />

          {/* Divisão visual */}
          <div className="h-6 w-px bg-white/30 mx-2 hidden sm:block"></div>

          {/* Botões de visualização/lista/kanban, atualizar e compacto */}
          <div className="flex items-center gap-2">
            {/* Toggle compact/normal só se for Kanban */}
            {viewMode === 'kanban' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsCompactView(!isCompactView)}
                      className={`h-9 w-9 text-white border-white hover:bg-white/20`}
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    >
                      {isCompactView ? (
                        <Maximize2 className="h-4 w-4 text-white" />
                      ) : (
                        <Minimize2 className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCompactView ? 'Visão Padrão' : 'Visão Compacta'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Selector visualização lista/kanban */}
            <div className="flex items-center border border-white rounded-lg bg-white/10">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={`rounded-r-none ${viewMode === 'table'
                  ? "bg-white text-blue-700"
                  : "text-white hover:bg-white/20 border-0"}`}
                style={viewMode === 'table' ? {} : { borderRight: "1px solid #ffffff55"}}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className={`rounded-l-none ${viewMode === 'kanban'
                  ? "bg-white text-blue-700"
                  : "text-white hover:bg-white/20"}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Atualizar */}
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-white border-white hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} text-white`} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>
          </div>

          <div className="flex items-center gap-4 ml-2">
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientsHeader;

// O arquivo está ficando longo, considere pedir refatoração em componentes menores se desejar.

