/**
 * Interface que representa um campo personalizado
 */
export interface CustomField {
  /**
   * Identificador único do campo
   */
  id: string;
  
  /**
   * Nome/rótulo do campo
   */
  label: string;
  
  /**
   * Tipo do campo
   */
  type: 'text' | 'email' | 'phone' | 'select' | 'boolean' | 'date' | 'multi_select';
  
  /**
   * Valor atual do campo
   */
  value: string | boolean | string[] | null;
  
  /**
   * Opções disponíveis para campos do tipo select ou multi_select
   */
  options?: Array<{
    /**
     * Valor da opção
     */
    value: string;
    
    /**
     * Rótulo da opção
     */
    label: string;
  }>;
  
  /**
   * Indica se o campo é obrigatório
   */
  required?: boolean;
  
  /**
   * Ordem de exibição do campo
   */
  order?: number;
  
  /**
   * Categoria do campo
   */
  category?: string;
}