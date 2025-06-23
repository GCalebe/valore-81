# Integração de Dados UTM na Interface Padronizada

## Visão Geral

Este documento descreve a implementação da exibição de dados UTM na tela de chat e sua integração com a padronização da interface de cliente. A implementação segue o plano de padronização da interface definido no documento `interface-standardization.md`.

## Implementação Atual

### 1. Exibição de Dados UTM na Tela de Chat

A exibição de dados UTM na tela de chat foi implementada através da modificação do componente `ClientInfoTabs.tsx`. Foi adicionada uma aba específica para dados UTM que utiliza o componente `ClientUTMData` para exibir as informações de rastreamento UTM do cliente.

```tsx
case 'utm':
  return (
    <div className="space-y-4">
      <Collapsible open={true}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Dados UTM
            <ChevronUp className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {clientData?.id ? (
            <ClientUTMData contactId={clientData.id} />
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Dados UTM não disponíveis para este cliente.
              </p>
            </Card>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
```

### 2. Integração com a Interface Padronizada

Para seguir o plano de padronização da interface, foi criado um componente `ClientInfoTabsStandardized.tsx` que utiliza o componente padronizado `ClientInfoStandardized` para exibir as informações do cliente, incluindo os dados UTM.

```tsx
const ClientInfoTabsStandardized: React.FC<ClientInfoTabsStandardizedProps> = ({
  clientData,
  dynamicFields,
  onFieldUpdate
}) => {
  return (
    <div className="mt-4">
      <ClientInfoStandardized
        clientData={clientData}
        dynamicFields={dynamicFields}
        onFieldUpdate={onFieldUpdate}
        context="chat"
      />
    </div>
  );
};
```

## Componentes Criados/Modificados

1. **ClientInfoTabs.tsx** (modificado)
   - Adicionada aba UTM com exibição de dados UTM usando o componente `ClientUTMData`

2. **ClientInfoTabsStandardized.tsx** (novo)
   - Versão padronizada do componente `ClientInfoTabs` que utiliza o componente `ClientInfoStandardized`

3. **UnifiedClientInfo.tsx** (existente)
   - Componente base para exibição de informações de clientes em qualquer contexto
   - Já inclui suporte para exibição de dados UTM

4. **ClientInfoStandardized.tsx** (existente)
   - Wrapper que configura o `UnifiedClientInfo` para contextos específicos
   - Já inclui configuração para exibição de dados UTM no contexto de chat

## Exemplos de Implementação

Além da modificação do `ClientInfoTabs.tsx`, foram criados exemplos de implementação para os formulários de edição e criação de clientes:

1. **EditClientFormStandardized.tsx**
   - Exemplo de implementação do componente padronizado no formulário de edição de cliente

2. **NewClientFormStandardized.tsx**
   - Exemplo de implementação do componente padronizado no formulário de criação de cliente

## Próximos Passos

Seguindo o plano de migração definido no documento `interface-standardization.md`, os próximos passos são:

1. **Fase 2**: Implementar na tela de detalhes do cliente
   - Substituir o `ClientDetailSheet` pelo `ClientInfoStandardized`

2. **Fase 3**: Implementar na tabela de clientes
   - Adicionar visualização compacta usando `ClientInfoStandardized`

3. **Fase 4**: Implementar nos formulários de edição e criação
   - Adaptar os formulários para usar o componente padronizado

## Benefícios da Implementação

- **Consistência visual**: Os dados UTM são exibidos de forma consistente em todas as telas
- **Facilidade de manutenção**: Alterações na exibição de dados UTM podem ser feitas em um único componente
- **Melhor experiência do usuário**: Os usuários podem acessar os dados UTM de forma intuitiva em diferentes contextos
- **Desenvolvimento mais rápido**: A reutilização de componentes reduz o tempo de desenvolvimento

## Conclusão

A implementação da exibição de dados UTM na tela de chat e sua integração com a padronização da interface de cliente foi concluída com sucesso. A implementação segue o plano de padronização da interface e estabelece as bases para a continuação do processo de padronização em outras partes da aplicação.