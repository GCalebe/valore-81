# Guia de Uso do Pre-commit

## Introdução

O pre-commit é uma ferramenta que permite executar verificações automáticas antes de cada commit, garantindo a qualidade do código e evitando problemas comuns.

## Instalação

Para instalar o pre-commit, siga os passos abaixo:

```bash
# Instalar o pre-commit
python -m pip install pre-commit

# Instalar os hooks git no repositório
pre-commit install
```

## Configuração

O projeto já possui um arquivo `.pre-commit-config.yaml` na raiz do repositório com a configuração básica. Este arquivo define quais verificações serão executadas antes de cada commit.

Atualmente, estão configurados os seguintes hooks:

- **trailing-whitespace**: Remove espaços em branco no final das linhas
- **end-of-file-fixer**: Garante que os arquivos terminem com uma nova linha
- **check-yaml**: Verifica a sintaxe de arquivos YAML
- **check-added-large-files**: Impede a adição de arquivos muito grandes ao repositório
- **prettier**: Formata automaticamente arquivos JavaScript, TypeScript, JSON, CSS e Markdown

## Uso

Após a instalação, o pre-commit será executado automaticamente sempre que você fizer um commit. Se alguma verificação falhar, o commit será abortado e você precisará corrigir os problemas antes de tentar novamente.

Você também pode executar as verificações manualmente com os seguintes comandos:

```bash
# Executar em todos os arquivos do repositório
pre-commit run --all-files

# Executar apenas em arquivos específicos
pre-commit run --files arquivo1.js arquivo2.ts
```

## Atualização dos Hooks

Para atualizar os hooks para as versões mais recentes, execute:

```bash
pre-commit autoupdate
```

## Integração com CI/CD

O pre-commit pode ser integrado ao pipeline de CI/CD para garantir que todas as verificações sejam executadas também no servidor. Para isso, adicione o seguinte passo ao seu workflow:

```yaml
- name: Run pre-commit
  run: pre-commit run --all-files
```

## Referências

- [Documentação oficial do pre-commit](https://pre-commit.com/)
- [Hooks disponíveis](https://pre-commit.com/hooks.html)
