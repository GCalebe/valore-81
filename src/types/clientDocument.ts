/**
 * Interface que representa um documento do cliente
 */
export interface ClientDocument {
  /**
   * Identificador único do documento
   */
  id: string;

  /**
   * Identificador do cliente ao qual o documento pertence
   */
  clientId: string;

  /**
   * Nome do arquivo
   */
  fileName: string;

  /**
   * Descrição do documento
   */
  description?: string;

  /**
   * Tipo do arquivo (MIME type)
   */
  fileType: string;

  /**
   * Tamanho do arquivo em bytes
   */
  fileSize: number;

  /**
   * URL para acessar o documento
   */
  fileUrl?: string;

  /**
   * Data de criação do documento
   */
  createdAt: string;

  /**
   * Usuário que criou o documento
   */
  createdBy?: string;
}
