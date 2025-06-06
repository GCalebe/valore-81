
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

      // Test each table individually with explicit table names
      try {
        const { data, error } = await supabase
          .from('dados_cliente')
          .select('*')
          .limit(1);
        
        if (!error) {
          tableStatus.dados_cliente = true;
          console.log('✅ Table dados_cliente is accessible');
        } else {
          errors.push(`Table dados_cliente: ${error.message}`);
          console.error('❌ Table dados_cliente error:', error);
        }
      } catch (err) {
        errors.push(`Table dados_cliente: ${String(err)}`);
        console.error('❌ Table dados_cliente exception:', err);
      }

      try {
        const { data, error } = await supabase
          .from('n8n_chat_histories')
          .select('*')
          .limit(1);
        
        if (!error) {
          tableStatus.n8n_chat_histories = true;
          console.log('✅ Table n8n_chat_histories is accessible');
        } else {
          errors.push(`Table n8n_chat_histories: ${error.message}`);
          console.error('❌ Table n8n_chat_histories error:', error);
        }
      } catch (err) {
        errors.push(`Table n8n_chat_histories: ${String(err)}`);
        console.error('❌ Table n8n_chat_histories exception:', err);
      }

      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select('*')
          .limit(1);
        
        if (!error) {
          tableStatus.agendamentos = true;
          console.log('✅ Table agendamentos is accessible');
        } else {
          errors.push(`Table agendamentos: ${error.message}`);
          console.error('❌ Table agendamentos error:', error);
        }
      } catch (err) {
        errors.push(`Table agendamentos: ${String(err)}`);
        console.error('❌ Table agendamentos exception:', err);
      }

      try {
        const { data, error } = await supabase
          .from('servicos')
          .select('*')
          .limit(1);
        
        if (!error) {
          tableStatus.servicos = true;
          console.log('✅ Table servicos is accessible');
        } else {
          errors.push(`Table servicos: ${error.message}`);
          console.error('❌ Table servicos error:', error);
        }
      } catch (err) {
        errors.push(`Table servicos: ${String(err)}`);
        console.error('❌ Table servicos exception:', err);
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
