
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import FilterDialog from '@/components/clients/FilterDialog';
import AddClientDialog from '@/components/clients/AddClientDialog';
import ClientsCompactToggler from './ClientsCompactToggler';
import ClientsViewToggler from './ClientsViewToggler';
import ClientsRefreshButton from './ClientsRefreshButton';

interface ClientsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isFilterDialogOpen: boolean;
  setIsFilterDialogOpen: (isOpen: boolean) => void;
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSegmentFilterChange: (value: string) => void;
  onLastContactFilterChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  isAddContactOpen: boolean;
  onAddContactOpenChange: (open: boolean) => void;
  newContact: Partial<any>;
  setNewContact: (contact: Partial<any>) => void;
  handleAddContact: () => void;
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
      className="shadow-md transition-colors duration-300 rounded-b-xl"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="flex flex-row items-center justify-between min-h-[64px] w-full px-6 py-0">
        {/* Branding e título */}
        <div className="flex items-center gap-4 min-w-0 h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20 focus-visible:ring-white"
            aria-label="Voltar ao dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <User className="h-5 w-5 text-white" />
          {settings.logo
            ? (
              <img
                src={settings.logo}
                alt="Logo"
                className="h-7 w-7 object-contain"
              />
            ) : (
              <span>
                <svg width="28" height="28" viewBox="0 0 24 24" fill={settings.secondaryColor || "#FBBF24"}><circle cx="12" cy="12" r="10" /></svg>
              </span>
            )}
          <h1 className="text-xl font-bold text-white"> {settings.brandName} </h1>
          <span className="text-base ml-1 opacity-80 text-white">- Clientes</span>
        </div>

        {/* Grupo principal: busca, filtros, novo cliente e controles */}
        <div className="flex flex-row items-center gap-3 h-full">
          {/* Busca */}
          <div className="relative w-[190px]">
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-2 h-10 w-full bg-white text-blue-900 placeholder-blue-200 border-0 rounded-md focus:bg-white focus:text-blue-900 focus:ring-2 focus:ring-blue-200 focus:border-transparent"
            />
          </div>
          {/* Filtros */}
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

          {/* Add Cliente */}
          <AddClientDialog
            isOpen={isAddContactOpen}
            onOpenChange={onAddContactOpenChange}
            newContact={newContact}
            setNewContact={setNewContact}
            handleAddContact={handleAddContact}
          />

          {/* Divisor */}
          <div className="h-7 w-px bg-white/30 mx-2 hidden md:block"></div>

          {/* Controles de Kanban/Table/Compact */}
          <div className="flex items-center gap-1 bg-white/10 rounded-md px-1">
            {viewMode === "kanban" && (
              <ClientsCompactToggler isCompactView={isCompactView} setIsCompactView={setIsCompactView} visible />
            )}
            <ClientsViewToggler viewMode={viewMode} setViewMode={setViewMode} />
          </div>

          {/* Botão atualizar */}
          <ClientsRefreshButton
            handleRefresh={handleRefresh}
            refreshing={refreshing}
          />

          {/* Divisor */}
          <div className="h-7 w-px bg-white/30 mx-2 hidden md:block"></div>

          {/* Usuário e config */}
          <div className="flex items-center gap-2 min-w-fit">
            <Badge variant="outline" className="bg-white/10 text-white border border-white/40 px-3 py-1 font-normal rounded-md">
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
