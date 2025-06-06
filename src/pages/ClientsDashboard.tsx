import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, RefreshCw, Users, Grid, List, LayoutGrid } from 'lucide-react';
import { useClientManagement } from '@/hooks/useClientManagement';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsTable from '@/components/clients/ClientsTable';
import ClientsGrid from '@/components/clients/ClientsGrid';
import KanbanView from '@/components/clients/KanbanView';
import ClientFilters from '@/components/clients/ClientFilters';
import AddClientDialog from '@/components/clients/AddClientDialog';
import ClientDetailSheet from '@/components/clients/ClientDetailSheet';
import EditClientDialog from '@/components/clients/EditClientDialog';
import DeleteClientDialog from '@/components/clients/DeleteClientDialog';
import SendMessageDialog from '@/components/clients/SendMessageDialog';
import PauseDurationDialog from '@/components/PauseDurationDialog';

const ClientsDashboard = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [lastContactFilter, setLastContactFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'grid'>('grid');

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

  const handleChatClick = (contact: any) => {
    // Navigate to chat page with the contact
    navigate(`/chats?contact=${contact.id}`);
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="h-16 w-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <ClientsHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                Clientes Náuticos
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg bg-white dark:bg-gray-800">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-none"
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

        <div className="mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4"
              />
            </div>
            
            <AddClientDialog
              isOpen={isAddContactOpen}
              onOpenChange={setIsAddContactOpen}
              newContact={newContact}
              setNewContact={setNewContact}
              handleAddContact={handleAddContact}
            />
          </div>

          <ClientFilters
            statusFilter={statusFilter}
            segmentFilter={segmentFilter}
            lastContactFilter={lastContactFilter}
            onStatusFilterChange={setStatusFilter}
            onSegmentFilterChange={setSegmentFilter}
            onLastContactFilterChange={setLastContactFilter}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {viewMode === 'grid' ? (
          <ClientsGrid
            contacts={contacts}
            isLoading={loadingContacts}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            segmentFilter={segmentFilter}
            lastContactFilter={lastContactFilter}
            onContactClick={handleChatClick}
            onEditClick={handleEditClick}
          />
        ) : viewMode === 'table' ? (
          <ClientsTable
            contacts={contacts}
            isLoading={loadingContacts}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            segmentFilter={segmentFilter}
            lastContactFilter={lastContactFilter}
            onContactClick={handleContactClick}
          />
        ) : (
          <KanbanView
            contacts={contacts}
            onContactClick={handleContactClick}
            onStageChange={handleKanbanStageChange}
            searchTerm={searchTerm}
          />
        )}

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
