# Padronização de Formulários

Este guia descreve as práticas e padrões para a criação e manutenção de formulários no projeto Valore-81.

## Visão Geral

Formulários são componentes essenciais da aplicação, utilizados para entrada de dados em diversas funcionalidades. A padronização de formulários garante:

1. **Consistência visual** - Todos os formulários seguem o mesmo padrão visual
2. **Experiência do usuário** - Comportamento previsível e intuitivo
3. **Validação consistente** - Regras de validação aplicadas de forma uniforme
4. **Manutenibilidade** - Facilidade de manutenção e atualização
5. **Acessibilidade** - Formulários acessíveis para todos os usuários

## Biblioteca de Formulários

O projeto utiliza o React Hook Form em conjunto com Zod para gerenciamento e validação de formulários:

- **React Hook Form** - Biblioteca para gerenciamento de formulários
- **Zod** - Biblioteca para validação de esquemas
- **@hookform/resolvers/zod** - Integração entre React Hook Form e Zod

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
```

## Estrutura de Formulários Padronizados

Todos os formulários padronizados seguem a seguinte estrutura:

1. **Definição do Esquema** - Esquema Zod para validação
2. **Definição do Tipo** - Tipo TypeScript inferido do esquema
3. **Componente de Formulário** - Componente React que utiliza o esquema

### Exemplo de Estrutura

```typescript
// 1. Definição do Esquema
const clientFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  tipo: z.enum(['PF', 'PJ']),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  // ... outros campos
});

// 2. Definição do Tipo
type ClientFormValues = z.infer<typeof clientFormSchema>;

// 3. Componente de Formulário
const ClientForm: React.FC<ClientFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting,
}) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      telefone: '',
      tipo: 'PF',
      // ... valores padrão para outros campos
    },
  });

  // ... lógica do formulário

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ... campos do formulário */}
      </form>
    </Form>
  );
};
```

## Componentes de Formulário Padronizados

O projeto utiliza componentes padronizados para os elementos de formulário:

### Form

Componente wrapper para formulários:

```typescript
// src/components/ui/form.tsx
import * as React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from './label';

const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement> & {
    children: React.ReactNode;
  }
>(({ children, className, ...props }, ref) => {
  return (
    <form ref={ref} className={className} {...props}>
      {children}
    </form>
  );
});
Form.displayName = 'Form';

const FormField = <
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends string = string
>({
  name,
  control,
  render,
}: {
  name: TName;
  control?: Control<TFieldValues>;
  render: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactNode;
}) => {
  const formContext = useFormContext<TFieldValues>();
  const controlToUse = control || formContext.control;

  return (
    <Controller
      name={name}
      control={controlToUse}
      render={({ field }) => render({ field })}
    />
  );
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="space-y-2 mb-4"
      {...props}
    />
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      ref={ref}
      className="text-sm font-medium"
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  return <div ref={ref} {...props} />;
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className="text-sm text-muted-foreground"
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className="text-sm font-medium text-destructive mt-1"
      {...props}
    >
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
```

### Input

Componente para entrada de texto:

```typescript
// src/components/ui/input.tsx
import * as React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
```

### Select

Componente para seleção de opções:

```typescript
// src/components/ui/select.tsx
import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80"
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
```

## Exemplo de Formulário Padronizado

Abaixo está um exemplo completo de um formulário padronizado para edição de cliente:

```typescript
// src/components/clients/EditClientFormStandardized.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Esquema de validação
const clientFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  tipo: z.enum(['PF', 'PJ']),
  cpf: z.string().optional().nullable(),
  cnpj: z.string().optional().nullable(),
  endereco: z.object({
    rua: z.string().min(2, 'Rua deve ter pelo menos 2 caracteres'),
    numero: z.string().min(1, 'Número é obrigatório'),
    complemento: z.string().optional().nullable(),
    bairro: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    cidade: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    estado: z.string().length(2, 'Estado deve ter 2 caracteres'),
    cep: z.string().min(8, 'CEP inválido'),
  }),
  observacoes: z.string().optional().nullable(),
});

// Tipo inferido do esquema
type ClientFormValues = z.infer<typeof clientFormSchema>;

// Props do componente
interface EditClientFormProps {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (data: ClientFormValues) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

// Componente de formulário
const EditClientFormStandardized: React.FC<EditClientFormProps> = ({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  onCancel,
}) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: defaultValues || {
      nome: '',
      email: '',
      telefone: '',
      tipo: 'PF',
      cpf: '',
      cnpj: '',
      endereco: {
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
      },
      observacoes: '',
    },
  });

  // Observar mudanças no tipo de cliente para validação condicional
  const tipoCliente = form.watch('tipo');

  // Validação condicional baseada no tipo de cliente
  React.useEffect(() => {
    if (tipoCliente === 'PF') {
      form.setValue('cnpj', null);
    } else {
      form.setValue('cpf', null);
    }
  }, [tipoCliente, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do cliente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tipo */}
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PF">Pessoa Física</SelectItem>
                    <SelectItem value="PJ">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CPF (apenas para PF) */}
          {tipoCliente === 'PF' && (
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="000.000.000-00" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* CNPJ (apenas para PJ) */}
          {tipoCliente === 'PJ' && (
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input placeholder="00.000.000/0000-00" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rua */}
            <FormField
              control={form.control}
              name="endereco.rua"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Número */}
            <FormField
              control={form.control}
              name="endereco.numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input placeholder="Número" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Complemento */}
            <FormField
              control={form.control}
              name="endereco.complemento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input placeholder="Complemento" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bairro */}
            <FormField
              control={form.control}
              name="endereco.bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input placeholder="Bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cidade */}
            <FormField
              control={form.control}
              name="endereco.cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Cidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Estado */}
            <FormField
              control={form.control}
              name="endereco.estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input placeholder="UF" maxLength={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CEP */}
            <FormField
              control={form.control}
              name="endereco.cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Observações */}
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Observações sobre o cliente"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditClientFormStandardized;
```

## Boas Práticas para Formulários

### 1. Validação

- Use Zod para definir esquemas de validação
- Aplique validação em tempo real com `mode: 'onChange'`
- Forneça mensagens de erro claras e específicas
- Implemente validação condicional quando necessário

### 2. Acessibilidade

- Use elementos semânticos (`<label>`, `<fieldset>`, etc.)
- Associe labels com campos de formulário
- Forneça feedback de erro acessível
- Garanta navegação por teclado
- Implemente ARIA attributes quando necessário

### 3. UX (Experiência do Usuário)

- Agrupe campos relacionados
- Use layout responsivo (grid, flex)
- Forneça feedback visual para estados (erro, sucesso, carregando)
- Implemente validação em tempo real
- Desabilite o botão de envio durante o envio

### 4. Performance

- Use `defaultValues` para inicializar formulários
- Implemente `shouldUnregister: false` para manter valores de campos removidos
- Use `reset()` para redefinir formulários
- Evite re-renderizações desnecessárias

## Processo de Padronização de Formulários

### 1. Identificação

Identifique formulários que precisam ser padronizados:

- Formulários com código duplicado
- Formulários com validação inconsistente
- Formulários com problemas de UX ou acessibilidade

### 2. Criação

Crie o formulário padronizado seguindo estas etapas:

1. Defina o esquema de validação com Zod
2. Crie o tipo TypeScript a partir do esquema
3. Implemente o componente de formulário usando React Hook Form
4. Aplique os componentes de UI padronizados
5. Adicione validação condicional se necessário

### 3. Migração

Migre os formulários existentes para a versão padronizada:

1. Crie um adaptador se necessário para compatibilidade
2. Atualize as importações nos componentes que usam o formulário
3. Teste a funcionalidade para garantir que tudo funciona como esperado
4. Remova o formulário antigo após a migração bem-sucedida

## Exemplos de Antes e Depois

### Antes da Padronização

```typescript
// Antes: EditClientDialog.tsx
const EditClientDialog = ({ client, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: client?.nome || '',
    email: client?.email || '',
    // ... outros campos
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    // ... outras validações
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Editar Cliente</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={errors.nome ? 'border-red-500' : ''}
            />
            {errors.nome && <p className="text-red-500">{errors.nome}</p>}
          </div>
          {/* ... outros campos */}
          <div className="flex justify-end">
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
```

### Depois da Padronização

```typescript
// Depois: EditClientDialog.tsx usando EditClientFormStandardized
import EditClientFormStandardized from './EditClientFormStandardized';

const EditClientDialog = ({ client, isOpen, onClose, onSave, isSubmitting }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Editar Cliente</DialogTitle>
      <DialogContent>
        <EditClientFormStandardized
          defaultValues={client}
          onSubmit={onSave}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
```

## Conclusão

A padronização de formulários no projeto Valore-81 melhora a consistência, manutenibilidade e experiência do usuário. Seguindo as diretrizes deste documento, você pode criar formulários que são fáceis de usar, acessíveis e consistentes com o restante da aplicação.

Lembre-se de atualizar este guia sempre que houver alterações significativas nos padrões de formulários do projeto.
