# Fluxo de Trabalho de Desenvolvimento

Este documento descreve o fluxo de trabalho de desenvolvimento adotado no projeto Valore-81, desde o planejamento até a implantação em produção.

## Visão Geral

O Valore-81 adota um fluxo de trabalho baseado em Git Flow adaptado, com ciclos de desenvolvimento iterativos e integração contínua. Este fluxo visa garantir qualidade de código, colaboração eficiente entre a equipe e entregas consistentes.

## Ambientes

O projeto utiliza os seguintes ambientes:

1. **Desenvolvimento (Local)** - Ambiente de desenvolvimento local de cada desenvolvedor
2. **Homologação** - Ambiente para testes e validação antes da implantação em produção
3. **Produção** - Ambiente final acessado pelos usuários

## Estrutura de Branches

O projeto segue uma estrutura de branches baseada no Git Flow, com algumas adaptações:

- **main** - Branch principal que reflete o código em produção
- **develop** - Branch de desenvolvimento, contém as funcionalidades prontas para a próxima release
- **feature/\*** - Branches para desenvolvimento de novas funcionalidades
- **bugfix/\*** - Branches para correção de bugs
- **hotfix/\*** - Branches para correções urgentes em produção
- **release/\*** - Branches para preparação de releases

## Ciclo de Vida de uma Feature

### 1. Planejamento

1. A funcionalidade é definida e documentada no sistema de gerenciamento de projetos
2. São criadas tarefas específicas com critérios de aceitação claros
3. As tarefas são atribuídas aos desenvolvedores

### 2. Desenvolvimento

1. O desenvolvedor cria uma branch a partir de `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nome-da-feature
   ```

2. Implementa a funcionalidade seguindo os padrões de código do projeto

3. Escreve testes unitários e de integração

4. Utiliza o pre-commit para garantir a qualidade do código antes de cada commit

5. Realiza commits frequentes com mensagens descritivas seguindo o padrão de commits:

   ```bash
   git commit -m "feat: adiciona formulário de cadastro de clientes"
   ```

6. Mantém a branch atualizada com `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/nome-da-feature
   git merge develop
   ```

### 3. Code Review

1. Ao finalizar a implementação, o desenvolvedor cria um Pull Request (PR) para a branch `develop`

2. Preenche o template de PR com:

   - Descrição da funcionalidade
   - Mudanças realizadas
   - Como testar
   - Screenshots (se aplicável)
   - Checklist de qualidade

3. Atribui revisores ao PR

4. Os revisores analisam o código e fornecem feedback

5. O desenvolvedor realiza as alterações necessárias com base no feedback

6. Após aprovação, o PR é mesclado à branch `develop`

### 4. Testes e QA

1. A funcionalidade é implantada automaticamente no ambiente de homologação após o merge

2. A equipe de QA realiza testes manuais e automatizados

3. Bugs encontrados são reportados e corrigidos em branches `bugfix/*`

4. Após validação, a funcionalidade é aprovada para a próxima release

### 5. Release

1. Quando há funcionalidades suficientes para uma release, é criada uma branch `release/vX.Y.Z`

2. Testes finais são realizados na branch de release

3. Ajustes finais são feitos diretamente na branch de release

4. A versão é atualizada e o changelog é gerado

5. A branch de release é mesclada em `main` e `develop`

6. A tag de versão é criada:
   ```bash
   git tag -a vX.Y.Z -m "Versão X.Y.Z"
   git push origin vX.Y.Z
   ```

### 6. Implantação

1. A implantação em produção é iniciada automaticamente após o merge em `main`

2. O processo de implantação inclui:

   - Build da aplicação
   - Execução de testes automatizados
   - Implantação no ambiente de produção
   - Verificações pós-implantação

3. A equipe monitora a implantação e verifica se tudo está funcionando corretamente

### 7. Hotfixes

Para correções urgentes em produção:

1. É criada uma branch `hotfix/descricao-do-problema` a partir de `main`

2. A correção é implementada e testada

3. Um PR é criado para `main` e `develop`

4. Após aprovação, o hotfix é mesclado em ambas as branches

5. Uma nova tag de versão é criada (incrementando o número de patch)

6. A correção é implantada em produção

## Padrões de Commits

O projeto segue o padrão de [Conventional Commits](https://www.conventionalcommits.org/) para mensagens de commit:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commits

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o código (formatação, espaços em branco, etc)
- **refactor**: Refatoração de código
- **perf**: Melhorias de performance
- **test**: Adição ou correção de testes
- **build**: Alterações no sistema de build ou dependências
- **ci**: Alterações nos arquivos de CI/CD
- **chore**: Outras alterações que não modificam código ou testes

### Exemplos

```
feat(cliente): adiciona formulário de cadastro de clientes

Implementa o formulário de cadastro de clientes com validação de campos
e integração com a API.

Resolve #123
```

```
fix(auth): corrige problema de login com Google

Corrige o problema que impedia usuários de fazer login usando
a autenticação do Google.

Resolve #456
```

## Pull Requests

### Template de PR

Todo PR deve seguir o template abaixo:

```markdown
## Descrição

[Descreva brevemente o propósito deste PR]

## Mudanças

- [Lista de mudanças realizadas]

## Como testar

1. [Passo a passo para testar a funcionalidade]

## Screenshots

[Se aplicável, adicione screenshots]

## Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Verificado em diferentes navegadores
- [ ] Verificado em dispositivos móveis
- [ ] Sem novos warnings ou erros
```

### Regras para PRs

1. **Tamanho**: PRs devem ser pequenos e focados em uma única funcionalidade ou correção
2. **Testes**: Todo PR deve incluir testes para as mudanças realizadas
3. **CI**: Todos os checks de CI devem passar antes do merge
4. **Revisão**: Todo PR deve ser revisado por pelo menos um outro desenvolvedor
5. **Discussões**: Discussões devem ser resolvidas antes do merge

## Integração Contínua (CI)

O projeto utiliza GitHub Actions para automação de CI/CD. Os workflows incluem:

### CI Workflow

Executado em cada push e PR para `develop` e `main`:

```yaml
name: CI

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.x"
      - name: Install pre-commit
        run: pip install pre-commit
      - name: Run pre-commit
        run: pre-commit run --all-files
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Type check
        run: npm run type-check
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
```

### CD Workflow

Executado após merge em `main`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

## Versionamento

O projeto segue o padrão de [Versionamento Semântico](https://semver.org/):

- **MAJOR (X)**: Mudanças incompatíveis com versões anteriores
- **MINOR (Y)**: Adição de funcionalidades de forma compatível
- **PATCH (Z)**: Correções de bugs compatíveis

## Gerenciamento de Dependências

### Atualização de Dependências

1. Atualizações de dependências são realizadas regularmente
2. Dependabot é configurado para criar PRs automáticos para atualizações de segurança
3. Atualizações maiores são testadas em branches separadas antes de serem mescladas

### Adição de Novas Dependências

1. Novas dependências devem ser discutidas e aprovadas pela equipe
2. Fatores a considerar:
   - Tamanho e impacto no bundle
   - Manutenção ativa
   - Licença compatível
   - Segurança

## Monitoramento e Feedback

### Monitoramento

1. Logs de aplicação são centralizados e monitorados
2. Métricas de performance são coletadas e analisadas
3. Alertas são configurados para problemas críticos

### Feedback dos Usuários

1. Feedback dos usuários é coletado através de:
   - Formulários de feedback
   - Suporte ao cliente
   - Análise de uso
2. Problemas reportados são priorizados e adicionados ao backlog

## Reuniões e Comunicação

### Reuniões Regulares

1. **Daily Standup** - Breve atualização diária (15 min)
2. **Sprint Planning** - Planejamento de sprint (2h a cada 2 semanas)
3. **Sprint Review** - Revisão de sprint (1h a cada 2 semanas)
4. **Sprint Retrospective** - Retrospectiva de sprint (1h a cada 2 semanas)

### Canais de Comunicação

1. **Slack** - Comunicação diária e discussões técnicas
2. **GitHub** - Discussões relacionadas a código e PRs
3. **Jira** - Gerenciamento de tarefas e projetos
4. **Google Meet** - Reuniões virtuais

## Onboarding de Novos Desenvolvedores

### Processo de Onboarding

1. Configuração do ambiente de desenvolvimento
2. Revisão da documentação do projeto
3. Atribuição de um mentor
4. Tarefas iniciais de baixa complexidade
5. Feedback regular e suporte

### Documentação para Novos Desenvolvedores

1. Guia de configuração do ambiente
2. Visão geral da arquitetura
3. Fluxo de trabalho e processos
4. Padrões de código e boas práticas

## Conclusão

Este fluxo de trabalho foi projetado para maximizar a produtividade da equipe, garantir a qualidade do código e facilitar a colaboração. Ele é revisado e ajustado regularmente com base no feedback da equipe e nas necessidades do projeto.

Lembre-se de que o objetivo principal é entregar valor aos usuários de forma consistente e sustentável, mantendo um alto padrão de qualidade e uma base de código saudável.
