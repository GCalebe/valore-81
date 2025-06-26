# Guia de Boas Práticas

Este guia descreve as boas práticas a serem seguidas no desenvolvimento do projeto Valore-81, incluindo convenções de código, padrões de commit e fluxo de trabalho.

## Convenções de Código

### TypeScript

1. **Tipagem**: Use tipagem estrita sempre que possível
2. **Interfaces vs Types**: Prefira `interface` para definições de objetos e `type` para aliases e unions
3. **Enums**: Use enums para valores constantes relacionados
4. **Null vs Undefined**: Use `undefined` para valores opcionais e `null` para valores intencionalmente vazios
5. **Async/Await**: Prefira `async/await` em vez de Promises encadeadas

Exemplo:

```typescript
// Bom
interface User {
  id: string;
  name: string;
  email: string;
  age?: number; // Opcional
}

type UserRole = "admin" | "user" | "guest";

enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

async function fetchUser(id: string): Promise<User | undefined> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return undefined;
  }
}
```

### React

1. **Componentes Funcionais**: Prefira componentes funcionais com hooks em vez de componentes de classe
2. **Props Tipadas**: Sempre defina tipos para as props dos componentes
3. **Desestruturação**: Use desestruturação para acessar props e estado
4. **Hooks Personalizados**: Extraia lógica complexa para hooks personalizados
5. **Memoização**: Use `useMemo` e `useCallback` para otimizar performance quando necessário

Exemplo:

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick();
    }
  }, [onClick, disabled]);

  const buttonClass = useMemo(() => {
    return `btn btn-${variant} ${disabled ? "btn-disabled" : ""}`;
  }, [variant, disabled]);

  return (
    <button className={buttonClass} onClick={handleClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Estilização

1. **Tailwind CSS**: Use classes do Tailwind para estilização
2. **Componentes de UI**: Use os componentes da biblioteca de UI do projeto
3. **Responsividade**: Garanta que todos os componentes sejam responsivos
4. **Temas**: Respeite o sistema de temas do projeto

Exemplo:

```tsx
<div className="flex flex-col space-y-4 p-4 bg-background rounded-lg shadow-md dark:bg-background-dark">
  <h2 className="text-xl font-bold text-foreground dark:text-foreground-dark">
    Título
  </h2>
  <p className="text-muted-foreground dark:text-muted-foreground-dark">
    Conteúdo
  </p>
  <Button variant="primary">Ação</Button>
</div>
```

## Padrões de Commit

### Formato de Mensagens

Siga o padrão Conventional Commits para mensagens de commit:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos de Commit

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Alterações que não afetam o significado do código (espaços em branco, formatação, etc.)
- **refactor**: Alterações no código que não corrigem bugs nem adicionam funcionalidades
- **perf**: Alterações que melhoram a performance
- **test**: Adição ou correção de testes
- **chore**: Alterações no processo de build ou ferramentas auxiliares

Exemplos:

```
feat(client): adiciona componente de tabela padronizado

fix(auth): corrige problema de redirecionamento após login

docs: atualiza documentação de componentes

refactor(chat): padroniza componentes de chat
```

## Fluxo de Trabalho

### Branches

1. **main**: Branch principal, sempre estável
2. **develop**: Branch de desenvolvimento, integração de features
3. **feature/nome-da-feature**: Branches para desenvolvimento de novas funcionalidades
4. **fix/nome-do-bug**: Branches para correção de bugs
5. **refactor/nome-da-refatoracao**: Branches para refatorações

### Processo de Desenvolvimento

1. Crie uma branch a partir de `develop` para sua feature/fix/refactor
2. Desenvolva e teste sua alteração
3. Faça commits seguindo o padrão Conventional Commits
4. Abra um Pull Request para `develop`
5. Após revisão e aprovação, faça o merge
6. Periodicamente, `develop` é mergeado em `main` para releases

### Code Review

1. Todo código deve passar por revisão antes de ser mergeado
2. Revisores devem verificar:
   - Funcionalidade
   - Qualidade do código
   - Aderência às convenções
   - Testes
   - Documentação

## Testes

### Tipos de Testes

1. **Testes Unitários**: Testam unidades individuais de código
2. **Testes de Integração**: Testam a integração entre diferentes partes do sistema
3. **Testes de UI**: Testam a interface do usuário

### Boas Práticas de Testes

1. Escreva testes para todas as novas funcionalidades
2. Mantenha a cobertura de testes alta
3. Use mocks para dependências externas
4. Escreva testes legíveis e manuteníveis

## Documentação

1. **Código**: Use comentários JSDoc para documentar funções, classes e tipos complexos
2. **README**: Mantenha o README atualizado com informações sobre o projeto
3. **Documentação de Componentes**: Documente todos os componentes padronizados
4. **Histórico de Alterações**: Registre alterações significativas no histórico

## Performance

1. **Memoização**: Use `useMemo` e `useCallback` para evitar recálculos desnecessários
2. **Code Splitting**: Use code splitting para reduzir o tamanho do bundle inicial
3. **Lazy Loading**: Carregue componentes e recursos sob demanda
4. **Otimização de Imagens**: Otimize imagens para web
5. **Monitoramento**: Monitore a performance da aplicação em produção

## Segurança

1. **Validação de Entrada**: Valide todas as entradas do usuário
2. **Sanitização de Dados**: Sanitize dados antes de exibi-los
3. **Autenticação e Autorização**: Implemente controles de acesso adequados
4. **Dependências**: Mantenha as dependências atualizadas
5. **Secrets**: Nunca comite secrets no repositório

## Acessibilidade

1. **Semântica**: Use elementos HTML semânticos
2. **ARIA**: Use atributos ARIA quando necessário
3. **Contraste**: Garanta contraste adequado para texto
4. **Navegação por Teclado**: Garanta que a aplicação seja navegável por teclado
5. **Testes de Acessibilidade**: Teste a acessibilidade da aplicação

## Conclusão

Seguir estas boas práticas ajudará a manter a qualidade do código, facilitar a colaboração e garantir a manutenibilidade do projeto Valore-81 a longo prazo.
