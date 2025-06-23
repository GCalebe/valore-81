# Guia de Implementação da Padronização da Interface do Cliente

Este documento fornece instruções detalhadas para implementar a padronização da interface do cliente em todo o sistema, conforme definido no documento `interface-standardization.md`.

## Componentes Padronizados

Os seguintes componentes padronizados foram criados e estão prontos para implementação:

1. **UnifiedClientInfo.tsx** - Componente base que padroniza a exibição de informações do cliente
2. **ClientInfoStandardized.tsx** - Wrapper que configura o UnifiedClientInfo com base no contexto
3. **ClientInfoTabsStandardized.tsx** - Substitui o ClientInfoTabs na tela de chat
4. **ClientDetailSheetStandardized.tsx** - Substitui o ClientDetailSheet na tela de detalhes
5. **ClientTableRowStandardized.tsx** - Substitui as linhas da tabela de clientes
6. **ClientsTableStandardized.tsx** - Substitui a tabela de clientes
7. **EditClientFormStandardized.tsx** - Substitui o formulário de edição de cliente
8. **NewClientFormStandardized.tsx** - Substitui o formulário de criação de cliente

## Plano de Implementação

A implementação será realizada em fases, conforme descrito abaixo:

### Fase 1: Tela de Chat (Concluída)

- [x] Modificar `ClientInfoTabs.tsx` para incluir dados UTM
- [x] Criar `ClientInfoTabsStandardized.tsx` como substituto

### Fase 2: Tela de Detalhes do Cliente

Para implementar a padronização na tela de detalhes do cliente:

1. Renomeie `ClientDetailSheetStandardized.tsx` para `ClientDetailSheet.tsx` (substituindo o atual), ou
2. Importe e use `ClientDetailSheetStandardized` no lugar do `ClientDetailSheet` atual

```jsx
// Substitua
<ClientDetailSheet 
  isOpen={isDetailSheetOpen}
  onOpenChange={setIsDetailSheetOpen}
  selectedContact={selectedContact}
  onEditClick={handleEditClick}
  onSendMessageClick={handleSendMessageClick}
  // ... outros props
/>

// Por
<ClientDetailSheetStandardized 
  isOpen={isDetailSheetOpen}
  onClose={() => setIsDetailSheetOpen(false)}
  contact={selectedContact}
  onSendMessage={handleSendMessage}
  onEditClient={handleEditClient}
/>
```

### Fase 3: Tabela de Clientes

Para implementar a padronização na tabela de clientes:

1. Renomeie `ClientsTableStandardized.tsx` para `ClientsTable.tsx` (substituindo o atual), ou
2. Importe e use `ClientsTableStandardized` no lugar do `ClientsTable` atual

```jsx
// Substitua
<ClientsTable 
  contacts={contacts}
  isLoading={loadingContacts}
  searchTerm={filter.searchTerm}
  statusFilter={filter.statusFilter}
  segmentFilter={filter.segmentFilter}
  lastContactFilter={filter.lastContactFilter}
  customFieldFilters={filter.customFieldFilters}
  onContactClick={handleContactClick}
  onEditClick={handleEditClick}
/>

// Por
<ClientsTableStandardized 
  contacts={contacts}
  isLoading={loadingContacts}
  searchTerm={filter.searchTerm}
  statusFilter={filter.statusFilter}
  segmentFilter={filter.segmentFilter}
  lastContactFilter={filter.lastContactFilter}
  customFieldFilters={filter.customFieldFilters}
  onViewDetails={handleContactClick}
  onSendMessage={(contactId) => navigateToClientChat(contactId)}
  onEditClient={handleEditClick}
/>
```

### Fase 4: Formulários de Edição e Criação

Para implementar a padronização nos formulários de edição e criação de cliente:

#### Formulário de Edição

1. Renomeie `EditClientFormStandardized.tsx` para `EditClientDialog.tsx` (substituindo o atual), ou
2. Importe e use `EditClientFormStandardized` no lugar do `EditClientDialog` atual

```jsx
// Substitua
<EditClientDialog 
  isOpen={isEditDialogOpen}
  onClose={handleCloseEditDialog}
  selectedContact={selectedContact}
  onSave={handleSaveClient}
/>

// Por
<EditClientFormStandardized 
  isOpen={isEditDialogOpen}
  onClose={handleCloseEditDialog}
  selectedContact={selectedContact}
  onSave={handleSaveClient}
/>
```

#### Formulário de Criação

1. Renomeie `NewClientFormStandardized.tsx` para `NewClientDialog.tsx` (substituindo o atual), ou
2. Importe e use `NewClientFormStandardized` no lugar do `NewClientDialog` atual

```jsx
// Substitua
<NewClientDialog 
  isOpen={isNewDialogOpen}
  onClose={handleCloseNewDialog}
  onSave={handleCreateClient}
/>

// Por
<NewClientFormStandardized 
  isOpen={isNewDialogOpen}
  onClose={handleCloseNewDialog}
  onSave={handleCreateClient}
/>
```

## Verificação de Implementação

Após implementar cada fase, verifique se:

1. Todas as informações do cliente são exibidas corretamente
2. Os dados UTM são exibidos quando disponíveis
3. A navegação entre abas funciona corretamente
4. Os formulários de edição salvam corretamente os dados
5. A interface mantém consistência visual em todos os contextos

## Benefícios da Padronização

A implementação completa da padronização trará os seguintes benefícios:

1. **Consistência Visual** - Interface uniforme em todas as telas
2. **Manutenção Simplificada** - Alterações em um único componente refletem em todo o sistema
3. **Integração de UTM** - Dados UTM disponíveis em todos os contextos relevantes
4. **Experiência do Usuário Aprimorada** - Navegação intuitiva e familiar em todas as telas
5. **Código Mais Limpo** - Redução de duplicação e melhor organização

## Próximos Passos

Após a implementação completa da padronização, considere:

1. Coletar feedback dos usuários sobre a nova interface
2. Refinar os componentes com base no feedback
3. Documentar quaisquer problemas encontrados durante a implementação
4. Planejar melhorias futuras para a interface padronizada

---

Este guia deve ser usado em conjunto com o documento `interface-standardization.md` e `utm-data-integration.md` para uma implementação completa e bem-sucedida da padronização da interface do cliente.