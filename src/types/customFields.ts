
export interface CustomField {
  id: string;
  field_name: string;
  field_type: 'text' | 'single_select' | 'multi_select';
  field_options?: string[] | null;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientCustomValue {
  id: string;
  client_id: string;
  field_id: string;
  field_value: any;
  created_at: string;
  updated_at: string;
}

export interface CustomFieldWithValue extends CustomField {
  value?: any;
}
