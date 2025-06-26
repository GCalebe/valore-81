# FilterComponent

O componente `FilterComponent` é um componente base que encapsula a lógica de filtro para clientes, permitindo sua reutilização em diferentes contextos de UI como painéis laterais (Sheet) e diálogos (Dialog).

## Objetivo

O objetivo deste componente é eliminar a duplicação de código entre `FilterSidePanel.tsx` e `FilterDialog.tsx`, centralizando a lógica de filtro em um único componente que pode ser adaptado para diferentes contextos de UI.

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|------------|
| filters | ClientFilters | Sim | - | Estado atual dos filtros aplicados |
| setFilters | (filters: ClientFilters) => void | Sim | - | Função para atualizar os filtros |
| customFields | CustomField[] | Não | [] | Lista de campos personalizados disponíveis para filtro |
| onApplyFilters | () => void | Sim | - | Função chamada quando os filtros são aplicados |
| onResetFilters | () => void | Sim | - | Função chamada quando os filtros são resetados |
| children | ReactNode | Não | null | Conteúdo adicional a ser renderizado no componente |
| className | string | Não | '' | Classes CSS adicionais para o componente |

## Interface de Filtros

```typescript
interface ClientFilters {
  status: string[];
  segment: string[];
  lastContact: {
    from: Date | null;
    to: Date | null;
  };
  customFields: {
    [key: string]: string | string[] | number | boolean | null;
  };
}
```

## Exemplos de Uso

### Uso Básico

```tsx
<FilterComponent
  filters={filters}
  setFilters={setFilters}
  onApplyFilters={handleApplyFilters}
  onResetFilters={handleResetFilters}
/>
```

### Com Campos Personalizados

```tsx
<FilterComponent
  filters={filters}
  setFilters={setFilters}
  customFields={customFields}
  onApplyFilters={handleApplyFilters}
  onResetFilters={handleResetFilters}
/>
```

### Em um Painel Lateral (Adapter)

```tsx
<FilterSidePanel
  isOpen={isFilterPanelOpen}
  onClose={() => setIsFilterPanelOpen(false)}
  filters={filters}
  setFilters={setFilters}
  customFields={customFields}
  onApplyFilters={handleApplyFilters}
  onResetFilters={handleResetFilters}
/>
```

### Em um Diálogo (Adapter)

```tsx
<FilterDialog
  isOpen={isFilterDialogOpen}
  onClose={() => setIsFilterDialogOpen(false)}
  filters={filters}
  setFilters={setFilters}
  customFields={customFields}
  onApplyFilters={handleApplyFilters}
  onResetFilters={handleResetFilters}
/>
```

## Estrutura Interna

O componente `FilterComponent` é estruturado da seguinte forma:

```tsx
const FilterComponent: React.FC<FilterComponentProps> = ({
  filters,
  setFilters,
  customFields = [],
  onApplyFilters,
  onResetFilters,
  children,
  className = '',
}) => {
  // Lógica de filtro
  const handleStatusChange = (status: string[]) => {
    setFilters({ ...filters, status });
  };

  const handleSegmentChange = (segment: string[]) => {
    setFilters({ ...filters, segment });
  };

  const handleLastContactChange = (lastContact: { from: Date | null; to: Date | null }) => {
    setFilters({ ...filters, lastContact });
  };

  const handleCustomFieldChange = (fieldId: string, value: string | string[] | number | boolean | null) => {
    setFilters({
      ...filters,
      customFields: {
        ...filters.customFields,
        [fieldId]: value,
      },
    });
  };

  return (
    <div className={`filter-component ${className}`}>
      {/* Categorias de Filtro */}
      <FilterCategory title="Status">
        {/* Componentes de filtro de status */}
      </FilterCategory>

      <FilterCategory title="Segmento">
        {/* Componentes de filtro de segmento */}
      </FilterCategory>

      <FilterCategory title="Último Contato">
        {/* Componentes de filtro de último contato */}
      </FilterCategory>

      {customFields.length > 0 && (
        <FilterCategory title="Campos Personalizados">
          {/* Componentes de filtro de campos personalizados */}
        </FilterCategory>
      )}

      {children}

      <div className="filter-actions">
        <Button variant="outline" onClick={onResetFilters}>Resetar</Button>
        <Button onClick={onApplyFilters}>Aplicar Filtros</Button>
      </div>
    </div>
  );
};
```

## Componentes Adaptadores

### FilterSidePanel

Adapter que utiliza o `FilterComponent` em um componente `Sheet` para exibição em um painel lateral.

```tsx
interface FilterSidePanelProps extends FilterComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidePanel: React.FC<FilterSidePanelProps> = ({
  isOpen,
  onClose,
  ...filterProps
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Filtre os clientes por diferentes critérios</SheetDescription>
        </SheetHeader>
        <FilterComponent {...filterProps} />
      </SheetContent>
    </Sheet>
  );
};
```

### FilterDialog

Adapter que utiliza o `FilterComponent` em um componente `Dialog` para exibição em um diálogo modal.

```tsx
interface FilterDialogProps extends FilterComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  ...filterProps
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
          <DialogDescription>Filtre os clientes por diferentes critérios</DialogDescription>
        </DialogHeader>
        <FilterComponent {...filterProps} />
      </DialogContent>
    </Dialog>
  );
};
```

## Dependências

- Componentes UI: `Button`, `Sheet`, `Dialog`, etc.
- Tipos: `ClientFilters`, `CustomField`
- Componente interno: `FilterCategory`

## Notas de Implementação

1. O componente não gerencia o estado de abertura/fechamento dos adaptadores, apenas recebe o valor como prop
2. A lógica de filtro é centralizada no componente base, enquanto os adaptadores cuidam apenas da apresentação
3. O componente suporta campos personalizados dinâmicos, permitindo filtrar por qualquer campo personalizado definido
4. Os adaptadores podem ser facilmente estendidos para outros contextos de UI, como popover, dropdown, etc.
5. O componente é responsivo e se adapta a diferentes tamanhos de tela

## Benefícios da Padronização

1. **Eliminação de Duplicação**: Centraliza a lógica de filtro em um único componente
2. **Manutenibilidade**: Facilita a manutenção e evolução da funcionalidade de filtro
3. **Consistência**: Garante uma experiência de filtro consistente em diferentes contextos
4. **Extensibilidade**: Permite adicionar novos tipos de filtro de forma centralizada
5. **Reutilização**: Permite reutilizar a lógica de filtro em diferentes partes da aplicação

## Atualizações Recentes

### Filtro Avançado com Regras Condicionais

O componente `FilterDialog` foi atualizado para incluir um construtor de filtros avançado que permite criar regras condicionais complexas com grupos AND/OR, similar ao filtro avançado do Kommo CRM.

#### Principais Mudanças

1. **Remoção das Abas**: Substituição das abas por uma interface unificada com filtros rápidos e construtor de filtros avançados.

2. **Customização de Campos**: Suporte para filtrar por diversos campos do cliente, incluindo nome, email, telefone, status, etapa da consulta, origem, cidade, estado, último contato e próximo contato.

3. **Grupos Condicionais AND/OR**: Capacidade de criar grupos de regras com condições AND (todas as regras devem ser verdadeiras) ou OR (qualquer regra pode ser verdadeira).

4. **Grupos Aninhados**: Suporte para criar grupos dentro de grupos, permitindo lógica de filtro complexa.

5. **Salvamento de Filtros**: Capacidade de nomear e salvar filtros personalizados para uso futuro.

6. **Filtros Rápidos**: Manutenção dos filtros rápidos para status, tags e último contato.

7. **Interface Aprimorada**: Layout mais amplo e visualização clara dos filtros aplicados.

#### Novas Interfaces

```typescript
// Tipos de condição para grupos
type ConditionType = 'AND' | 'OR';

// Interface para uma regra de filtro
interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
  fieldName?: string;
}

// Interface para um grupo de filtros
interface FilterGroup {
  id: string;
  condition: ConditionType;
  rules: (FilterRule | FilterGroup)[];
}

// Interface para filtros salvos
interface SavedFilter {
  id: string;
  name: string;
  filter: FilterGroup;
}
```

#### Componentes Internos

1. **FilterRuleComponent**: Componente para uma regra de filtro individual, permitindo selecionar campo, operador e valor.

2. **FilterGroupComponent**: Componente recursivo para um grupo de filtros, permitindo adicionar regras, grupos aninhados e alternar entre condições AND/OR.

3. **SavedFilters**: Componente para gerenciar filtros salvos, permitindo aplicar e excluir filtros.

4. **QuickFilters**: Componente para filtros rápidos de status, tags e último contato.

#### Exemplo de Uso

```tsx
<FilterDialog
  isOpen={isFilterDialogOpen}
  onOpenChange={setIsFilterDialogOpen}
  statusFilter={statusFilter}
  segmentFilter={segmentFilter}
  lastContactFilter={lastContactFilter}
  customFieldFilters={customFieldFilters}
  onStatusFilterChange={handleStatusFilterChange}
  onSegmentFilterChange={handleSegmentFilterChange}
  onLastContactFilterChange={handleLastContactFilterChange}
  onAddCustomFieldFilter={handleAddCustomFieldFilter}
  onRemoveCustomFieldFilter={handleRemoveCustomFieldFilter}
  onClearFilters={handleClearFilters}
  onClearCustomFieldFilters={handleClearCustomFieldFilters}
  hasActiveFilters={hasActiveFilters}
/>
```

#### Benefícios das Novas Funcionalidades

1. **Filtragem Avançada**: Permite criar filtros complexos para encontrar exatamente os clientes desejados.

2. **Produtividade**: Salvar filtros frequentemente utilizados economiza tempo e aumenta a produtividade.

3. **Flexibilidade**: Grupos aninhados permitem criar lógica de filtro altamente personalizada.

4. **Experiência do Usuário**: Interface intuitiva e responsiva para criação e gerenciamento de filtros.

5. **Consistência com CRMs Profissionais**: Implementa funcionalidades de filtro avançado similares a CRMs profissionais como o Kommo.