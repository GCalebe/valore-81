import { supabase } from '@/integrations/supabase/client';
import { N8nChatHistory } from '@/types/chat';

export async function fetchChatHistory(conversationId: string) {
  const { data, error } = await supabase
    .from('n8n_chat_histories')
    .select('*')
    .eq('session_id', conversationId)
    .order('id', { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []) as N8nChatHistory[];
}

export function subscribeToChat(
  conversationId: string,
  onInsert: (chatHistory: N8nChatHistory) => void
) {
  return supabase
    .channel(`chat_messages_${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'n8n_chat_histories',
        filter: `session_id=eq.${conversationId}`,
      },
      (payload) => onInsert(payload.new as N8nChatHistory)
    )
    .subscribe();
}
