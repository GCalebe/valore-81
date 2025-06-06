
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SimulatedMessage {
  type: 'human' | 'ai';
  content: string;
}

const simulatedMessages: SimulatedMessage[] = [
  { type: 'human', content: 'Olá! Gostaria de saber mais sobre os serviços disponíveis.' },
  { type: 'ai', content: 'Olá! Ficamos felizes em ajudar. Oferecemos diversos serviços especializados. Qual tipo de serviço você está procurando?' },
  { type: 'human', content: 'Estou interessado em agendar uma consulta para avaliação.' },
  { type: 'ai', content: 'Perfeito! Temos horários disponíveis esta semana. Você prefere manhã ou tarde?' },
  { type: 'human', content: 'Prefiro pela manhã, se possível.' },
  { type: 'ai', content: 'Ótimo! Temos disponibilidade na quarta-feira às 9h ou na sexta-feira às 10h. Qual prefere?' },
  { type: 'human', content: 'Quarta-feira às 9h seria perfeito!' },
  { type: 'ai', content: 'Excelente! Agendei sua consulta para quarta-feira às 9h. Você receberá uma confirmação em breve.' },
  { type: 'human', content: 'Obrigado! Qual o valor da consulta?' },
  { type: 'ai', content: 'O valor da consulta de avaliação é R$ 150,00. Você pode pagar no local ou pelo PIX.' },
];

const additionalMessages: SimulatedMessage[] = [
  { type: 'human', content: 'Bom dia! Vocês atendem emergências?' },
  { type: 'ai', content: 'Bom dia! Sim, temos atendimento de emergência 24h. Como posso ajudar?' },
  { type: 'human', content: 'Preciso reagendar minha consulta de amanhã.' },
  { type: 'ai', content: 'Sem problema! Vou verificar nossa agenda. Que dia seria melhor para você?' },
  { type: 'human', content: 'Vocês fazem atendimento domiciliar?' },
  { type: 'ai', content: 'Sim! Oferecemos atendimento domiciliar em casos específicos. Vou verificar a disponibilidade.' },
  { type: 'human', content: 'Qual o prazo de entrega dos resultados?' },
  { type: 'ai', content: 'Os resultados ficam prontos em até 3 dias úteis. Você receberá por WhatsApp.' },
];

export const generateSimulatedConversations = async () => {
  try {
    console.log('Iniciando geração de conversas simuladas...');
    
    // Buscar clientes que têm sessionId
    const { data: clients, error: clientsError } = await supabase
      .from('dados_cliente')
      .select('id, nome, sessionid')
      .not('sessionid', 'is', null);

    if (clientsError) {
      throw clientsError;
    }

    if (!clients || clients.length === 0) {
      toast({
        title: "Nenhum cliente encontrado",
        description: "Não há clientes com sessionId para gerar conversas.",
        variant: "destructive"
      });
      return;
    }

    console.log(`Encontrados ${clients.length} clientes para gerar conversas`);

    let conversationsCreated = 0;

    for (const client of clients) {
      if (!client.sessionid) continue;

      // Verificar se já existem mensagens para este cliente
      const { data: existingMessages } = await supabase
        .from('n8n_chat_histories')
        .select('id')
        .eq('session_id', client.sessionid)
        .limit(1);

      if (existingMessages && existingMessages.length > 0) {
        console.log(`Cliente ${client.nome} já possui mensagens, pulando...`);
        continue;
      }

      // Escolher um conjunto de mensagens aleatoriamente
      const useAdditional = Math.random() > 0.5;
      const messagesToUse = useAdditional ? additionalMessages : simulatedMessages;
      
      // Pegar de 3 a 6 mensagens aleatórias
      const numMessages = Math.floor(Math.random() * 4) + 3;
      const selectedMessages = messagesToUse.slice(0, numMessages);

      // Criar mensagens com intervalos de tempo realistas
      const baseTime = new Date();
      baseTime.setHours(baseTime.getHours() - Math.floor(Math.random() * 48)); // Últimas 48 horas

      for (let i = 0; i < selectedMessages.length; i++) {
        const message = selectedMessages[i];
        const messageTime = new Date(baseTime.getTime() + (i * 5 * 60 * 1000)); // 5 minutos entre mensagens

        const messageData = {
          type: message.type,
          content: message.content
        };

        const { error: insertError } = await supabase
          .from('n8n_chat_histories')
          .insert({
            session_id: client.sessionid,
            message: messageData,
            hora: messageTime.toISOString(),
            data: messageTime.toISOString()
          });

        if (insertError) {
          console.error(`Erro ao inserir mensagem para ${client.nome}:`, insertError);
        }
      }

      conversationsCreated++;
      console.log(`Conversa criada para ${client.nome}`);
    }

    toast({
      title: "Conversas simuladas criadas",
      description: `${conversationsCreated} conversas foram geradas com sucesso.`,
    });

    return conversationsCreated;

  } catch (error) {
    console.error('Erro ao gerar conversas simuladas:', error);
    toast({
      title: "Erro ao gerar conversas",
      description: "Ocorreu um erro ao criar as conversas simuladas.",
      variant: "destructive"
    });
    throw error;
  }
};

export const clearSimulatedConversations = async () => {
  try {
    console.log('Limpando conversas simuladas...');
    
    const { error } = await supabase
      .from('n8n_chat_histories')
      .delete()
      .neq('id', 0); // Deletar todas

    if (error) {
      throw error;
    }

    toast({
      title: "Conversas limpas",
      description: "Todas as conversas simuladas foram removidas.",
    });

  } catch (error) {
    console.error('Erro ao limpar conversas:', error);
    toast({
      title: "Erro ao limpar conversas",
      description: "Ocorreu um erro ao remover as conversas.",
      variant: "destructive"
    });
    throw error;
  }
};
