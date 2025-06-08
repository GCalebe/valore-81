
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail } from 'lucide-react';
import { Contact } from '@/types/client';
import { useClientNavigation } from '@/utils/navigationUtils';

interface ClientCardProps {
  contact: Contact;
  onCardClick: (contact: Contact) => void;
  onEditClick: (contact: Contact) => void;
}

const ClientCard = ({ contact, onCardClick, onEditClick }: ClientCardProps) => {
  const { navigateToClientChat } = useClientNavigation();

  const handleCardClick = () => {
    // Agora o clique no card abre a edição
    onEditClick(contact);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use sessionId if available, otherwise fallback to contact id
    const chatId = contact.sessionId || contact.id.toString();
    navigateToClientChat(chatId);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow duration-200 cursor-pointer relative group"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-1">
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {contact.clientName || 'Cliente não especificado'}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWhatsAppClick}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 p-2"
            title="Abrir conversa no WhatsApp"
          >
            <svg 
              className="h-5 w-5" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </Button>
        </div>

        <div className="space-y-2 mb-3">
          {contact.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Phone className="h-3 w-3" />
              <span>{contact.phone}</span>
            </div>
          )}
          
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <Mail className="h-3 w-3" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <div className="flex items-start gap-2">
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
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            contact.status === 'Active' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {contact.status}
          </span>
          
          <span className="text-xs text-gray-500">
            {contact.kanbanStage}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
