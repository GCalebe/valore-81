
import React from 'react';
import { Contact } from '@/types/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { isDateInPeriod } from '@/utils/dateUtils';
import { useClientNavigation } from '@/utils/navigationUtils';

interface ClientsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  searchTerm: string;
  statusFilter: string;
  segmentFilter: string;
  lastContactFilter: string;
  onContactClick: (contact: Contact) => void;
  onEditClick: (contact: Contact) => void;
}

const ClientsTable = ({ 
  contacts, 
  isLoading, 
  searchTerm,
  statusFilter,
  segmentFilter,
  lastContactFilter,
  onContactClick,
  onEditClick
}: ClientsTableProps) => {
  const { navigateToClientChat } = useClientNavigation();

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

  const handleWhatsAppClick = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation();
    const chatId = contact.sessionId || contact.id.toString();
    navigateToClientChat(chatId);
  };

  const handleRowClick = (contact: Contact) => {
    // Agora o clique na linha abre a edição
    onEditClick(contact);
  };

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
              onClick={() => handleRowClick(contact)}
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
                  onClick={(e) => handleWhatsAppClick(e, contact)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 p-2"
                  title="Abrir conversa no WhatsApp"
                >
                  <svg 
                    className="h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
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
