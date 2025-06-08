
import React, { useRef, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Contact } from '@/types/client';
import { User, Phone, Mail, ShipWheel } from 'lucide-react';

interface KanbanViewProps {
  contacts: Contact[];
  onContactClick: (contact: Contact) => void;
  onStageChange: (contactId: string, newStage: Contact['kanbanStage']) => void;
  searchTerm: string;
}

const KANBAN_STAGES: Contact['kanbanStage'][] = [
  'Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'
];

const STAGE_COLORS = {
  'Entraram': 'bg-gray-100 border-gray-300',
  'Conversaram': 'bg-blue-100 border-blue-300',
  'Agendaram': 'bg-yellow-100 border-yellow-300',
  'Compareceram': 'bg-green-100 border-green-300',
  'Negociaram': 'bg-purple-100 border-purple-300',
  'Postergaram': 'bg-orange-100 border-orange-300',
  'Converteram': 'bg-emerald-100 border-emerald-300'
};

const KanbanView = ({ contacts, onContactClick, onStageChange, searchTerm }: KanbanViewProps) => {
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

  const ClientCard = ({ contact, index }: { contact: Contact; index: number }) => (
    <Draggable draggableId={contact.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card 
            className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
              snapshot.isDragging ? 'shadow-lg rotate-2' : ''
            }`}
            onClick={() => onContactClick(contact)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-sm">{contact.name}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {contact.status}
                </Badge>
              </div>
              
              {contact.phone && (
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{contact.phone}</span>
                </div>
              )}
              
              {contact.email && (
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600 truncate">{contact.email}</span>
                </div>
              )}
              
              {contact.clientName && (
                <div className="flex items-center gap-2 mb-2">
                  <ShipWheel className="h-3 w-3 text-blue-400" />
                  <span className="text-xs text-gray-600">{contact.clientName}</span>
                </div>
              )}
              
              <div className="text-xs text-gray-500">
                Último contato: {contact.lastContact}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div 
        ref={scrollContainerRef}
        className={`overflow-x-auto overflow-y-hidden h-full select-none transition-all duration-200 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex gap-4 min-w-max p-4 kanban-drag-area h-full">
          {KANBAN_STAGES.map((stage) => (
            <div key={stage} className="w-80 flex-shrink-0">
              <Card className={`h-full ${STAGE_COLORS[stage]}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{stage}</span>
                    <Badge variant="secondary" className="text-xs">
                      {contactsByStage[stage].length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] transition-colors duration-200 ${
                          snapshot.isDraggingOver ? 'bg-white/50 rounded-lg' : ''
                        }`}
                      >
                        {contactsByStage[stage].map((contact, index) => (
                          <ClientCard key={contact.id} contact={contact} index={index} />
                        ))}
                        {provided.placeholder}
                        {contactsByStage[stage].length === 0 && (
                          <div className="text-center text-gray-400 text-sm py-8">
                            Nenhum cliente nesta etapa
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
  );
};

export default KanbanView;
