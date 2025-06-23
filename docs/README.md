# Documentação da Padronização da Interface do Cliente

## Visão Geral

Esta pasta contém a documentação completa relacionada à padronização da interface do cliente no sistema Valore. A padronização visa criar uma experiência de usuário consistente, melhorar a manutenibilidade do código e integrar dados UTM em todos os contextos relevantes.

## Documentos Disponíveis

### Documentação Conceitual

- **[interface-standardization.md](./interface-standardization.md)** - Documento principal que descreve a abordagem de padronização, os componentes criados e suas interações.
- **[utm-data-integration.md](./utm-data-integration.md)** - Documento que detalha a integração de dados UTM na interface padronizada.
- **[resumo-padronizacao.md](./resumo-padronizacao.md)** - Resumo executivo da padronização para apresentação a stakeholders.

### Documentação de Implementação

- **[implementacao-padronizacao.md](./implementacao-padronizacao.md)** - Guia detalhado para implementar a padronização em todo o sistema.
- **[verificacao-padronizacao.md](./verificacao-padronizacao.md)** - Checklist para verificar se a padronização foi implementada corretamente.

## Scripts de Suporte

Além da documentação, foram criados scripts para facilitar a implementação:

- **[implementar-padronizacao.js](../scripts/implementar-padronizacao.js)** - Script para automatizar a substituição dos componentes originais pelos padronizados.

## Como Usar Esta Documentação

1. Comece pelo **resumo-padronizacao.md** para entender os objetivos e benefícios da padronização.
2. Leia **interface-standardization.md** e **utm-data-integration.md** para compreender os detalhes técnicos.
3. Siga o guia em **implementacao-padronizacao.md** para implementar a padronização.
4. Use o checklist em **verificacao-padronizacao.md** para garantir que a implementação foi bem-sucedida.

## Fluxo de Implementação Recomendado

1. **Fase 1: Tela de Chat** - Implementação do ClientInfoTabsStandardized
2. **Fase 2: Tela de Detalhes** - Implementação do ClientDetailSheetStandardized
3. **Fase 3: Tabela de Clientes** - Implementação do ClientsTableStandardized
4. **Fase 4: Formulários** - Implementação do EditClientFormStandardized e NewClientFormStandardized

Cada fase deve ser testada completamente antes de prosseguir para a próxima.

## Contribuições

Se você identificar problemas na documentação ou tiver sugestões para melhorias na padronização, por favor, crie um issue ou pull request no repositório.

## Recursos Adicionais

- [Componentes Padronizados](../src/components/clients/) - Código-fonte dos componentes padronizados
- [Exemplos de Uso](../src/examples/) - Exemplos de uso dos componentes padronizados

---

Última atualização: Julho 2023