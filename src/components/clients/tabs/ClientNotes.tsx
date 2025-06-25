import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, XIcon } from 'lucide-react';
import { ClientNote } from '@/types/clientNote';

interface ClientNotesProps {
  /**
   * Lista de anotações do cliente
   */
  notes: ClientNote[];
  
  /**
   * Função para adicionar uma nova anotação
   */
  onAddNote?: (content: string) => Promise<void>;
  
  /**
   * Função para editar uma anotação existente
   */
  onEditNote?: (noteId: string, content: string) => Promise<void>;
  
  /**
   * Função para remover uma anotação
   */
  onRemoveNote?: (noteId: string) => Promise<void>;
  
  /**
   * Define se o componente deve ser exibido em modo compacto
   * @default false
   */
  compact?: boolean;
}

/**
 * Componente que exibe e permite o gerenciamento de anotações do cliente
 */
export const ClientNotes: React.FC<ClientNotesProps> = ({
  notes,
  onAddNote,
  onEditNote,
  onRemoveNote,
  compact = false,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;
    
    try {
      setIsSubmitting(true);
      await onAddNote(newNote);
      setNewNote('');
      setIsAddingNote(false);
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (note: ClientNote) => {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
  };

  const handleSaveEdit = async () => {
    if (!editingNoteId || !editingContent.trim() || !onEditNote) return;
    
    try {
      setIsSubmitting(true);
      await onEditNote(editingNoteId, editingContent);
      setEditingNoteId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Erro ao editar anotação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditingContent('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className={compact ? 'p-3' : 'p-4'}>
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Anotações</CardTitle>
        {onAddNote && !isAddingNote && (
          <Button size="sm" variant="outline" onClick={() => setIsAddingNote(true)}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {isAddingNote && (
          <div className="space-y-2 border rounded-md p-3">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Digite sua anotação..."
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsAddingNote(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}

        {notes.length === 0 && !isAddingNote ? (
          <div className="text-center py-6 text-gray-500">
            <p>Nenhuma anotação encontrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border rounded-md p-3">
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={!editingContent.trim() || isSubmitting}
                      >
                        <CheckIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={note.author.avatar} alt={note.author.name} />
                          <AvatarFallback>{getInitials(note.author.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{note.author.name}</p>
                          <p className="text-xs text-gray-500">{formatDate(note.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {onEditNote && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(note)}
                            className="h-7 w-7 p-0"
                            title="Editar"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {onRemoveNote && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemoveNote(note.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                            title="Remover"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientNotes;