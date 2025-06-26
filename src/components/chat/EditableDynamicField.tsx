import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Check, X } from "lucide-react";
import { DynamicCategory } from "@/components/clients/DynamicCategoryManager";

interface EditableDynamicFieldProps {
  field: DynamicCategory;
  onUpdate: (fieldId: string, newValue: any) => void;
  readOnly?: boolean;
}

const EditableDynamicField = ({
  field,
  onUpdate,
  readOnly = false,
}: EditableDynamicFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.value);

  const handleSave = () => {
    onUpdate(field.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(field.value);
    setIsEditing(false);
  };

  const renderFieldValue = () => {
    if (isEditing) {
      switch (field.type) {
        case "text":
          return (
            <Input
              value={editValue || ""}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
              autoFocus
            />
          );

        case "single_select":
          return (
            <Select value={editValue || "none"} onValueChange={setEditValue}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {field.options &&
                  Array.isArray(field.options) &&
                  field.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );

        case "multi_select":
          const selectedValues = Array.isArray(editValue) ? editValue : [];
          return (
            <div className="space-y-2">
              {field.options &&
                Array.isArray(field.options) &&
                field.options.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedValues.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditValue([...selectedValues, option]);
                        } else {
                          setEditValue(
                            selectedValues.filter((v: string) => v !== option),
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
            </div>
          );

        default:
          return <span>Tipo de campo não suportado para edição</span>;
      }
    }

    // Display mode
    switch (field.type) {
      case "text":
        return field.value || "Não informado";

      case "single_select":
        return field.value || "Não selecionado";

      case "multi_select":
        if (Array.isArray(field.value) && field.value.length > 0) {
          return (
            <div className="flex flex-wrap gap-1 mt-1">
              {field.value.map((val: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {val}
                </Badge>
              ))}
            </div>
          );
        }
        return "Nenhum selecionado";

      default:
        return "Tipo de campo desconhecido";
    }
  };

  const getFieldTypeLabel = (type: string) => {
    switch (type) {
      case "text":
        return "Texto";
      case "single_select":
        return "Seleção Única";
      case "multi_select":
        return "Seleção Múltipla";
      default:
        return type;
    }
  };

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h5 className="text-sm font-medium">{field.name}</h5>
          <Badge variant="outline" className="text-xs">
            {getFieldTypeLabel(field.type)}
          </Badge>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
              >
                <Edit className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300">
        {renderFieldValue()}
      </div>
    </Card>
  );
};

export default EditableDynamicField;
