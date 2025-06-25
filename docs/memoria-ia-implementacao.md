# Implementação do Sistema de Memória para IA

## Visão Geral

Este documento descreve as alterações realizadas para implementar um sistema de memória avançado para a IA, consolidando as tabelas existentes e adicionando suporte para diferentes tipos de memória.

## Alterações Realizadas

### 1. Consolidação de Tabelas

As tabelas redundantes `n8n_chat_histories` e `n8n_chat_history` foram consolidadas em uma nova tabela chamada `n8n_chat_memory`, que mantém todos os campos existentes e adiciona novos campos para suportar diferentes tipos de memória.

**Arquivo de migração**: `supabase/migrations/20240601000000_consolidate_chat_tables.sql`

A migração realiza as seguintes operações:

1. Cria a nova tabela `n8n_chat_memory` com todos os campos necessários
2. Migra os dados das tabelas existentes para a nova tabela
3. Cria views para manter compatibilidade com o código existente
4. (Comentado) Comandos para remover as tabelas antigas após verificação

### 2. Novos Tipos de Dados

Foram criados novos tipos de dados para suportar o sistema de memória:

**Arquivo**: `src/types/memory.ts`

Este arquivo define:

- Tipos de memória (contextual, semântica, episódica)
- Níveis de memória (curto, médio e longo prazo)
- Interfaces para entidades e relacionamentos
- Interface principal `N8nChatMemory`

### 3. Atualização dos Tipos do Supabase

**Arquivo**: `src/integrations/supabase/types.ts`

O arquivo de tipos do Supabase foi atualizado para incluir a definição da nova tabela `n8n_chat_memory`.

### 4. Serviço de Memória

**Arquivo**: `src/lib/memoryService.ts`

Foi criado um novo serviço para gerenciar a memória da IA, com métodos para:

- Armazenar memórias
- Recuperar memórias por tipo, nível e importância
- Buscar memórias por entidades
- Atualizar importância de memórias
- Remover memórias expiradas
- Manter compatibilidade com o código existente

### 5. Utilitários para Integração com n8n

**Arquivo**: `src/utils/n8nMemoryUtils.ts`

Foram criados utilitários para facilitar a integração com o n8n:

- Conversão de memórias para formato compatível com n8n
- Conversão de objetos do n8n para o formato de memória
- Extração de entidades de textos
- Geração de resumos de contexto
- Preparação de contexto para envio ao n8n

### 6. Atualização do Serviço de Chat

**Arquivo**: `src/lib/chatService.ts`

O serviço de chat foi atualizado para utilizar a nova estrutura de memória, mantendo compatibilidade com o código existente.

### 7. Documentação para Integração com n8n

**Arquivo**: `docs/n8n/memoria-ia-n8n.md`

Foi criada documentação detalhada sobre como uma IA hospedada no n8n pode interagir com o sistema de memória, incluindo exemplos de código para workflows do n8n.

## Como Implementar

### Passo 1: Aplicar a Migração do Banco de Dados

1. Verifique se o arquivo de migração está na pasta correta: `supabase/migrations/20240601000000_consolidate_chat_tables.sql`
2. Execute a migração no ambiente de desenvolvimento para testar
3. Após verificar que tudo está funcionando, descomente as linhas para remover as tabelas antigas

### Passo 2: Atualizar o Código da Aplicação

1. Certifique-se de que todos os novos arquivos estão no lugar correto
2. Atualize as importações nos arquivos existentes para usar as novas interfaces e serviços
3. Teste a aplicação para garantir que a funcionalidade existente continua funcionando

### Passo 3: Implementar Workflows no n8n

1. Siga os exemplos em `docs/n8n/memoria-ia-n8n.md` para criar workflows no n8n
2. Comece com operações básicas de CRUD para memória
3. Implemente workflows mais avançados para processamento de linguagem natural e gerenciamento de memória

## Testes Recomendados

1. **Teste de Migração**: Verifique se os dados das tabelas antigas foram migrados corretamente
2. **Teste de Compatibilidade**: Verifique se o código existente continua funcionando com as novas estruturas
3. **Teste de Funcionalidade**: Teste as novas funcionalidades de memória
4. **Teste de Integração com n8n**: Verifique se os workflows do n8n conseguem interagir corretamente com o sistema de memória

## Próximos Passos

1. Implementar um sistema de cache para melhorar o desempenho
2. Desenvolver algoritmos mais avançados para extração de entidades e relacionamentos
3. Implementar um sistema de gerenciamento automático de níveis de memória
4. Criar dashboards para monitorar o uso da memória
5. Desenvolver testes automatizados para o sistema de memória

## Considerações de Segurança

1. Certifique-se de que as credenciais do Supabase estão armazenadas de forma segura
2. Implemente controle de acesso adequado para as operações de memória
3. Considere a criptografia de dados sensíveis armazenados na memória
4. Implemente políticas de retenção de dados para memórias de longo prazo

## Conclusão

O novo sistema de memória fornece uma base sólida para melhorar as capacidades da IA, permitindo que ela mantenha contexto, aprenda com interações passadas e personalize suas respostas com base em conhecimento acumulado. A implementação foi projetada para ser compatível com o código existente, minimizando o impacto nas funcionalidades atuais enquanto adiciona novos recursos poderosos.