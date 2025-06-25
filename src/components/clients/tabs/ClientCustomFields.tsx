import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomField } from '@/types/customField';

interface ClientCustomFieldsProps {
  /**
   * Lista de campos personalizados do cliente
   */
  customFields: CustomField[];
  
  /**
   * Função para atualizar um campo personalizado
   */
  onUpdateCustomField?: (fieldId: string, value: any) => Promise<void>;
  
  /**
   * Define se os campos devem ser somente leitura
   * @default false
   */
  readOnly?: boolean;
  
  /**
   * Define se o componente deve ser exibido em modo compacto
   * @default false
   */
  compact?: boolean;
}

/**
 * Componente que exibe e permite a edição dos campos personalizados do cliente
 */
export const ClientCustomFields: React.FC<ClientCustomFieldsProps> = ({
  customFields,
  onUpdateCustomField,
  readOnly = false,
  compact = false,
}) => {
  const handleFieldChange = async (fieldId: string, value: any) => {
    if (onUpdateCustomField) {
      await onUpdateCustomField(fieldId, value);
    }
  };

  const renderFieldInput = (field: CustomField) => {
    const currentValue = field.value;

    if (readOnly) {
      return <p>{currentValue?.toString() || 'Não informado'}</p>;
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={currentValue as string || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={`Digite ${field.label.toLowerCase()}`}
          />
        );
      case 'select':
        return (
          <Select
            value={currentValue as string || ''}
            onValueChange={(value) => handleFieldChange(field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum</SelectItem>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`field-${field.id}`}
              checked={Boolean(currentValue)}
              onCheckedChange={(checked) => handleFieldChange(field.id, Boolean(checked))}
            />
            <Label htmlFor={`field-${field.id}`}>{field.label}</Label>
          </div>
        );
      case 'date':
        return (
          <DatePicker
            date={currentValue ? new Date(currentValue as string) : null}
            setDate={(date) => handleFieldChange(field.id, date?.toISOString() || null)}
            placeholder={`Selecione uma data`}
          />
        );
      default:
        return <p>Tipo de campo não suportado</p>;
    }
  };

  if (customFields.length === 0) {
    return (
      <Card className={compact ? 'p-3' : 'p-4'}>
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-lg">Campos Personalizados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Nenhum campo personalizado configurado.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={compact ? 'p-3' : 'p-4'}>
      <CardHeader className="p-0 pb-3">
        <CardTitle className="text-lg">Campos Personalizados</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        {customFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={`field-${field.id}`}>{field.label}</Label>
            {renderFieldInput(field)}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ClientCustomFields;