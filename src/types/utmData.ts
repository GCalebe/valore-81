/**
 * Interface que representa dados de UTM (Urchin Tracking Module) para rastreamento de campanhas
 */
export interface UTMData {
  /**
   * Identificador único do registro UTM
   */
  id: string;

  /**
   * Identificador do contato associado a este registro UTM
   */
  contact_id: string;

  /**
   * Fonte da campanha (ex: google, facebook, instagram)
   */
  utm_source?: string;

  /**
   * Meio da campanha (ex: cpc, email, social)
   */
  utm_medium?: string;

  /**
   * Nome da campanha
   */
  utm_campaign?: string;

  /**
   * Conteúdo específico da campanha
   */
  utm_content?: string;

  /**
   * Termo de busca ou palavra-chave
   */
  utm_term?: string;

  /**
   * Data de criação do registro
   */
  created_at: string;

  /**
   * URL de referência completa
   */
  referrer_url?: string;

  /**
   * Página de destino onde o UTM foi registrado
   */
  landing_page?: string;

  /**
   * Dispositivo utilizado (ex: desktop, mobile, tablet)
   */
  device?: string;

  /**
   * Navegador utilizado
   */
  browser?: string;

  /**
   * Sistema operacional utilizado
   */
  os?: string;

  /**
   * Indica se houve conversão a partir deste UTM
   */
  converted?: boolean;

  /**
   * Data da conversão, se houver
   */
  conversion_date?: string;
}
