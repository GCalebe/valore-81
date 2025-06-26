import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Contact } from "@/types/client";
import { formatCurrency } from "@/utils/formatters";

interface PrincipalTabProps {
  editContactData: Partial<Contact>;
  setEditContactData: (contact: Partial<Contact>) => void;
}

const PrincipalTab: React.FC<PrincipalTabProps> = ({
  editContactData,
  setEditContactData,
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Coluna 1 */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="responsible-user">Usuário responsável</Label>
          <Input
            id="responsible-user"
            value={editContactData.responsibleUser || ""}
            onChange={(e) =>
              setEditContactData({
                ...editContactData,
                responsibleUser: e.target.value,
              })
            }
            placeholder="Gabriel Calebe"
          />
        </div>

        <div>
          <Label htmlFor="sales">Venda</Label>
          <Input
            id="sales"
            type="number"
            value={editContactData.sales || ""}
            onChange={(e) =>
              setEditContactData({
                ...editContactData,
                sales: parseFloat(e.target.value),
              })
            }
            placeholder="R$ 0"
          />
        </div>

        <div>
          <Label htmlFor="client-type">Tipo de cliente</Label>
          <Select
            value={editContactData.clientType || ""}
            onValueChange={(value) =>
              setEditContactData({ ...editContactData, clientType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pessoa-fisica">Pessoa Física</SelectItem>
              <SelectItem value="pessoa-juridica">Pessoa Jurídica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="client-sector">Setor do cliente</Label>
          <Select
            value={editContactData.clientSector || ""}
            onValueChange={(value) =>
              setEditContactData({ ...editContactData, clientSector: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="comercio">Comércio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="budget">Orçamento</Label>
          <Input
            id="budget"
            type="number"
            value={editContactData.budget || ""}
            onChange={(e) =>
              setEditContactData({
                ...editContactData,
                budget: parseFloat(e.target.value),
              })
            }
            placeholder="R$ 0,00"
          />
          {editContactData.budget && (
            <div className="text-sm text-gray-500 mt-1">
              {formatCurrency(editContactData.budget)}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="payment-method">Método de pagamento</Label>
          <Select
            value={editContactData.paymentMethod || ""}
            onValueChange={(value) =>
              setEditContactData({ ...editContactData, paymentMethod: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cartao">Cartão</SelectItem>
              <SelectItem value="pix">PIX</SelectItem>
              <SelectItem value="boleto">Boleto</SelectItem>
              <SelectItem value="transferencia">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Coluna 2 */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="client-objective">Objetivo do cliente</Label>
          <Input
            id="client-objective"
            value={editContactData.clientObjective || ""}
            onChange={(e) =>
              setEditContactData({
                ...editContactData,
                clientObjective: e.target.value,
              })
            }
            placeholder="..."
          />
        </div>

        <div>
          <Label htmlFor="loss-reason">Motivo de perda</Label>
          <Select
            value={editContactData.lossReason || ""}
            onValueChange={(value) =>
              setEditContactData({ ...editContactData, lossReason: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="preco">Preço</SelectItem>
              <SelectItem value="timing">Timing</SelectItem>
              <SelectItem value="concorrencia">Concorrência</SelectItem>
              <SelectItem value="orcamento">Orçamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contract-number">Número de contrato</Label>
          <Input
            id="contract-number"
            value={editContactData.contractNumber || ""}
            onChange={(e) =>
              setEditContactData({
                ...editContactData,
                contractNumber: e.target.value,
              })
            }
            placeholder="..."
          />
        </div>

        <div>
          <Label htmlFor="contract-date">Data de contrato</Label>
          <Input
            id="contract-date"
            type="date"
            value={editContactData.contractDate || ""}
            onChange={(e) =>
              setEditContactData({
                ...editContactData,
                contractDate: e.target.value,
              })
            }
          />
        </div>

        <div>
          <Label htmlFor="payment">Pagamento</Label>
          <Select
            value={editContactData.payment || ""}
            onValueChange={(value) =>
              setEditContactData({ ...editContactData, payment: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="file-upload">Arquivo</Label>
          <Button variant="outline" className="w-full justify-start">
            <Upload className="h-4 w-4 mr-2" />
            Fazer upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrincipalTab;
