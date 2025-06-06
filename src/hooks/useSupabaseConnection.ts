
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionStatus {
  isConnected: boolean;
  tables: {
    dados_cliente: boolean;
    n8n_chat_histories: boolean;
    agendamentos: boolean;
    servicos: boolean;
  };
  auth: boolean;
  realtime: boolean;
  errors: string[];
}

export function useSupabaseConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    tables: {
      dados_cliente: false,
      n8n_chat_histories: false,
      agendamentos: false,
      servicos: false,
    },
    auth: false,
    realtime: false,
    errors: [],
  });
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    setLoading(true);
    const errors: string[] = [];
    const tableStatus = {
      dados_cliente: false,
      n8n_chat_histories: false,
      agendamentos: false,
      servicos: false,
    };

    try {
      console.log('Checking Supabase connection...');

      // Test basic connection and auth
      const { data: authData, error: authError } = await supabase.auth.getSession();
      const authWorking = !authError;
      if (authError) {
        errors.push(`Auth error: ${authError.message}`);
      }

      // Test each table
      const tables = ['dados_cliente', 'n8n_chat_histories', 'agendamentos', 'servicos'];
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          if (!error) {
            tableStatus[table as keyof typeof tableStatus] = true;
            console.log(`✅ Table ${table} is accessible`);
          } else {
            errors.push(`Table ${table}: ${error.message}`);
            console.error(`❌ Table ${table} error:`, error);
          }
        } catch (err) {
          errors.push(`Table ${table}: ${String(err)}`);
          console.error(`❌ Table ${table} exception:`, err);
        }
      }

      // Test realtime connection
      let realtimeWorking = false;
      try {
        const channel = supabase.channel('test-connection');
        await channel.subscribe();
        realtimeWorking = true;
        supabase.removeChannel(channel);
        console.log('✅ Realtime connection is working');
      } catch (err) {
        errors.push(`Realtime: ${String(err)}`);
        console.error('❌ Realtime connection error:', err);
      }

      const isConnected = Object.values(tableStatus).every(status => status) && authWorking;

      setStatus({
        isConnected,
        tables: tableStatus,
        auth: authWorking,
        realtime: realtimeWorking,
        errors,
      });

      console.log('Supabase connection check completed:', {
        isConnected,
        tables: tableStatus,
        auth: authWorking,
        realtime: realtimeWorking,
        errors,
      });

    } catch (error) {
      console.error('❌ General Supabase connection error:', error);
      errors.push(`General error: ${String(error)}`);
      setStatus({
        isConnected: false,
        tables: tableStatus,
        auth: false,
        realtime: false,
        errors,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    status,
    loading,
    checkConnection,
  };
}
