
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClientStats } from './useClientStats';
import { useConversations } from './useConversations';

export function useDashboardRealtime() {
  const { fetchConversations } = useConversations();
  const { refetchStats } = useClientStats();

  useEffect(() => {
    console.log('Setting up dashboard-wide realtime updates');
    
    // Subscribe to changes in the clients table
    const clientsSubscription = supabase
      .channel('dashboard_clients_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'dados_cliente' 
        }, 
        async (payload) => {
          console.log('Client data changed:', payload);
          await refetchStats();
          await fetchConversations();
        }
      )
      .subscribe();

    // Subscribe to changes in chat histories
    const chatSubscription = supabase
      .channel('dashboard_chat_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'n8n_chat_histories' 
        }, 
        async (payload) => {
          console.log('Chat history changed:', payload);
          await fetchConversations();
        }
      )
      .subscribe();

    // Subscribe to changes in appointments/schedule
    const scheduleSubscription = supabase
      .channel('dashboard_schedule_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agendamentos' 
        }, 
        async () => {
          console.log('Schedule data changed');
          await refetchStats();
        }
      )
      .subscribe();
      
    // Subscribe to changes in services
    const servicesSubscription = supabase
      .channel('dashboard_services_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'servicos' 
        }, 
        async () => {
          console.log('Services data changed');
          await refetchStats();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard realtime subscriptions');
      clientsSubscription.unsubscribe();
      chatSubscription.unsubscribe();
      scheduleSubscription.unsubscribe();
      servicesSubscription.unsubscribe();
    };
  }, [refetchStats, fetchConversations]);
}
