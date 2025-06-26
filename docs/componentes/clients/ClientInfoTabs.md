# ClientInfoTabs

O componente `ClientInfoTabs` é um componente padronizado para exibir informações do cliente organizadas em abas, substituindo as implementações inconsistentes anteriores.

## Objetivo

O objetivo deste componente é padronizar a exibição de informações do cliente em abas, eliminando inconsistências entre diferentes implementações e facilitando a manutenção e extensão do código.

## Props

| Prop                | Tipo                                           | Obrigatório | Padrão | Descrição                                    |
| ------------------- | ---------------------------------------------- | ----------- | ------ | -------------------------------------------- |
| contact             | Contact                                        | Sim         | -      | Dados do contato do cliente                  |
| customFields        | CustomField[]                                  | Não         | []     | Lista de campos personalizados do cliente    |
| documents           | Document[]                                     | Não         | []     | Lista de documentos do cliente               |
| notes               | Note[]                                         | Não         | []     | Lista de anotações sobre o cliente           |
| onAddNote           | (note: string) => Promise<void>                | Não         | -      | Função para adicionar uma nova anotação      |
| onDeleteNote        | (noteId: string) => Promise<void>              | Não         | -      | Função para excluir uma anotação             |
| onUploadDocument    | (file: File) => Promise<void>                  | Não         | -      | Função para fazer upload de um documento     |
| onDeleteDocument    | (documentId: string) => Promise<void>          | Não         | -      | Função para excluir um documento             |
| onUpdateCustomField | (fieldId: string, value: any) => Promise<void> | Não         | -      | Função para atualizar um campo personalizado |
| className           | string                                         | Não         | ''     | Classes CSS adicionais para o componente     |

## Interfaces

```typescript
interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  segment?: string;
  lastContact?: Date;
  // Outros campos do contato
}

interface CustomField {
  id: string;
  label: string;
  type: "text" | "email" | "phone" | "select" | "boolean" | "date";
  options?: { value: string; label: string }[];
  value?: any;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: string;
}
```

## Exemplos de Uso

### Uso Básico

```tsx
<ClientInfoTabs contact={contact} />
```

### Com Campos Personalizados e Documentos

```tsx
<ClientInfoTabs
  contact={contact}
  customFields={customFields}
  documents={documents}
  onUploadDocument={handleUploadDocument}
  onDeleteDocument={handleDeleteDocument}
  onUpdateCustomField={handleUpdateCustomField}
/>
```

### Com Todas as Funcionalidades

```tsx
<ClientInfoTabs
  contact={contact}
  customFields={customFields}
  documents={documents}
  notes={notes}
  onAddNote={handleAddNote}
  onDeleteNote={handleDeleteNote}
  onUploadDocument={handleUploadDocument}
  onDeleteDocument={handleDeleteDocument}
  onUpdateCustomField={handleUpdateCustomField}
/>
```

## Estrutura Interna

O componente `ClientInfoTabs` é estruturado da seguinte forma:

```tsx
const ClientInfoTabs: React.FC<ClientInfoTabsProps> = ({
  contact,
  customFields = [],
  documents = [],
  notes = [],
  onAddNote,
  onDeleteNote,
  onUploadDocument,
  onDeleteDocument,
  onUpdateCustomField,
  className = "",
}) => {
  return (
    <Tabs defaultValue="info" className={className}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="info">Informações</TabsTrigger>
        <TabsTrigger value="custom">Campos Personalizados</TabsTrigger>
        <TabsTrigger value="documents">Documentos</TabsTrigger>
        <TabsTrigger value="notes">Anotações</TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        {/* Informações básicas do cliente */}
      </TabsContent>

      <TabsContent value="custom">
        {/* Campos personalizados do cliente */}
      </TabsContent>

      <TabsContent value="documents">{/* Documentos do cliente */}</TabsContent>

      <TabsContent value="notes">{/* Anotações sobre o cliente */}</TabsContent>
    </Tabs>
  );
};
```

## Abas Disponíveis

### Aba de Informações

Exibe as informações básicas do cliente, como nome, e-mail, telefone, status e segmento.

### Aba de Campos Personalizados

Exibe e permite a edição dos campos personalizados do cliente, adaptando-se dinamicamente aos tipos de campo definidos.

### Aba de Documentos

Exibe a lista de documentos do cliente, permitindo o upload de novos documentos e a exclusão de documentos existentes.

### Aba de Anotações

Exibe a lista de anotações sobre o cliente, permitindo a adição de novas anotações e a exclusão de anotações existentes.

## Componentes Internos

### ClientInfoBasic

Componente que exibe as informações básicas do cliente na primeira aba.

### ClientCustomFields

Componente que exibe e permite a edição dos campos personalizados do cliente.

### ClientDocuments

Componente que exibe a lista de documentos do cliente e permite o upload e exclusão de documentos.

### ClientNotes

Componente que exibe a lista de anotações sobre o cliente e permite a adição e exclusão de anotações.

## Dependências

- Componentes UI: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- Tipos: `Contact`, `CustomField`, `Document`, `Note`
- Componentes internos: `ClientInfoBasic`, `ClientCustomFields`, `ClientDocuments`, `ClientNotes`

## Notas de Implementação

1. O componente utiliza o componente `Tabs` da biblioteca de UI para organizar as informações em abas
2. Cada aba é implementada como um componente separado para facilitar a manutenção
3. O componente é responsivo e se adapta a diferentes tamanhos de tela
4. As funções de callback são opcionais, permitindo o uso do componente em modo somente leitura
5. Os campos personalizados são renderizados dinamicamente com base no tipo de campo

## Benefícios da Padronização

1. **Consistência**: Garante uma experiência consistente em todas as partes da aplicação que exibem informações do cliente
2. **Manutenibilidade**: Facilita a manutenção e evolução do componente
3. **Extensibilidade**: Permite adicionar novas abas ou funcionalidades de forma centralizada
4. **Reutilização**: Permite reutilizar o componente em diferentes partes da aplicação
5. **Documentação**: Facilita o entendimento do componente por novos desenvolvedores
