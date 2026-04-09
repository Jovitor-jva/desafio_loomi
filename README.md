
# Projeto de automação de testes para a etapa de desafio técnico

Projeto de automação de testes end-to-end para o site **Kasa.live** usando **Cypress** e **MCP Server**.

## 📋 Descrição

Este projeto implementa testes automatizados para validar as funcionalidades core da plataforma Kasa.live. Inclui um **MCP Server** que expõe as capacidades de automação para integração com modelos de linguagem.

## 🎯 Requisitos Core da Aplicação

A aplicação Kasa.live possui os seguintes requisitos funcionais principais:

### 1. **Carregamento e Navegação**
- Página inicial responsiva e acessível
- Navegação intuitiva entre seções
- Carregamento eficiente de conteúdo

### 2. **Exibição de Partidas**
- Listagem de partidas por liga/campeonato
- Informações detalhadas: times, placar, status
- Elementos visuais: escudos, logos

### 3. **Favoritar Times e Partidas**
- Sistema de favoritos para times
- Marcação de partidas preferidas
- Persistência de preferências do usuário

### 4. **Busca de Partidas**
- Campo de busca funcional
- Filtros por liga, time, data
- Resultados em tempo real

### 5. **Melhores Momentos (Vídeos)**
- Seção dedicada a highlights
- Reprodução de vídeos
- Busca dentro do conteúdo de vídeo

### 6. **Integração com Google Calendar**
- Marcação automática de partidas
- Sincronização de eventos
- Notificações de jogos

## 🎯 Cenários de Testes Implementados

Todos os **18 testes** implementados estão **passando** ✅

### Funcionalidades Básicas (8 testes)
- ✅ **Carregamento da Página** (1 teste)
  - Validar que a página inicial carrega com sucesso
  - Verificar presença de conteúdo na página

- ✅ **Exibição de Partidas** (2 testes)
  - Exibir abas de navegação (Partidas e Melhores Momentos)
  - Exibir informações de liga/campeonato

- ✅ **Detalhes das Partidas** (3 testes)
  - Exibir status das partidas (Finalizada)
  - Exibir escudos dos times
  - Exibir nomes dos times nas partidas

- ✅ **Rodapé e Links** (2 testes)
  - Exibir texto informativo/religioso
  - Exibir versão e copyright

### Funcionalidades Avançadas (10 testes)
- ✅ **Favoritar Times e Partidas** (3 testes)
  - Interface preparada para favoritar partidas
  - Permitir interagir com elementos de time
  - Seção de calendário preparada

- ✅ **Buscar Partidas** (3 testes)
  - Campo de busca disponível
  - Permitir digitar no campo de busca
  - Filtros ou opções de busca disponíveis

- ✅ **Melhores Momentos** (3 testes)
  - Navegar para a aba de melhores momentos
  - Conteúdo preparado para vídeos
  - Permitir navegação na seção

- ✅ **Integração com Google Calendar** (1 teste)
  - Validar que o usuário consegue marcar o switch do Google Calendar

## 📊 Resultados dos Testes

| Métrica | Valor |
|---------|-------|
| **Total de Testes** | 18 |
| **Passou** | 18 |
| **Falhou** | 0 |
| **Duração** | ~45 segundos |
### OBS: O tempo de duração foi obtido a partir da média de tempo em 5 execuções realizadas através do comando **NPX CYPRESS OPEN**. Esse tempo pode variar a depender do hardware utilizado ou se a execução for feita em modo Headless.

## 🤖 MCP Server

Conforme solicitado no desafio foi implementado um contexto simples de **Model Context Protocol (MCP) Server** que permite a integração das capacidades de automação do Cypress com modelos de linguagem.

### O que é MCP?

O **Model Context Protocol (MCP)** é um protocolo aberto que padroniza como aplicações se conectam a modelos de linguagem (LLMs). Ele permite que diferentes ferramentas e fontes de dados sejam integradas de forma consistente com IA, criando um ecossistema extensível.

#### Como funciona o MCP:

1. **Cliente MCP**: Aplicação que se conecta ao servidor (ex: VS Code, Cursor, ou qualquer cliente MCP)
2. **Servidor MCP**: Provedor de ferramentas e recursos (nosso `server.js`)
3. **Protocolo**: Comunicação JSON-RPC 2.0 via stdio (entrada/saída padrão)

### Funcionalidades do MCP Server

#### 🛠️ Tools Disponíveis

1. **`run_test_case`**
   - **Descrição**: Executa um caso de teste Cypress específico
   - **Parâmetros**:
     - `flow`: Nome do arquivo de teste (ex: `"executarTestesPaginaPrincipal.cy.js"`)
     - `options`: Opções adicionais (browser, headless)
   - **Retorno**: Resultado da execução com status, logs e possíveis erros

2. **`get_element_status`**
   - **Descrição**: Obtém o estado atual de um elemento na página
   - **Parâmetros**:
     - `selector`: Seletor CSS do elemento
     - `url`: URL da página (padrão: https://www.kasa.live)
   - **Retorno**: Informações detalhadas sobre o elemento (visibilidade, texto, atributos, etc.)

#### 📄 Resources Disponíveis

Quando um teste falha, o MCP Server automaticamente expõe:

- **Error Logs**: Logs detalhados de erro como resources acessíveis
- **Screenshots**: Capturas de tela dos erros para análise visual

### Como Usar o MCP Server

#### Instalação
```bash
npm install
```

#### Executar o Servidor
```bash
npm run mcp-server
```

#### Configuração MCP
Use o arquivo `mcp-config.json` para configurar o servidor em seu cliente MCP:

```json
{
  "mcpServers": {
    "cypress-automation": {
      "command": "node",
      "args": ["mcp/server.js"],
      "cwd": "."
    }
  }
}
```

#### Exemplos de Uso

**Executar um teste:**
```javascript
// Via MCP tool call
{
  "name": "run_test_case",
  "arguments": {
    "flow": "executarTestesPaginaPrincipal.cy.js",
    "options": {
      "browser": "chrome",
      "headless": true
    }
  }
}
```

**Verificar estado de um elemento:**
```javascript
{
  "name": "get_element_status",
  "arguments": {
    "selector": "[data-cy='btn-trigger-profile']",
    "url": "https://www.kasa.live"
  }
}

## 🚀 Como Executar

### Pré-requisitos
- Node.js v24.14.1 ou superior
- npm v11.11.0 ou superior

### Instalação
```bash
npm install
```

### Executar Testes
```bash
# Executar todos os testes
npm test

# Ou executar diretamente com Cypress
npx cypress run --spec "cypress/e2e/executarTestesPaginaPrincipal.cy.js"

# Executar em modo interativo (GUI)
npx cypress open
```
## 🛠️ Tecnologias Utilizadas

- **Node.js** v24.14.1
- **npm** 11.11.0
- **Cypress** 13.17.0
- **JavaScript** (ES6+)

## 📦 Estrutura do Projeto

```
desafio_loomi/
├── cypress/
│   ├── e2e/
│   │   └── executarTestesPaginaPrincipal.cy.js  # Arquivo principal de testes
│   ├── spec/
│   │   └── testesPaginaPrincipal.js             # Funções helper e lógica de testes
│   ├── support/
│   │   └── seletores.js                         # Centralização de seletores CSS
│   ├── screenshots/                             # Capturas de testes com falha
│   └── videos/                                  # Gravações de testes
├── mcp/
│   └── server.js                                # MCP Server para integração com LLMs
├── mcp-config.json                              # Configuração do MCP Server
├── package.json
├── cypress.config.js
├── README.md
└── .gitignore
```
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js v18+ instalado
- npm v11+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Jovitor-jva/desafio_loomi.git
cd desafio_loomi

# Instale as dependências
npm install
```

### Executar Testes

```bash
# Modo headless (sem interface gráfica)
npm test

# Modo com interface gráfica
npm test -- --headed

# Modo interativo (Cypress UI)
npm run cypress:open
```

## 📁 Arquivos Principais

### `cypress/e2e/homePage.cy.js`
Arquivo principal de testes que valida todos os cenários mapeados:
- Carregamento da página
- Exibição de partidas e detalhes
- Funcionalidades de favoritar, busca e vídeos
- Integração com calendário

### `cypress/support/selectors.js`
Centraliza todos os seletores CSS com nomes em português para facilitar manutenção e legibilidade.

### `cypress/spec/testesPaginaPrincipal.js`
Funções auxiliares reutilizáveis para testes, organizadas por funcionalidade.

## 🔧 Configuração

O projeto está configurado em `cypress.config.js`:
- **Base URL**: https://www.kasa.live/
- **Browser**: Electron (padrão do Cypress)
- **Viewport**: 1280x720
- **Timeouts**: Configurados para estabilidade

## 📝 Padrões de Teste

Os testes seguem o padrão BDD (Behavior Driven Development) do Cypress:

```javascript
describe('Página Inicial - Kasa.live', () => {
  beforeEach(() => {
    cy.visit('/', { timeout: 10000 });
  });

  it('Deve carregar com sucesso', () => {
    cy.get(selectors.corpoDaPagina).should('be.visible');
  });
});
```

## 👤 Autor

João Vitor Lima da Silva - Analista de qualidade de software

---

**Última atualização**: Abril, 2026
