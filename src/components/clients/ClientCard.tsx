
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail, Edit2 } from 'lucide-react';
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
    onCardClick(contact);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(contact);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
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
            onClick={handleEditClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Edit2 className="h-4 w-4" />
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
            <div 
              className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded p-1 -m-1 transition-colors"
              onClick={handleMessageClick}
            >
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
