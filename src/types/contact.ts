/**
 * Interface que representa um contato/cliente
 */
export interface Contact {
  /**
   * Identificador único do contato
   */
  id: string;

  /**
   * Nome do contato
   */
  name: string;

  /**
   * Email do contato
   */
  email?: string;

  /**
   * Telefone do contato
   */
  phone?: string;

  /**
   * Nome da empresa/cliente
   */
  clientName?: string;

  /**
   * Tipo de cliente (ex: Pessoa Física, Pessoa Jurídica)
   */
  clientType?: string;

  /**
   * Tamanho do cliente (ex: Pequeno, Médio, Grande)
   */
  clientSize?: string;

  /**
   * CPF ou CNPJ do cliente
   */
  cpfCnpj?: string;

  /**
   * Endereço do cliente
   */
  address?: string;

  /**
   * Status do cliente (ex: Ativo, Inativo, Lead, Prospect)
   */
  status?: string;

  /**
   * Segmento do cliente
   */
  segment?: string;

  /**
   * Data da última interação com o cliente
   */
  lastInteraction?: string;

  /**
   * Indica se o cliente foi convertido
   */
  converted?: boolean;

  /**
   * Data de criação do contato
   */
  createdAt: string;

  /**
   * Data da última atualização do contato
   */
  updatedAt?: string;

  /**
   * Usuário que criou o contato
   */
  createdBy?: string;

  /**
   * Usuário responsável pelo contato
   */
  assignedTo?: string;

  /**
   * Notas ou observações sobre o contato
   */
  notes?: string;

  /**
   * Tags associadas ao contato
   */
  tags?: string[];

  /**
   * Estágio no funil de vendas
   */
  stage?: string;

  /**
   * Valor potencial do cliente
   */
  potentialValue?: number;

  /**
   * Origem do contato (ex: Site, Indicação, Redes Sociais)
   */
  source?: string;

  /**
   * Campos personalizados adicionais
   */
  customFields?: Record<string, any>;
}
