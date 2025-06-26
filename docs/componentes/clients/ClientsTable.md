# ClientsTable

O componente `ClientsTable` é responsável por exibir uma tabela de clientes com recursos de filtragem, ordenação e ações como visualização de detalhes, edição e exclusão.

## Props

| Prop               | Tipo      | Obrigatório | Padrão | Descrição                                                               |
| ------------------ | --------- | ----------- | ------ | ----------------------------------------------------------------------- |
| contacts           | Contact[] | Sim         | -      | Array de contatos/clientes a serem exibidos na tabela                   |
| isLoading          | boolean   | Não         | false  | Indica se os dados estão sendo carregados                               |
| searchTerm         | string    | Não         | ''     | Termo de busca para filtrar os contatos                                 |
| statusFilter       | string    | Não         | 'all'  | Filtro por status do cliente                                            |
| segmentFilter      | string    | Não         | 'all'  | Filtro por segmento do cliente                                          |
| lastContactFilter  | string    | Não         | 'all'  | Filtro por data do último contato                                       |
| customFieldFilters | object    | Não         | {}     | Filtros por campos personalizados                                       |
| onViewDetails      | function  | Sim         | -      | Função chamada quando o usuário clica para ver detalhes de um cliente   |
| onEditClient       | function  | Sim         | -      | Função chamada quando o usuário clica para editar um cliente            |
| onDeleteClient     | function  | Sim         | -      | Função chamada quando o usuário clica para excluir um cliente           |
| onSendMessage      | function  | Sim         | -      | Função chamada quando o usuário clica para enviar mensagem a um cliente |

## Exemplos de Uso

```tsx
<ClientsTable
  contacts={clients}
  isLoading={loading}
  searchTerm={searchQuery}
  statusFilter="active"
  segmentFilter="all"
  lastContactFilter="week"
  customFieldFilters={{}}
  onViewDetails={(client) => handleViewDetails(client)}
  onEditClient={(client) => handleEditClient(client)}
  onDeleteClient={(client) => handleDeleteClient(client)}
  onSendMessage={(client) => handleSendMessage(client)}
/>
```

## Comportamento

O componente `ClientsTable` exibe uma tabela de clientes com as seguintes características:

1. **Cabeçalho da Tabela**: Exibe os nomes das colunas com suporte a ordenação
2. **Linhas de Clientes**: Cada linha representa um cliente e exibe suas informações principais
3. **Ações**: Cada linha possui botões para visualizar detalhes, editar, excluir e enviar mensagem
4. **Estado de Carregamento**: Exibe um indicador de carregamento quando `isLoading` é true
5. **Filtragem**: Filtra os clientes com base nos filtros fornecidos (searchTerm, statusFilter, etc.)

## Estrutura Interna

O componente utiliza o componente `ClientTableRow` para renderizar cada linha da tabela. A estrutura básica é:

```tsx
<Table>
  <TableHeader>{/* Cabeçalhos das colunas */}</TableHeader>
  <TableBody>
    {filteredContacts.map((contact) => (
      <ClientTableRow
        key={contact.id}
        contact={contact}
        onViewDetails={onViewDetails}
        onEditClient={onEditClient}
        onDeleteClient={onDeleteClient}
        onSendMessage={onSendMessage}
      />
    ))}
  </TableBody>
</Table>
```

## Dependências

- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` da biblioteca de UI
- `Button` da biblioteca de UI
- `ClientTableRow` para renderizar as linhas da tabela

## Notas de Implementação

- O componente não gerencia o estado dos filtros, apenas recebe os valores como props
- A lógica de filtragem é aplicada internamente com base nos filtros recebidos
- O componente é responsivo e se adapta a diferentes tamanhos de tela
- Para telas pequenas, algumas colunas menos importantes são ocultadas
