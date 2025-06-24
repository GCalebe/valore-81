# ClientDetailSheetStandardized

O componente `ClientDetailSheetStandardized` é responsável por exibir os detalhes de um cliente em um painel lateral (sheet) que desliza da direita da tela. Ele mostra informações detalhadas do cliente e fornece ações como enviar mensagem, editar e excluir.

## Props

| Prop | Tipo | Obrigatório | Padrão | Descrição |
|------|------|-------------|--------|------------|
| isOpen | boolean | Sim | - | Controla se o painel está aberto ou fechado |
| onClose | function | Sim | - | Função chamada quando o usuário fecha o painel |
| contact | Contact | Sim | - | Objeto contendo os dados do cliente a ser exibido |
| onSendMessage | function | Sim | - | Função chamada quando o usuário clica para enviar mensagem |
| onEditClient | function | Sim | - | Função chamada quando o usuário clica para editar o cliente |
| onDeleteClient | function | Sim | - | Função chamada quando o usuário clica para excluir o cliente |

## Exemplos de Uso

```tsx
<ClientDetailSheetStandardized 
  isOpen={isDetailSheetOpen}
  onClose={() => setIsDetailSheetOpen(false)}
  contact={selectedContact}
  onSendMessage={(contact) => handleSendMessage(contact)}
  onEditClient={(contact) => handleEditClient(contact)}
  onDeleteClient={(contact) => handleDeleteClient(contact)}
/>
```

## Comportamento

O componente `ClientDetailSheetStandardized` exibe um painel lateral com as seguintes características:

1. **Cabeçalho**: Exibe o nome do cliente e botões de ação (fechar, enviar mensagem, editar, excluir)
2. **Informações do Cliente**: Exibe as informações básicas do cliente (nome, email, telefone, etc.)
3. **Categorias Dinâmicas**: Exibe informações organizadas em categorias (dados pessoais, dados de contato, etc.)
4. **Ações**: Fornece botões para enviar mensagem, editar e excluir o cliente
5. **Animação**: O painel desliza da direita da tela quando é aberto e volta para fora da tela quando é fechado

## Estrutura Interna

O componente utiliza os componentes `ClientInfoStandardized` e `DynamicCategory` para organizar e exibir as informações do cliente. A estrutura básica é:

```tsx
<Sheet open={isOpen} onOpenChange={onClose}>
  <SheetContent>
    <SheetHeader>
      {/* Cabeçalho com nome do cliente e botões de ação */}
    </SheetHeader>
    <div className="space-y-6">
      <ClientInfoStandardized contact={contact} />
      {/* Categorias dinâmicas com informações adicionais */}
      <DynamicCategory title="Dados de Contato" items={contactData} />
      <DynamicCategory title="Informações Adicionais" items={additionalData} />
      {/* Outras categorias */}
    </div>
    <SheetFooter>
      {/* Botões de ação no rodapé */}
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Dependências

- `Sheet`, `SheetContent`, `SheetHeader`, `SheetFooter` da biblioteca de UI
- `Button` da biblioteca de UI
- `ClientInfoStandardized` para exibir informações básicas do cliente
- `DynamicCategory` para organizar informações em categorias

## Notas de Implementação

- O componente não gerencia o estado de abertura/fechamento, apenas recebe o valor como prop
- As informações do cliente são organizadas em categorias para melhor visualização
- O componente é responsivo e se adapta a diferentes tamanhos de tela
- Para telas pequenas, o painel ocupa toda a largura da tela