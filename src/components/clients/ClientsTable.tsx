
import React from 'react';
import { Contact } from '@/types/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Edit, Phone, Mail } from 'lucide-react';

interface ClientsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  segmentFilter: string;
  onContactClick: (contact: Contact) => void;
}

const ClientsTable = ({ 
  contacts, 
  isLoading, 
  searchTerm,
  statusFilter,
  segmentFilter,
  onContactClick 
}: ClientsTableProps) => {
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

    return matchesSearch && matchesStatus && matchesSegment;
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
          {searchTerm || statusFilter !== 'all' || segmentFilter !== 'all'
            ? 'Nenhum cliente encontrado com os filtros aplicados.' 
            : 'Nenhum cliente disponível. Adicione seu primeiro cliente!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Segmento</TableHead>
            <TableHead>Última Mensagem</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.map((contact) => (
            <TableRow 
              key={contact.id}
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => onContactClick(contact)}
            >
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {contact.phone && (
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  {contact.email && (
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      <span className="truncate max-w-[150px]">{contact.email}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>{contact.clientName || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={contact.status === 'Active' ? 'default' : 'secondary'}>
                  {contact.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{contact.kanbanStage}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2 max-w-[200px]">
                  <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {contact.lastMessage || 'Nenhuma conversa ainda'}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {contact.lastMessageTime || contact.lastContact}
                      </span>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onContactClick(contact);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsTable;
