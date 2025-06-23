import { supabase } from '@/integrations/supabase/client';
import { N8nChatHistory } from '@/types/chat';

export async function fetchChatHistory(conversationId: string) {
  console.log('Busca de histórico de chat desativada, usando dados mockup');
  // Retorna um array vazio para forçar o uso de dados mockup
  return [] as N8nChatHistory[];
}

export function subscribeToChat(
  conversationId: string,
  onInsert: (chatHistory: N8nChatHistory) => void
) {
  console.log('Assinatura de chat desativada, usando dados mockup');
  // Retorna um objeto com método unsubscribe para manter a compatibilidade
  return {
    unsubscribe: () => {
      console.log('Nenhuma assinatura real para cancelar');
    }
  };
}
