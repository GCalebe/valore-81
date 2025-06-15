
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CustomFieldWithValue } from '@/types/customFields';
import { AlertCircle } from 'lucide-react';

interface CustomFieldRendererProps {
  field: CustomFieldWithValue;
  value: any;
  onChange: (value: any) => void;
  validationError?: string;
}

const CustomFieldRenderer = ({ field, value, onChange, validationError }: CustomFieldRendererProps) => {
  const renderField = () => {
    switch (field.field_type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Digite ${field.field_name.toLowerCase()}`}
            className={validationError ? 'border-red-500 focus:border-red-500' : ''}
          />
        );

      case 'single_select':
        return (
          <Select value={value || 'none'} onValueChange={(val) => onChange(val === 'none' ? null : val)}>
            <SelectTrigger className={validationError ? 'border-red-500 focus:border-red-500' : ''}>
              <SelectValue placeholder={`Selecione ${field.field_name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {field.field_options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi_select':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className={`space-y-2 ${validationError ? 'p-2 border border-red-500 rounded' : ''}`}>
            {field.field_options?.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selectedValues, option]);
                    } else {
                      onChange(selectedValues.filter((v: string) => v !== option));
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
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        {field.field_name}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
        {validationError && <AlertCircle className="h-4 w-4 text-red-500" />}
      </Label>
      {renderField()}
      {validationError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {validationError}
        </p>
      )}
    </div>
  );
};

export default CustomFieldRenderer;
