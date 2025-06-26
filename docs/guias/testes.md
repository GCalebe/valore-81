# Guia de Testes

Este documento descreve a estratégia e práticas de testes adotadas no projeto Valore-81.

## Visão Geral

O Valore-81 adota uma abordagem abrangente de testes para garantir a qualidade do código e a estabilidade da aplicação. A estratégia de testes inclui diferentes níveis e tipos de testes, desde testes unitários até testes end-to-end.

## Estrutura de Testes

A estrutura de testes do projeto é organizada da seguinte forma:

```
src/
├── __tests__/            # Testes de integração e end-to-end
├── components/
│   ├── __tests__/        # Testes de componentes
│   └── [component]/
│       └── __tests__/    # Testes específicos de componente
├── hooks/
│   └── __tests__/        # Testes de hooks personalizados
├── lib/
│   └── __tests__/        # Testes de bibliotecas e utilitários
├── pages/
│   └── __tests__/        # Testes de páginas
└── utils/
    └── __tests__/        # Testes de funções utilitárias
```

## Tipos de Testes

### 1. Testes Unitários

Testes unitários verificam o comportamento de unidades individuais de código (funções, classes, componentes) isoladamente.

**Ferramentas:**

- Jest - Framework de testes
- React Testing Library - Biblioteca para testar componentes React

**Convenções:**

- Arquivos de teste unitário seguem o padrão `[nome-do-arquivo].test.tsx`
- Testes são organizados em blocos `describe` e casos de teste `it`/`test`
- Mocks são utilizados para isolar a unidade sendo testada

**Exemplo de Teste Unitário:**

```typescript
// src/utils/__tests__/formatters.test.ts
import { formatCurrency, formatDate, formatCpfCnpj } from "../formatters";

describe("Formatters", () => {
  describe("formatCurrency", () => {
    it("should format number to BRL currency", () => {
      expect(formatCurrency(1000)).toBe("R$ 1.000,00");
      expect(formatCurrency(1000.5)).toBe("R$ 1.000,50");
      expect(formatCurrency(0)).toBe("R$ 0,00");
    });

    it("should handle negative values", () => {
      expect(formatCurrency(-1000)).toBe("-R$ 1.000,00");
    });

    it("should handle undefined or null", () => {
      expect(formatCurrency(undefined)).toBe("R$ 0,00");
      expect(formatCurrency(null)).toBe("R$ 0,00");
    });
  });

  describe("formatDate", () => {
    it("should format date to DD/MM/YYYY", () => {
      const date = new Date("2023-06-15");
      expect(formatDate(date)).toBe("15/06/2023");
    });

    it("should handle string dates", () => {
      expect(formatDate("2023-06-15")).toBe("15/06/2023");
    });

    it("should return empty string for invalid dates", () => {
      expect(formatDate("invalid-date")).toBe("");
      expect(formatDate(null)).toBe("");
      expect(formatDate(undefined)).toBe("");
    });
  });

  describe("formatCpfCnpj", () => {
    it("should format CPF correctly", () => {
      expect(formatCpfCnpj("12345678900")).toBe("123.456.789-00");
    });

    it("should format CNPJ correctly", () => {
      expect(formatCpfCnpj("12345678000190")).toBe("12.345.678/0001-90");
    });

    it("should return original value if not valid CPF or CNPJ", () => {
      expect(formatCpfCnpj("123")).toBe("123");
      expect(formatCpfCnpj("")).toBe("");
      expect(formatCpfCnpj(null)).toBe("");
      expect(formatCpfCnpj(undefined)).toBe("");
    });
  });
});
```

### 2. Testes de Componentes

Testes de componentes verificam se os componentes React renderizam corretamente e respondem adequadamente às interações do usuário.

**Ferramentas:**

- Jest
- React Testing Library
- jest-dom - Extensões de matchers para DOM

**Convenções:**

- Testar o comportamento do componente, não sua implementação
- Focar em interações do usuário e saídas visíveis
- Usar seletores acessíveis (getByRole, getByLabelText, etc.)

**Exemplo de Teste de Componente:**

```typescript
// src/components/clients/ClientsTableStandardized/__tests__/ClientsTableStandardized.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientsTableStandardized from '../ClientsTableStandardized';

// Mock data
const mockClients = [
  {
    id: '1',
    nome: 'Empresa ABC',
    email: 'contato@empresaabc.com',
    telefone: '(11) 1234-5678',
    tipo: 'PJ',
    cnpj: '12.345.678/0001-90',
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 9876-5432',
    tipo: 'PF',
    cpf: '123.456.789-00',
  },
];

// Mock functions
const mockOnViewDetails = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('ClientsTableStandardized', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the table with clients data', () => {
    render(
      <ClientsTableStandardized
        clients={mockClients}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check if table headers are rendered
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Telefone')).toBeInTheDocument();
    expect(screen.getByText('Tipo')).toBeInTheDocument();
    expect(screen.getByText('Ações')).toBeInTheDocument();

    // Check if client data is rendered
    expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
    expect(screen.getByText('contato@empresaabc.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 1234-5678')).toBeInTheDocument();
    expect(screen.getByText('PJ')).toBeInTheDocument();

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 9876-5432')).toBeInTheDocument();
    expect(screen.getByText('PF')).toBeInTheDocument();
  });

  it('should show loading state when isLoading is true', () => {
    render(
      <ClientsTableStandardized
        clients={[]}
        isLoading={true}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should show empty state when no clients are provided', () => {
    render(
      <ClientsTableStandardized
        clients={[]}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument();
  });

  it('should call onViewDetails when view button is clicked', async () => {
    render(
      <ClientsTableStandardized
        clients={mockClients}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find all view buttons and click the first one
    const viewButtons = screen.getAllByRole('button', { name: /visualizar/i });
    fireEvent.click(viewButtons[0]);

    // Check if onViewDetails was called with the correct client id
    expect(mockOnViewDetails).toHaveBeenCalledWith('1');
  });

  it('should call onEdit when edit button is clicked', async () => {
    render(
      <ClientsTableStandardized
        clients={mockClients}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find all edit buttons and click the first one
    const editButtons = screen.getAllByRole('button', { name: /editar/i });
    fireEvent.click(editButtons[0]);

    // Check if onEdit was called with the correct client id
    expect(mockOnEdit).toHaveBeenCalledWith('1');
  });

  it('should call onDelete when delete button is clicked and confirmed', async () => {
    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    render(
      <ClientsTableStandardized
        clients={mockClients}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find all delete buttons and click the first one
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButtons[0]);

    // Check if window.confirm was called
    expect(window.confirm).toHaveBeenCalled();

    // Check if onDelete was called with the correct client id
    expect(mockOnDelete).toHaveBeenCalledWith('1');

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });

  it('should not call onDelete when delete is canceled', async () => {
    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);

    render(
      <ClientsTableStandardized
        clients={mockClients}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find all delete buttons and click the first one
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButtons[0]);

    // Check if window.confirm was called
    expect(window.confirm).toHaveBeenCalled();

    // Check if onDelete was NOT called
    expect(mockOnDelete).not.toHaveBeenCalled();

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });
});
```

### 3. Testes de Hooks

Testes de hooks personalizados verificam se os hooks React funcionam corretamente.

**Ferramentas:**

- Jest
- React Testing Library
- @testing-library/react-hooks

**Exemplo de Teste de Hook:**

```typescript
// src/hooks/__tests__/useClientForm.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useClientForm } from "../useClientForm";

describe("useClientForm", () => {
  const mockClient = {
    id: "1",
    nome: "Empresa ABC",
    email: "contato@empresaabc.com",
    telefone: "(11) 1234-5678",
    tipo: "PJ",
    cnpj: "12.345.678/0001-90",
  };

  it("should initialize with default values when no client is provided", () => {
    const { result } = renderHook(() => useClientForm());

    expect(result.current.formData).toEqual({
      nome: "",
      email: "",
      telefone: "",
      tipo: "PF",
      cpf: "",
      cnpj: "",
    });
  });

  it("should initialize with client data when client is provided", () => {
    const { result } = renderHook(() => useClientForm(mockClient));

    expect(result.current.formData).toEqual(mockClient);
  });

  it("should update form data when handleChange is called", () => {
    const { result } = renderHook(() => useClientForm());

    act(() => {
      result.current.handleChange({
        target: { name: "nome", value: "Novo Nome" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.nome).toBe("Novo Nome");
  });

  it("should validate form data and return errors", () => {
    const { result } = renderHook(() => useClientForm());

    // Form is initially empty, should have validation errors
    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.nome).toBeTruthy();
    expect(result.current.errors.email).toBeTruthy();
    expect(result.current.errors.telefone).toBeTruthy();

    // Fill required fields
    act(() => {
      result.current.handleChange({
        target: { name: "nome", value: "Novo Nome" },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleChange({
        target: { name: "email", value: "email@valido.com" },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleChange({
        target: { name: "telefone", value: "(11) 1234-5678" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.validate();
    });

    // No errors for required fields
    expect(result.current.errors.nome).toBeFalsy();
    expect(result.current.errors.email).toBeFalsy();
    expect(result.current.errors.telefone).toBeFalsy();
  });

  it("should validate CPF when tipo is PF", () => {
    const { result } = renderHook(() => useClientForm());

    // Set tipo to PF and provide invalid CPF
    act(() => {
      result.current.handleChange({
        target: { name: "tipo", value: "PF" },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleChange({
        target: { name: "cpf", value: "123" }, // Invalid CPF
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.cpf).toBeTruthy();

    // Provide valid CPF
    act(() => {
      result.current.handleChange({
        target: { name: "cpf", value: "123.456.789-00" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.cpf).toBeFalsy();
  });

  it("should validate CNPJ when tipo is PJ", () => {
    const { result } = renderHook(() => useClientForm());

    // Set tipo to PJ and provide invalid CNPJ
    act(() => {
      result.current.handleChange({
        target: { name: "tipo", value: "PJ" },
      } as React.ChangeEvent<HTMLInputElement>);

      result.current.handleChange({
        target: { name: "cnpj", value: "123" }, // Invalid CNPJ
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.cnpj).toBeTruthy();

    // Provide valid CNPJ
    act(() => {
      result.current.handleChange({
        target: { name: "cnpj", value: "12.345.678/0001-90" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.cnpj).toBeFalsy();
  });

  it("should reset form data when reset is called", () => {
    const { result } = renderHook(() => useClientForm(mockClient));

    // Change some data
    act(() => {
      result.current.handleChange({
        target: { name: "nome", value: "Novo Nome" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.nome).toBe("Novo Nome");

    // Reset form
    act(() => {
      result.current.reset();
    });

    // Should be back to initial values
    expect(result.current.formData).toEqual(mockClient);
  });
});
```

### 4. Testes de Integração

Testes de integração verificam se diferentes partes da aplicação funcionam corretamente juntas.

**Ferramentas:**

- Jest
- React Testing Library
- MSW (Mock Service Worker) - Para simular chamadas de API

**Exemplo de Teste de Integração:**

```typescript
// src/__tests__/integration/ClientManagement.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ClientsDashboard from '../../pages/ClientsDashboard';

// Mock data
const mockClients = [
  {
    id: '1',
    nome: 'Empresa ABC',
    email: 'contato@empresaabc.com',
    telefone: '(11) 1234-5678',
    tipo: 'PJ',
    cnpj: '12.345.678/0001-90',
  },
  {
    id: '2',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 9876-5432',
    tipo: 'PF',
    cpf: '123.456.789-00',
  },
];

// Setup MSW server
const server = setupServer(
  // GET clients
  rest.get('/api/clients', (req, res, ctx) => {
    return res(ctx.json(mockClients));
  }),

  // GET client by id
  rest.get('/api/clients/:id', (req, res, ctx) => {
    const { id } = req.params;
    const client = mockClients.find((c) => c.id === id);
    if (client) {
      return res(ctx.json(client));
    }
    return res(ctx.status(404));
  }),

  // POST new client
  rest.post('/api/clients', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ id: '3', ...req.body }));
  }),

  // PUT update client
  rest.put('/api/clients/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.json({ id, ...req.body }));
  }),

  // DELETE client
  rest.delete('/api/clients/:id', (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

// Start server before all tests
beforeAll(() => server.listen());
// Reset handlers after each test
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

describe('Client Management Integration', () => {
  it('should load and display clients', async () => {
    render(<ClientsDashboard />);

    // Initially should show loading
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
    });

    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('should open client details when view button is clicked', async () => {
    render(<ClientsDashboard />);

    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
    });

    // Click view button for first client
    const viewButtons = screen.getAllByRole('button', { name: /visualizar/i });
    fireEvent.click(viewButtons[0]);

    // Wait for client details to load
    await waitFor(() => {
      expect(screen.getByText(/detalhes do cliente/i)).toBeInTheDocument();
    });

    // Check if client details are displayed
    expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
    expect(screen.getByText('contato@empresaabc.com')).toBeInTheDocument();
    expect(screen.getByText('(11) 1234-5678')).toBeInTheDocument();
    expect(screen.getByText('12.345.678/0001-90')).toBeInTheDocument();
  });

  it('should open new client form when add button is clicked', async () => {
    render(<ClientsDashboard />);

    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
    });

    // Click add client button
    const addButton = screen.getByRole('button', { name: /adicionar cliente/i });
    fireEvent.click(addButton);

    // Check if new client form is displayed
    expect(screen.getByText(/novo cliente/i)).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'Novo Cliente' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'novo@email.com' },
    });
    fireEvent.change(screen.getByLabelText(/telefone/i), {
      target: { value: '(11) 1111-2222' },
    });

    // Submit form
    const saveButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveButton);

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/cliente adicionado com sucesso/i)).toBeInTheDocument();
    });
  });

  it('should delete client when delete button is clicked and confirmed', async () => {
    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    render(<ClientsDashboard />);

    // Wait for clients to load
    await waitFor(() => {
      expect(screen.getByText('Empresa ABC')).toBeInTheDocument();
    });

    // Get initial client count
    const initialRows = screen.getAllByRole('row');
    const initialClientCount = initialRows.length - 1; // Subtract header row

    // Click delete button for first client
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i });
    fireEvent.click(deleteButtons[0]);

    // Check if confirmation was shown
    expect(window.confirm).toHaveBeenCalled();

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/cliente excluído com sucesso/i)).toBeInTheDocument();
    });

    // Check if client was removed from the list
    const updatedRows = screen.getAllByRole('row');
    expect(updatedRows.length).toBe(initialClientCount); // One less client

    // Restore original window.confirm
    window.confirm = originalConfirm;
  });
});
```

### 5. Testes End-to-End (E2E)

Testes E2E verificam o fluxo completo da aplicação, simulando interações reais do usuário.

**Ferramentas:**

- Cypress - Framework de testes E2E

**Estrutura:**

```
cypress/
├── fixtures/        # Dados de teste
├── integration/     # Testes E2E
├── plugins/         # Plugins do Cypress
└── support/         # Comandos e utilitários personalizados
```

**Exemplo de Teste E2E:**

```javascript
// cypress/integration/client-management.spec.js
describe("Client Management", () => {
  beforeEach(() => {
    // Login before each test
    cy.login("admin@example.com", "password");
    cy.visit("/clients");
  });

  it("should display client list", () => {
    cy.get("table").should("be.visible");
    cy.contains("th", "Nome").should("be.visible");
    cy.contains("th", "Email").should("be.visible");
    cy.contains("th", "Telefone").should("be.visible");
    cy.contains("th", "Tipo").should("be.visible");
    cy.contains("th", "Ações").should("be.visible");
  });

  it("should add a new client", () => {
    // Click add client button
    cy.contains("button", "Adicionar Cliente").click();

    // Fill form
    cy.get("form").within(() => {
      cy.get('input[name="nome"]').type("Cliente Teste E2E");
      cy.get('input[name="email"]').type("teste-e2e@example.com");
      cy.get('input[name="telefone"]').type("(11) 9999-8888");
      cy.get('select[name="tipo"]').select("PF");
      cy.get('input[name="cpf"]').type("123.456.789-00");
      cy.contains("button", "Salvar").click();
    });

    // Check success message
    cy.contains("Cliente adicionado com sucesso").should("be.visible");

    // Check if new client is in the list
    cy.contains("td", "Cliente Teste E2E").should("be.visible");
    cy.contains("td", "teste-e2e@example.com").should("be.visible");
  });

  it("should view client details", () => {
    // Find first client and click view button
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get('button[aria-label="Visualizar"]').click();
      });

    // Check if details panel is visible
    cy.contains("h2", "Detalhes do Cliente").should("be.visible");

    // Check client information
    cy.get('[data-testid="client-details"]').within(() => {
      cy.contains("Nome").should("be.visible");
      cy.contains("Email").should("be.visible");
      cy.contains("Telefone").should("be.visible");
    });

    // Close details panel
    cy.get('button[aria-label="Fechar"]').click();
    cy.contains("h2", "Detalhes do Cliente").should("not.exist");
  });

  it("should edit a client", () => {
    // Find first client and click edit button
    cy.get("table tbody tr")
      .first()
      .within(() => {
        cy.get('button[aria-label="Editar"]').click();
      });

    // Check if edit form is visible
    cy.contains("h2", "Editar Cliente").should("be.visible");

    // Update client information
    cy.get("form").within(() => {
      cy.get('input[name="nome"]').clear().type("Cliente Atualizado E2E");
      cy.get('input[name="email"]').clear().type("atualizado-e2e@example.com");
      cy.contains("button", "Salvar").click();
    });

    // Check success message
    cy.contains("Cliente atualizado com sucesso").should("be.visible");

    // Check if client was updated in the list
    cy.contains("td", "Cliente Atualizado E2E").should("be.visible");
    cy.contains("td", "atualizado-e2e@example.com").should("be.visible");
  });

  it("should delete a client", () => {
    // Get initial number of clients
    cy.get("table tbody tr").then(($rows) => {
      const initialCount = $rows.length;

      // Find first client and click delete button
      cy.get("table tbody tr")
        .first()
        .within(() => {
          cy.get('button[aria-label="Excluir"]').click();
        });

      // Confirm deletion
      cy.on("window:confirm", () => true);

      // Check success message
      cy.contains("Cliente excluído com sucesso").should("be.visible");

      // Check if client was removed from the list
      cy.get("table tbody tr").should("have.length", initialCount - 1);
    });
  });
});
```

## Configuração de Testes

### Jest

Configurações do Jest no arquivo `jest.config.js`:

```javascript
module.exports = {
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{ts,tsx}",
    "!src/pages/_app.tsx",
    "!src/pages/_document.tsx",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  modulePaths: ["<rootDir>/src/"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```

Arquivo `jest.setup.js` para configurações adicionais:

```javascript
import "@testing-library/jest-dom";

// Mock do matchMedia para testes
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock do localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

Object.defineProperty(window, "localStorage", {
  value: new LocalStorageMock(),
});
```

### Cypress

Configurações do Cypress no arquivo `cypress.json`:

```json
{
  "baseUrl": "http://localhost:3000",
  "viewportWidth": 1280,
  "viewportHeight": 720,
  "video": false,
  "screenshotOnRunFailure": true,
  "defaultCommandTimeout": 10000,
  "requestTimeout": 10000
}
```

Comandos personalizados no arquivo `cypress/support/commands.js`:

```javascript
// Login command
Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});

// Get by data-testid
Cypress.Commands.add("getByTestId", (testId) => {
  return cy.get(`[data-testid="${testId}"]`);
});
```

## Boas Práticas de Testes

### 1. Pirâmide de Testes

Seguir a pirâmide de testes para garantir uma cobertura adequada:

- **Base**: Muitos testes unitários (rápidos e focados)
- **Meio**: Alguns testes de integração (verificam interações entre componentes)
- **Topo**: Poucos testes E2E (lentos, mas verificam fluxos completos)

### 2. Padrões de Nomenclatura

- Nomes de testes devem ser descritivos e seguir o padrão "should [expected behavior] when [condition]"
- Agrupar testes relacionados em blocos `describe`
- Usar `it` ou `test` para casos de teste individuais

### 3. Isolamento de Testes

- Cada teste deve ser independente dos outros
- Usar `beforeEach` para configurar o estado inicial
- Usar `afterEach` para limpar após cada teste
- Usar mocks para isolar o código sendo testado

### 4. Testes Determinísticos

- Evitar dependências externas (APIs, bancos de dados)
- Usar dados de teste fixos e previsíveis
- Evitar temporizadores reais (usar `jest.useFakeTimers()`)
- Evitar testes que dependem da ordem de execução

### 5. Cobertura de Testes

- Visar cobertura de código de pelo menos 80%
- Focar em testar comportamentos, não implementações
- Priorizar testes para código crítico e propenso a erros
- Incluir casos de borda e caminhos de erro

## Execução de Testes

### Scripts de Teste

No arquivo `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

### Integração Contínua

Os testes são executados automaticamente em cada push e pull request através do GitHub Actions:

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
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
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
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
      - name: Run E2E tests
        run: npm run test:e2e
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

## Conclusão

A estratégia de testes do Valore-81 é projetada para garantir a qualidade do código e a estabilidade da aplicação. Ao seguir as boas práticas e utilizar as ferramentas adequadas, podemos detectar problemas cedo no ciclo de desenvolvimento e entregar um produto confiável aos usuários.

Lembre-se de que os testes são um investimento na qualidade do software e na produtividade da equipe a longo prazo. Dedique tempo para escrever testes de qualidade e mantenha-os atualizados conforme a aplicação evolui.
