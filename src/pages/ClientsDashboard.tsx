import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Contact } from '@/types/client';
import { useClientManagement } from '@/hooks/useClientManagement';
import ClientsHeader from '@/components/clients/ClientsHeader';
import ClientsTable from '@/components/clients/ClientsTable';
import KanbanView from '@/components/clients/KanbanView';
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
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban'); // padrão agora é kanban
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
      <ClientsHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isFilterDialogOpen={isFilterDialogOpen}
        setIsFilterDialogOpen={setIsFilterDialogOpen}
        statusFilter={statusFilter}
        segmentFilter={segmentFilter}
        lastContactFilter={lastContactFilter}
        onStatusFilterChange={setStatusFilter}
        onSegmentFilterChange={setSegmentFilter}
        onLastContactFilterChange={setLastContactFilter}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
        isAddContactOpen={isAddContactOpen}
        onAddContactOpenChange={setIsAddContactOpen}
        newContact={newContact}
        setNewContact={setNewContact}
        handleAddContact={handleAddContact}
        // Novos props para os botões:
        viewMode={viewMode}
        setViewMode={setViewMode}
        isCompactView={isCompactView}
        setIsCompactView={setIsCompactView}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
      />
      
      <main className="flex-1 flex flex-col w-full px-4 py-4 overflow-hidden">
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

// O arquivo está ficando muito longo (269+ linhas). Considere pedir para eu refatorar em arquivos menores.
