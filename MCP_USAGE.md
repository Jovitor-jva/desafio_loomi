# Exemplos de Uso do MCP Server Cypress

Este arquivo demonstra como usar as ferramentas e resources do MCP Server para automação de testes Cypress.

## 📋 Visão Geral do MCP Server

O servidor implementa o **Model Context Protocol (MCP)**, um padrão aberto para conectar ferramentas e dados a modelos de linguagem. O servidor expõe duas ferramentas principais e resources dinâmicos baseados em resultados de teste.

### Arquitetura
- **Protocolo**: JSON-RPC 2.0 via stdio
- **Linguagem**: Node.js com SDK MCP
- **Tools**: 2 ferramentas para execução de testes e inspeção de elementos
- **Resources**: Logs de erro e screenshots gerados dinamicamente

## 🛠️ Ferramentas Disponíveis

### 1. run_test_case
Executa um caso de teste específico do Cypress.

**Exemplo de chamada:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "run_test_case",
    "arguments": {
      "flow": "executarTestesPaginaPrincipal.cy.js",
      "options": {
        "browser": "electron",
        "headless": true
      }
    }
  }
}
```

**Resposta esperada:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"testId\": \"executarTestesPaginaPrincipal.cy.js_1703123456789\",\n  \"status\": \"passed\",\n  \"summary\": \"Teste executado com sucesso\",\n  \"logs\": \"...\",\n  \"error\": null,\n  \"screenshot\": null\n}"
      }
    ]
  }
}
```

### 2. get_element_status
Verifica o estado atual de um elemento na página.

**Exemplo de chamada:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_element_status",
    "arguments": {
      "selector": "[data-cy='btn-trigger-profile']",
      "url": "https://www.kasa.live"
    }
  }
}
```

**Resposta esperada:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"exists\": true,\n  \"visible\": true,\n  \"text\": \"Entrar\",\n  \"tagName\": \"BUTTON\",\n  \"className\": \"chakra-button css-ncw165\",\n  \"id\": \"\",\n  \"attributes\": {\n    \"data-cy\": \"btn-trigger-profile\",\n    \"type\": \"button\"\n  }\n}"
      }
    ]
  }
}
```

## 📄 Resources Disponíveis

Quando um teste falha, o servidor automaticamente cria resources para análise:

### Error Logs
- **URI**: `cypress://test-results/{testId}/error-log`
- **Tipo**: `text/plain`
- **Conteúdo**: Log detalhado do erro

### Screenshots
- **URI**: `cypress://test-results/{testId}/screenshot`
- **Tipo**: `image/png`
- **Conteúdo**: Captura de tela em base64

**Como acessar um resource:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": {
    "uri": "cypress://test-results/executarTestesPaginaPrincipal.cy.js_1703123456789/error-log"
  }
}
```

## 🔄 Fluxo de Trabalho Típico

1. **Listar ferramentas disponíveis**
2. **Executar um teste** usando `run_test_case`
3. **Se o teste falhar**, verificar resources disponíveis
4. **Analisar logs de erro** e screenshots
5. **Verificar estado de elementos** usando `get_element_status`
6. **Ajustar seletores ou lógica** conforme necessário

## ⚙️ Configuração

Para usar este MCP Server, configure-o em seu cliente MCP:

```json
{
  "mcpServers": {
    "cypress-automation": {
      "command": "node",
      "args": ["mcp/server.js"],
      "cwd": "/caminho/para/seu/projeto"
    }
  }
}
```

## 🚀 Executando o Servidor

```bash
# Instalar dependências
npm install

# Executar o servidor MCP
npm run mcp-server
```