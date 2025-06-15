
import React from 'react';
import { DynamicCategory } from '@/components/clients/DynamicCategoryManager';
import EditableDynamicField from './EditableDynamicField';

interface DynamicFieldsDisplayProps {
  fields: DynamicCategory[];
  title: string;
  onFieldUpdate?: (fieldId: string, newValue: any) => void;
  readOnly?: boolean;
}

const DynamicFieldsDisplay = ({ 
  fields, 
  title, 
  onFieldUpdate, 
  readOnly = true 
}: DynamicFieldsDisplayProps) => {
  if (!fields || fields.length === 0) {
    return null;
  }

  const handleFieldUpdate = (fieldId: string, newValue: any) => {
    if (onFieldUpdate) {
      onFieldUpdate(fieldId, newValue);
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </h4>
      {fields.map((field) => (
        <EditableDynamicField
          key={field.id}
          field={field}
          onUpdate={handleFieldUpdate}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default DynamicFieldsDisplay;
