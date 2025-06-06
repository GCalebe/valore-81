
import { Contact } from '@/types/client';

const fictitiousMessages = [
  "Olá! Gostaria de saber mais sobre os serviços disponíveis.",
  "Quando posso agendar uma consulta?",
  "Obrigado pelo atendimento, foi muito esclarecedor!",
  "Preciso reagendar minha consulta para a próxima semana.",
  "Qual o valor do serviço que conversamos?",
  "Gostei muito da proposta, vamos fechar negócio!",
  "Poderia me enviar mais detalhes por WhatsApp?",
  "Estou interessado, mas preciso conversar com minha esposa primeiro.",
  "Perfeito! Quando podemos iniciar o processo?",
  "Vocês atendem na região da Barra da Tijuca?",
  "Gostaria de uma segunda opinião sobre o orçamento.",
  "Muito obrigado pela atenção, vou avaliar a proposta.",
  "Posso levar meu barco para avaliação amanhã?",
  "Qual o prazo de entrega para este serviço?",
  "Vocês trabalham com financiamento?",
  "Excelente atendimento! Recomendarei para meus amigos.",
  "Preciso de um orçamento urgente, é possível?",
  "Quando vocês têm disponibilidade para vistoria?",
  "O preço está dentro do que esperava, vamos prosseguir!",
  "Gostaria de agendar para o próximo mês."
];

const timeVariations = [
  "2 min",
  "15 min", 
  "1h",
  "3h",
  "Ontem",
  "2 dias",
  "1 semana",
  "2 semanas",
  "1 mês",
  "Hoje"
];

export const generateFictitiousConversation = (contact: Contact): Partial<Contact> => {
  const randomMessage = fictitiousMessages[Math.floor(Math.random() * fictitiousMessages.length)];
  const randomTime = timeVariations[Math.floor(Math.random() * timeVariations.length)];
  const unreadCount = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0;

  return {
    ...contact,
    lastMessage: randomMessage,
    lastMessageTime: randomTime,
    unreadCount: unreadCount
  };
};

export const generateFictitiousConversations = (contacts: Contact[]): Contact[] => {
  return contacts.map(contact => generateFictitiousConversation(contact) as Contact);
};
