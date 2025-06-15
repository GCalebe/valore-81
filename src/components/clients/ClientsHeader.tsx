
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShipWheel, Users, X } from 'lucide-react';
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
  onSegmentFilterChange: (value:string) => void;
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
          {settings.logo
            ? (
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

          <AddClientDialog
            isOpen={isAddContactOpen}
            onOpenChange={onAddContactOpenChange}
            newContact={newContact}
            setNewContact={setNewContact}
            handleAddContact={handleAddContact}
          />

          <div className="h-6 w-px bg-white/30 mx-2 hidden sm:block"></div>

          <ClientsCompactToggler isCompactView={isCompactView} setIsCompactView={setIsCompactView} visible={viewMode === "kanban"} />

          <ClientsViewToggler viewMode={viewMode} setViewMode={setViewMode} />

          <ClientsRefreshButton handleRefresh={handleRefresh} refreshing={refreshing} />

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
