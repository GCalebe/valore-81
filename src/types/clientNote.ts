/**
 * Interface que representa uma anotação do cliente
 */
export interface ClientNote {
  /**
   * Identificador único da anotação
   */
  id: string;
  
  /**
   * Identificador do cliente ao qual a anotação pertence
   */
  clientId: string;
  
  /**
   * Conteúdo da anotação
   */
  content: string;
  
  /**
   * Data de criação da anotação
   */
  createdAt: string;
  
  /**
   * Data da última atualização da anotação
   */
  updatedAt?: string;
  
  /**
   * Informações do autor da anotação
   */
  author: {
    /**
     * Identificador único do autor
     */
    id: string;
    
    /**
     * Nome do autor
     */
    name: string;
    
    /**
     * URL da imagem de avatar do autor
     */
    avatar?: string;
  };
}