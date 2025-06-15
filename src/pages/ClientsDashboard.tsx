import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Users, Grid, List, Minimize2, Maximize2, X } from 'lucide-react';
import { Contact } from '@/types/client';
import { useClientManagement } from '@/hooks/useClientManagement';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsTable from '@/components/clients/ClientsTable';
import KanbanView from '@/components/clients/KanbanView';
import FilterDialog from '@/components/clients/FilterDialog';
import AddClientDialog from '@/components/clients/AddClientDialog';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import EditClientDialog from '@/components/clients/EditClientDialog';
import DeleteClientDialog from '@/components/clients/DeleteClientDialog';
import SendMessageDialog from '@/components/clients/SendMessageDialog';
import PauseDurationDialog from '@/components/PauseDurationDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const ClientsDashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [lastContactFilter, setLastContactFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isCompactView, setIsCompactView] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const {
    contacts,
    loadingContacts,
    refreshing,
    selectedContact,
    setSelectedContact,
    isAddContactOpen,
    setIsAddContactOpen,
    isDetailSheetOpen,
    setIsDetailSheetOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMessageDialogOpen,
    setIsMessageDialogOpen,
    isPauseDurationDialogOpen,
    setIsPauseDurationDialogOpen,
    messageText,
    setMessageText,
    newContact,
    setNewContact,
    handleRefresh,
    handleContactClick,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    openEditModal,
    handleMessageClick,
    handleMessageSubmit,
    handlePauseDurationConfirm,
    handleKanbanStageChange
  } = useClientManagement();

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    openEditModal();
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setSegmentFilter('all');
    setLastContactFilter('all');
    setSearchTerm('');
  };

  const hasActiveFilters = statusFilter !== 'all' || segmentFilter !== 'all' || lastContactFilter !== 'all' || searchTerm !== '';

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/');
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ClientsHeader />
      
      <main className="flex-1 flex flex-col w-full px-4 py-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
              Clientes
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {viewMode === 'kanban' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsCompactView(!isCompactView)}
                      className="h-9 w-9"
                    >
                      {isCompactView ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isCompactView ? 'Visão Padrão' : 'Visão Compacta'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex items-center border rounded-lg bg-white dark:bg-gray-800">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
            
            <FilterDialog
              isOpen={isFilterDialogOpen}
              onOpenChange={setIsFilterDialogOpen}
              statusFilter={statusFilter}
              segmentFilter={segmentFilter}
              lastContactFilter={lastContactFilter}
              onStatusFilterChange={setStatusFilter}
              onSegmentFilterChange={setSegmentFilter}
              onLastContactFilterChange={setLastContactFilter}
              onClearFilters={() => {
                handleClearFilters();
                setIsFilterDialogOpen(false);
              }}
              hasActiveFilters={hasActiveFilters}
            />

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
          </div>
          
          <AddClientDialog
            isOpen={isAddContactOpen}
            onOpenChange={setIsAddContactOpen}
            newContact={newContact}
            setNewContact={setNewContact}
            handleAddContact={handleAddContact}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          {viewMode === 'table' ? (
            <ClientsTable
              contacts={contacts}
              isLoading={loadingContacts}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              segmentFilter={segmentFilter}
              lastContactFilter={lastContactFilter}
              onContactClick={handleContactClick}
              onEditClick={handleEditClick}
            />
          ) : (
            <KanbanView
              contacts={contacts}
              onContactClick={handleContactClick}
              onStageChange={handleKanbanStageChange}
              searchTerm={searchTerm}
              onEditClick={handleEditClick}
              isCompact={isCompactView}
            />
          )}
        </div>

        {selectedContact && (
          <ClientDetailSheet
            isOpen={isDetailSheetOpen}
            onOpenChange={setIsDetailSheetOpen}
            selectedContact={selectedContact}
            onEditClick={openEditModal}
            onDeleteClick={() => setIsDeleteDialogOpen(true)}
            onSendMessageClick={() => setIsMessageDialogOpen(true)}
            isDeleteDialogOpen={isDeleteDialogOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            handleDeleteContact={handleDeleteContact}
            isMessageDialogOpen={isMessageDialogOpen}
            setIsMessageDialogOpen={setIsMessageDialogOpen}
            messageText={messageText}
            setMessageText={setMessageText}
            handleMessageSubmit={handleMessageSubmit}
            isPauseDurationDialogOpen={isPauseDurationDialogOpen}
            setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
            handlePauseDurationConfirm={handlePauseDurationConfirm}
          />
        )}

        {selectedContact && (
          <EditClientDialog
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            selectedContact={selectedContact}
            editContactData={newContact}
            setEditContactData={setNewContact}
            handleEditContact={handleEditContact}
          />
        )}

        {selectedContact && (
          <DeleteClientDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            selectedContact={selectedContact}
            handleDeleteContact={handleDeleteContact}
          />
        )}

        {selectedContact && isMessageDialogOpen && (
          <SendMessageDialog
            isOpen={isMessageDialogOpen}
            selectedContact={selectedContact}
            messageText={messageText}
            setMessageText={setMessageText}
            handleMessageSubmit={handleMessageSubmit}
            onOpenChange={setIsMessageDialogOpen}
            isPauseDurationDialogOpen={isPauseDurationDialogOpen}
            setIsPauseDurationDialogOpen={setIsPauseDurationDialogOpen}
            handlePauseDurationConfirm={handlePauseDurationConfirm}
          />
        )}

        <PauseDurationDialog
          isOpen={isPauseDurationDialogOpen}
          onClose={() => setIsPauseDurationDialogOpen(false)}
          onConfirm={handlePauseDurationConfirm}
          phoneNumber={selectedContact?.phone || ''}
        />
      </main>
    </div>
  );
};

export default ClientsDashboard;
