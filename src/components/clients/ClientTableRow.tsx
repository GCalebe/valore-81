import React, { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Contact } from "@/types/client";
import { MessageSquare, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ClientInfo from "./ClientInfo";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ClientTableRowProps {
  contact: Contact;
  onViewDetails: (contact: Contact) => void;
  onSendMessage: (contactId: string) => void;
  onEditClient: (contact: Contact) => void;
  columns: string[];
}

/**
 * Componente que representa uma linha da tabela de clientes
 */
const ClientTableRow: React.FC<ClientTableRowProps> = ({
  contact,
  onViewDetails,
  onSendMessage,
  onEditClient,
  columns,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const renderTags = () => {
    if (!contact.tags || contact.tags.length === 0) return "Sem tags";

    const visibleTags = contact.tags.slice(0, 3);
    const remainingCount = contact.tags.length - 3;

    return (
      <div className="flex flex-wrap gap-1">
        {visibleTags.map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline" className="text-xs bg-gray-100">
            +{remainingCount}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <>
      <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
        {/* Nome do Cliente (sempre visível) */}
        <TableCell className="font-medium">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <div>
              <div className="font-medium">{contact.name}</div>
              <div className="text-xs text-gray-500">{contact.phone}</div>
            </div>
          </div>
        </TableCell>

        {/* Colunas configuráveis */}
        {columns.includes("email") && (
          <TableCell>{contact.email || "Não informado"}</TableCell>
        )}

        {columns.includes("clientName") && (
          <TableCell>{contact.clientName || "Não informado"}</TableCell>
        )}

        {columns.includes("status") && (
          <TableCell>
            <Badge
              variant={contact.status === "Active" ? "default" : "secondary"}
            >
              {contact.status || "Inativo"}
            </Badge>
          </TableCell>
        )}

        {columns.includes("kanbanStage") && (
          <TableCell>
            <Badge variant="outline">
              {contact.kanbanStage || "Não definida"}
            </Badge>
          </TableCell>
        )}

        {columns.includes("lastMessage") && (
          <TableCell>
            {contact.lastMessage ? (
              <div className="text-sm">
                <p className="truncate max-w-[200px]">{contact.lastMessage}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(contact.lastMessageTime)}
                  {contact.unreadCount ? (
                    <Badge className="ml-2 bg-blue-500">
                      {contact.unreadCount}
                    </Badge>
                  ) : null}
                </p>
              </div>
            ) : (
              "Sem mensagens"
            )}
          </TableCell>
        )}

        {columns.includes("tags") && <TableCell>{renderTags()}</TableCell>}

        {columns.includes("consultationStage") && (
          <TableCell>
            <Badge variant="outline">
              {contact.consultationStage || "Nova consulta"}
            </Badge>
          </TableCell>
        )}

        {columns.includes("budget") && (
          <TableCell>
            {contact.budget ? `R$ ${contact.budget}` : "Não informado"}
          </TableCell>
        )}

        {columns.includes("clientObjective") && (
          <TableCell>{contact.clientObjective || "Não informado"}</TableCell>
        )}

        {columns.includes("responsibleUser") && (
          <TableCell>{contact.responsibleUser || "Não atribuído"}</TableCell>
        )}

        {/* Ações (sempre visível) */}
        <TableCell>
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSendMessage(contact.id)}
              title="Abrir conversa no WhatsApp"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails(contact)}>
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditClient(contact)}>
                  Editar cliente
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {/* Linha expandida com informações detalhadas */}
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={columns.length + 2} className="p-0">
            <div className="p-4 bg-gray-50 dark:bg-gray-800">
              <ClientInfo clientData={contact} context="table" compact={true} />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ClientTableRow;
