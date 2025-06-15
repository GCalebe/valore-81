import React, { useRef, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Contact } from '@/types/client';
import { User, Phone, Mail, ShipWheel, Edit2, MessageCircle } from 'lucide-react';
import { useClientNavigation } from '@/utils/navigationUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface KanbanViewProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
  onStageChange: (contactId: string, newStage: Contact['kanbanStage']) => void;
  searchTerm: string;
  onEditClick: (contact: Contact) => void;
  isCompact: boolean;
}

const KANBAN_STAGES: Contact['kanbanStage'][] = [
  'Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'
];

const STAGE_COLORS: { [key in Contact['kanbanStage']]: string } = {
    'Entraram': 'bg-gray-100 dark:bg-gray-800/50',
    'Conversaram': 'bg-blue-100 dark:bg-blue-900/40',
    'Agendaram': 'bg-yellow-100 dark:bg-yellow-900/40',
    'Compareceram': 'bg-green-100 dark:bg-green-900/40',
    'Negociaram': 'bg-purple-100 dark:bg-purple-900/40',
    'Postergaram': 'bg-orange-100 dark:bg-orange-900/40',
    'Converteram': 'bg-emerald-100 dark:bg-emerald-900/40'
};

const STAGE_HEADER_COLORS: { [key in Contact['kanbanStage']]: string } = {
    'Entraram': 'text-gray-500 dark:text-gray-400',
    'Conversaram': 'text-blue-500 dark:text-blue-400',
    'Agendaram': 'text-yellow-500 dark:text-yellow-400',
    'Compareceram': 'text-green-500 dark:text-green-400',
    'Negociaram': 'text-purple-500 dark:text-purple-400',
    'Postergaram': 'text-orange-500 dark:text-orange-400',
    'Converteram': 'text-emerald-500 dark:text-emerald-400'
};

const KanbanView = ({ contacts, onContactClick, onStageChange, searchTerm, onEditClick, isCompact }: KanbanViewProps) => {
  const { navigateToClientChat } = useClientNavigation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.clientName && contact.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchTerm))
  );

  const contactsByStage = KANBAN_STAGES.reduce((acc, stage) => {
    acc[stage] = filteredContacts.filter(contact => contact.kanbanStage === stage);
    return acc;
  }, {} as Record<Contact['kanbanStage'], Contact[]>);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId as Contact['kanbanStage'];
    onStageChange(draggableId, newStage);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    
    // Only start drag if clicking on the container itself, not on cards or other elements
    if (e.target === scrollContainerRef.current || (e.target as Element).closest('.kanban-drag-area')) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWhatsAppClick = (e: React.MouseEvent, contact: Contact) => {
    e.stopPropagation();
    const chatId = contact.sessionId || contact.id.toString();
    navigateToClientChat(chatId);
  };

  const ClientCard = ({ contact, index, isCompact }: { contact: Contact; index: number; isCompact: boolean }) => (
    <Draggable draggableId={contact.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="px-1"
        >
          <Card 
            className={cn(
              `mb-2 cursor-pointer transition-all duration-200 hover:shadow-lg dark:hover:shadow-blue-500/20 relative border-l-4`,
              snapshot.isDragging ? 'shadow-xl rotate-1 scale-105' : 'shadow-sm',
              'bg-card'
            )}
            style={{ borderLeftColor: STAGE_HEADER_COLORS[contact.kanbanStage].includes('blue') ? '#3b82f6' : STAGE_HEADER_COLORS[contact.kanbanStage].includes('yellow') ? '#f59e0b' : STAGE_HEADER_COLORS[contact.kanbanStage].includes('green') ? '#22c55e' : STAGE_HEADER_COLORS[contact.kanbanStage].includes('purple') ? '#8b5cf6' : STAGE_HEADER_COLORS[contact.kanbanStage].includes('orange') ? '#f97316' : STAGE_HEADER_COLORS[contact.kanbanStage].includes('emerald') ? '#10b981' : '#64748b' }}
            onClick={() => onContactClick(contact)}
          >
            <CardContent className={cn("p-2 text-sm", isCompact && "py-1.5")}>
              <div className="flex items-start justify-between mb-1">
                <span className="font-semibold text-gray-800 dark:text-gray-100 pr-2 truncate" title={contact.name}>
                  {contact.name}
                </span>
              </div>
              
              {!isCompact && contact.clientName && (
                <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                  <ShipWheel className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{contact.clientName}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {contact.lastContact}
                </div>

                <div className="flex items-center -mr-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); onEditClick(contact); }}
                        className="h-7 w-7"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Editar Cliente</p></TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleWhatsAppClick(e, contact)}
                            className="h-7 w-7"
                        >
                            <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Abrir no WhatsApp</p></TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div 
          ref={scrollContainerRef}
          className={`overflow-x-auto overflow-y-hidden h-full select-none transition-all duration-200 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          } [&::-webkit-scrollbar]:hidden`}
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex gap-3 min-w-max p-1 md:p-2 kanban-drag-area h-full">
            {KANBAN_STAGES.map((stage) => (
              <div key={stage} className="w-[280px] md:w-[320px] flex-shrink-0">
                <Card className={`h-full flex flex-col ${STAGE_COLORS[stage]}`}>
                  <CardHeader className="p-2 border-b-2 border-border/80">
                    <CardTitle className="text-sm font-semibold flex items-center justify-between">
                      <span className={STAGE_HEADER_COLORS[stage]}>{stage}</span>
                      <Badge variant="secondary" className="text-xs h-5">
                        {contactsByStage[stage].length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 flex-1 overflow-y-auto">
                    <Droppable droppableId={stage}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[200px] transition-colors duration-200 rounded-lg ${
                            snapshot.isDraggingOver ? 'bg-black/5 dark:bg-white/5' : ''
                          }`}
                        >
                          {contactsByStage[stage].map((contact, index) => (
                            <ClientCard key={contact.id} contact={contact} index={index} isCompact={isCompact} />
                          ))}
                          {provided.placeholder}
                          {contactsByStage[stage].length === 0 && !snapshot.isDraggingOver && (
                            <div className="text-center text-gray-400 text-sm py-8">
                              Arraste um cliente para cá
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </TooltipProvider>
  );
};

export default KanbanView;
