# Componentes Padronizados

Esta seção documenta os componentes padronizados do projeto Valore-81, suas props, comportamentos e exemplos de uso.

## Visão Geral

Os componentes padronizados são a base da interface do usuário do Valore-81. Eles foram projetados para serem reutilizáveis, consistentes e fáceis de manter. Cada componente segue um padrão de design específico e possui um conjunto bem definido de props.

## Estrutura de Componentes

Os componentes estão organizados nas seguintes categorias:

- **UI**: Componentes básicos de UI (botões, inputs, modais, etc.)
- **Clients**: Componentes relacionados à gestão de clientes
- **Chat**: Componentes relacionados à funcionalidade de chat
- **Dashboard**: Componentes de dashboard e visualização de dados
- **Knowledge**: Componentes relacionados à gestão de conhecimento
- **Metrics**: Componentes de métricas e relatórios
- **Schedule**: Componentes relacionados ao agendamento

## Lista de Componentes Padronizados

### Componentes de Clientes

- [ClientsTableStandardized](./clients/ClientsTableStandardized.md)
- [ClientDetailSheetStandardized](./clients/ClientDetailSheetStandardized.md)
- [EditClientFormStandardized](./clients/EditClientFormStandardized.md)
- [NewClientFormStandardized](./clients/NewClientFormStandardized.md)

## Padrão de Nomenclatura

Os componentes padronizados seguem o seguinte padrão de nomenclatura:

- **Componentes Base**: `[Nome]Standardized.tsx`
- **Adaptadores**: `[Nome]Adapter.tsx` (quando necessário)

## Como Documentar um Novo Componente

Para documentar um novo componente padronizado, crie um arquivo Markdown na pasta correspondente à categoria do componente, seguindo o modelo abaixo:

```markdown
# Nome do Componente

Breve descrição do componente e seu propósito.

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|------------|
| prop1 | string | Sim | - | Descrição da prop1 |
| prop2 | number | Não | 0 | Descrição da prop2 |

## Exemplos de Uso

```tsx
<ComponenteStandardized 
  prop1="valor" 
  prop2={42} 
/>
```

## Comportamento

Descrição detalhada do comportamento do componente, incluindo estados, efeitos colaterais, etc.

## Dependências

Lista de dependências do componente (outros componentes, hooks, etc.).

## Notas de Implementação

Informações adicionais sobre a implementação do componente, decisões de design, etc.
```

## Boas Práticas

1. **Mantenha a documentação atualizada**: Sempre atualize a documentação quando fizer alterações em um componente
2. **Inclua exemplos de uso**: Exemplos ajudam outros desenvolvedores a entender como usar o componente
3. **Documente todas as props**: Mesmo as props opcionais devem ser documentadas
4. **Explique comportamentos complexos**: Se o componente tem comportamentos complexos, explique-os em detalhes