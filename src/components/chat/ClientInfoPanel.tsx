
import React from 'react';
import { ShipWheel } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/types/chat';
import { useThemeSettings } from '@/context/ThemeSettingsContext';
import TagsField from './TagsField';
import NotesField from './NotesField';

interface ClientInfoPanelProps {
  selectedChat: string | null;
  selectedConversation: Conversation | undefined;
}

const ClientInfoPanel = ({ selectedChat, selectedConversation }: ClientInfoPanelProps) => {
  const { settings } = useThemeSettings();

  if (!selectedChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <ShipWheel 
          size={64} 
          className="mb-4 opacity-50"
          style={{ color: settings.primaryColor }}
        />
        <h3 className="text-xl font-medium mb-2">Informações do Navegador</h3>
        <p className="text-sm text-center px-4">Selecione uma conversa para ver as informações do navegador</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div 
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl mx-auto mb-4"
          style={{ 
            backgroundColor: `${settings.secondaryColor}20`,
            color: settings.primaryColor 
          }}
        >
          ⚓
        </div>
        <h2 className="text-xl font-semibold">{selectedConversation?.name}</h2>
        <p className="text-gray-500 dark:text-gray-400">{selectedConversation?.phone}</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Tags Field */}
          <TagsField selectedChat={selectedChat} />
          
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="client">Navegador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="mt-4 space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Email de Contato</h3>
                <p>{selectedConversation?.email}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Linha de Comunicação</h3>
                <p>{selectedConversation?.phone}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Porto de Origem</h3>
                <p>{selectedConversation?.address || 'Porto não informado'}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ID de Navegação</h3>
                <p className="text-xs break-all">{selectedConversation?.sessionId || 'ID não informado'}</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="client" className="mt-4 space-y-4">
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Nome do Navegador</h3>
                <p>{selectedConversation?.clientName || 'Não informado'}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Porte da Embarcação</h3>
                <p>{selectedConversation?.clientSize || 'Não informado'}</p>
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tipo de Navegação</h3>
                <p>{selectedConversation?.clientType || 'Não informado'}</p>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Notes Field */}
          <div className="mt-4">
            <NotesField selectedChat={selectedChat} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ClientInfoPanel;
