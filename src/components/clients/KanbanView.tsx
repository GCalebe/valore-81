
import React, { useRef, useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import KanbanStageColumn from './KanbanStageColumn';
import { Contact } from '@/types/client';

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

const KanbanView = ({ contacts, onContactClick, onStageChange, searchTerm, onEditClick, isCompact }: KanbanViewProps) => {
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const newStage = destination.droppableId as Contact['kanbanStage'];
    onStageChange(draggableId, newStage);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    if (
      e.target === scrollContainerRef.current ||
      (e.target as Element).closest('.kanban-drag-area')
    ) {
      setIsDragging(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
      e.preventDefault();
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !scrollContainerRef.current) return;

      e.preventDefault();
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
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
            <KanbanStageColumn
              key={stage}
              stage={stage}
              contacts={contactsByStage[stage]}
              onContactClick={onContactClick}
              onEditClick={onEditClick}
              isCompact={isCompact}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanView;
