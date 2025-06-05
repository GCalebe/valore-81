
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, Pause, Play } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { useThemeSettings } from '@/context/ThemeSettingsContext';

interface ConversationListProps {
  conversations: Conversation[];
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  isLoading: Record<string, boolean>;
  openPauseDialog: (phoneNumber: string, e: React.MouseEvent) => void;
  startBot: (phoneNumber: string, e: React.MouseEvent) => void;
  loading: boolean;
}

const ConversationList = ({
  conversations,
  selectedChat,
  setSelectedChat,
  isLoading,
  openPauseDialog,
  startBot,
  loading
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { settings } = useThemeSettings();

  const filteredConversations = conversations.filter(
    conv => conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div 
        className="p-3 text-white"
        style={{ backgroundColor: `${settings.primaryColor}dd` }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
          <Input
            placeholder="Buscar conversas marítimas..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 text-center">
            <p>Carregando conversas náuticas...</p>
          </div>
        ) : (
          filteredConversations.map((conv) => (
            <div key={conv.id} className="border-b border-gray-200 dark:border-gray-700">
              <div
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  selectedChat === conv.id 
                    ? 'border-l-4 shadow-sm' 
                    : ''
                }`}
                style={selectedChat === conv.id ? { 
                  backgroundColor: `${settings.primaryColor}10`,
                  borderLeftColor: settings.primaryColor 
                } : {}}
                onClick={() => setSelectedChat(conv.id)}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-3"
                  style={{ 
                    backgroundColor: `${settings.secondaryColor}20`,
                    color: settings.primaryColor 
                  }}
                >
                  ⚓
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{conv.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                      {conv.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {conv.lastMessage}
                  </p>
                  
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-3 flex items-center gap-1 text-xs border-red-300 text-red-600 hover:bg-red-50"
                      onClick={(e) => openPauseDialog(conv.phone, e)}
                      disabled={isLoading[`pause-${conv.phone}`]}
                    >
                      {isLoading[`pause-${conv.phone}`] ? (
                        <span className="h-3 w-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                      ) : (
                        <>
                          <Pause className="h-3 w-3" />
                          <span>Pausar Navegação</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-3 flex items-center gap-1 text-xs"
                      style={{ 
                        borderColor: settings.primaryColor,
                        color: settings.primaryColor,
                        backgroundColor: `${settings.primaryColor}05`
                      }}
                      onClick={(e) => startBot(conv.phone, e)}
                      disabled={isLoading[`start-${conv.phone}`]}
                    >
                      {isLoading[`start-${conv.phone}`] ? (
                        <span className="h-3 w-3 border-2 border-t-transparent border-current rounded-full animate-spin" />
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          <span>Iniciar Navegação</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                {conv.unread > 0 && (
                  <div 
                    className="ml-2 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
