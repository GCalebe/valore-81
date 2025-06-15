
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShipWheel, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import FilterDialog from '@/components/clients/FilterDialog';
import AddClientDialog from '@/components/clients/AddClientDialog';
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
  handleAddContact
}: ClientsHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useThemeSettings();

  return (
    <header 
      className="text-white shadow-md transition-colors duration-300"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
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

        <div className="flex flex-1 sm:flex-initial items-center justify-end gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] sm:flex-initial sm:w-auto sm:max-w-xs">
            <Input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-4 py-2 h-9 w-full bg-white/10 text-white placeholder-gray-300 border-gray-400/50 rounded-md focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 focus:ring-0 focus:border-transparent"
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
              className="text-white hover:bg-white/10"
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

          <div className="h-6 w-px bg-white/20 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-4">
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
