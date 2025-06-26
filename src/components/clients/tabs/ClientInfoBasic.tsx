import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contact } from "@/types/contact";

interface ClientInfoBasicProps {
  /**
   * Dados do contato do cliente
   */
  contact: Contact;

  /**
   * Define se o componente deve ser exibido em modo compacto
   * @default false
   */
  compact?: boolean;
}

/**
 * Componente que exibe as informações básicas do cliente
 */
export const ClientInfoBasic: React.FC<ClientInfoBasicProps> = ({
  contact,
  compact = false,
}) => {
  const renderField = (
    label: string,
    value: any,
    type: "text" | "badge" | "money" = "text",
  ) => {
    if (!value && value !== 0) {
      value = "Não informado";
    }

    return (
      <div className={`${compact ? "mb-2" : "mb-4"}`}>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </h3>
        {type === "badge" ? (
          <Badge variant="outline">{value}</Badge>
        ) : type === "money" ? (
          <p>{typeof value === "number" ? `R$ ${value.toFixed(2)}` : value}</p>
        ) : (
          <p>{value}</p>
        )}
      </div>
    );
  };

  return (
    <Card className={compact ? "p-3" : "p-4"}>
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg">Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-2">
        {renderField("Nome", contact?.name)}
        {renderField("Email", contact?.email)}
        {renderField("Telefone", contact?.phone)}
        {renderField("Nome do Cliente", contact?.clientName)}
        {renderField("Tipo de Cliente", contact?.clientType)}
        {renderField("Tamanho do Cliente", contact?.clientSize)}
        {renderField("CPF/CNPJ", contact?.cpfCnpj)}
        {renderField("Endereço", contact?.address)}
        {renderField("Status", contact?.status, "badge")}
        {renderField("Segmento", contact?.segment)}
      </CardContent>
    </Card>
  );
};

export default ClientInfoBasic;
