
import React, { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const initialStages = [
  'Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'
];

export function KanbanSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stages, setStages] = useState(initialStages);
  const [newStage, setNewStage] = useState('');

  const handleAddStage = () => {
    if (newStage.trim() && !stages.includes(newStage.trim())) {
      setStages([...stages, newStage.trim()]);
      setNewStage('');
    }
  };

  const handleRemoveStage = (stageToRemove: string) => {
    setStages(stages.filter(stage => stage !== stageToRemove));
  };
  
  const handleSave = () => {
    // Em um cenário real, isso chamaria uma API para salvar as etapas.
    console.log("Salvando etapas:", stages);
    setIsDialogOpen(false);
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsDialogOpen(true)}
        className="text-white hover:bg-white/20 focus-visible:ring-white"
      >
        <Settings className="h-4 w-4" />
        <span className="sr-only">Configurações do Kanban</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Personalizar Etapas do Kanban</DialogTitle>
            <DialogDescription>
              Adicione, remova ou reordene as etapas do seu funil de clientes.
            </DialogDescription>
          </Header>
          <div className="py-4 space-y-4">
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {stages.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                  <span>{stage}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveStage(stage)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Input 
                value={newStage}
                onChange={(e) => setNewStage(e.target.value)}
                placeholder="Nome da nova etapa"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStage()}
              />
              <Button onClick={handleAddStage}>Adicionar</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
