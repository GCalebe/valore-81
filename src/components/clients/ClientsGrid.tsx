
import React from 'react';
import { Contact } from '@/types/client';
import ClientCard from './ClientCard';

interface ClientsGridProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  onContactClick: (contact: Contact) => void;
  onEditClick: (contact: Contact) => void;
}

const ClientsGrid = ({ 
  contacts, 
  isLoading, 
  searchTerm,
  onContactClick,
  onEditClick
}: ClientsGridProps) => {
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.clientName && contact.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.clientType && contact.clientType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

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
          {searchTerm 
            ? 'Nenhum cliente encontrado com esse termo de busca.' 
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
