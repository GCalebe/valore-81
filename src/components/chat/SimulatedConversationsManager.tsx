
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Trash2, RefreshCw } from 'lucide-react';
import { generateSimulatedConversations, clearSimulatedConversations } from '@/utils/simulatedConversations';

interface SimulatedConversationsManagerProps {
  onConversationsGenerated?: () => void;
}

const SimulatedConversationsManager = ({ onConversationsGenerated }: SimulatedConversationsManagerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleGenerateConversations = async () => {
    setIsGenerating(true);
    try {
      await generateSimulatedConversations();
      onConversationsGenerated?.();
    } catch (error) {
      console.error('Erro ao gerar conversas:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearConversations = async () => {
    setIsClearing(true);
    try {
      await clearSimulatedConversations();
      onConversationsGenerated?.();
    } catch (error) {
      console.error('Erro ao limpar conversas:', error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          Conversas Simuladas
        </CardTitle>
        <CardDescription>
          Gere conversas de teste para validar a associação entre clientes e conversas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleGenerateConversations}
          disabled={isGenerating || isClearing}
          className="w-full"
          variant="default"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Gerando...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              Gerar Conversas
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleClearConversations}
          disabled={isGenerating || isClearing}
          className="w-full"
          variant="outline"
        >
          {isClearing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Limpando...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Conversas
            </>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          * As conversas serão geradas apenas para clientes que possuem sessionId e ainda não têm mensagens.
        </p>
      </CardContent>
    </Card>
  );
};

export default SimulatedConversationsManager;
