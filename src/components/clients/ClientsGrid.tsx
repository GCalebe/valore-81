import React from 'react';
import { Contact } from '@/types/client';
import ClientCard from './ClientCard';
import { isDateInPeriod } from '@/utils/dateUtils';

interface ClientsGridProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  onContactClick: (contact: Contact) => void;
  onEditClick: (contact: Contact) => void;
}

const ClientsGrid = ({ 
  contacts, 
  isLoading, 
  searchTerm,
  statusFilter,
  segmentFilter,
  lastContactFilter,
  onContactClick,
  onEditClick
}: ClientsGridProps) => {
  const filteredContacts = contacts.filter(contact => {
    // Filtro de busca por texto
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.clientName && contact.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.clientType && contact.clientType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.phone && contact.phone.includes(searchTerm));

    // Filtro de status
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;

    // Filtro de segmento (kanban stage)
    const matchesSegment = segmentFilter === 'all' || contact.kanbanStage === segmentFilter;

    // Filtro de último contato
    const matchesLastContact = lastContactFilter === 'all' || isDateInPeriod(contact.lastContact, lastContactFilter);

    return matchesSearch && matchesStatus && matchesSegment && matchesLastContact;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-500">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {searchTerm || statusFilter !== 'all' || segmentFilter !== 'all' || lastContactFilter !== 'all'
            ? 'Nenhum cliente encontrado com os filtros aplicados.' 
            : 'Nenhum cliente disponível. Adicione seu primeiro cliente!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredContacts.map((contact) => (
        <ClientCard
          key={contact.id}
          contact={contact}
          onCardClick={onContactClick}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
};

export default ClientsGrid;
