
// Importações necessárias para o MCP Server
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Classe principal do servidor MCP para Cypress
class CypressMCPServer {
  constructor() {
    // Inicializar o servidor MCP com nome e versão
    this.server = new Server(
      {
        name: 'cypress-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    // Configurar os handlers para as diferentes operações MCP
    this.setupHandlers();
    // Mapa para armazenar resultados de testes (usado para criar resources dinâmicos)
    this.testResults = new Map();
  }

  // Método para configurar todos os handlers de requisições MCP
  setupHandlers() {
    // Handler para listar todas as tools disponíveis
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'run_test_case',
            description: 'Executa um caso de teste Cypress específico. Aceita o nome do fluxo (ex: "login", "checkout") e retorna o resultado do teste.',
            inputSchema: {
              type: 'object',
              properties: {
                flow: {
                  type: 'string',
                  description: 'Nome do fluxo de teste a ser executado (ex: "executarTestesPaginaPrincipal.cy.js")'
                },
                options: {
                  type: 'object',
                  description: 'Opções adicionais para execução do teste',
                  properties: {
                    browser: {
                      type: 'string',
                      description: 'Navegador a ser usado (electron, chrome, firefox)',
                      default: 'electron'
                    },
                    headless: {
                      type: 'boolean',
                      description: 'Executar em modo headless',
                      default: true
                    }
                  }
                }
              },
              required: ['flow']
            }
          },
          {
            name: 'get_element_status',
            description: 'Obtém o estado atual de um elemento na página usando um seletor CSS.',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'Seletor CSS do elemento a ser verificado'
                },
                url: {
                  type: 'string',
                  description: 'URL da página a ser visitada',
                  default: 'https://www.kasa.live'
                }
              },
              required: ['selector']
            }
          }
        ]
      };
    });

    // Handler para executar tools específicas
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      // Roteamento baseado no nome da tool
      switch (name) {
        case 'run_test_case':
          return await this.runTestCase(args);
        case 'get_element_status':
          return await this.getElementStatus(args);
        default:
          throw new Error(`Tool não encontrada: ${name}`);
      }
    });

    // Handler para listar resources disponíveis (gerados dinamicamente)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = [];

      // Percorrer todos os resultados de teste armazenados
      for (const [testId, result] of this.testResults) {
        // Só criar resources para testes que falharam
        if (result.status === 'failed') {
          // Resource para log de erro
          resources.push({
            uri: `cypress://test-results/${testId}/error-log`,
            name: `Log de erro - ${testId}`,
            description: `Log detalhado do erro do teste ${testId}`,
            mimeType: 'text/plain'
          });

          // Resource para screenshot, se existir
          if (result.screenshot) {
            resources.push({
              uri: `cypress://test-results/${testId}/screenshot`,
              name: `Screenshot - ${testId}`,
              description: `Screenshot do erro do teste ${testId}`,
              mimeType: 'image/png'
            });
          }
        }
      }

      return { resources };
    });

    // Handler para ler conteúdo de resources específicos
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {

      switch (name) {
        case 'run_test_case':
          return await this.runTestCase(args);
        case 'get_element_status':
          return await this.getElementStatus(args);
        default:
          throw new Error(`Tool não encontrada: ${name}`);
      }
    });

    // Listar resources disponíveis
    // Handler para listar resources disponíveis (gerados dinamicamente)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = [];

      // Percorrer todos os resultados de teste armazenados
      for (const [testId, result] of this.testResults) {
        // Só criar resources para testes que falharam
        if (result.status === 'failed') {
          // Resource para log de erro
          resources.push({
            uri: `cypress://test-results/${testId}/error-log`,
            name: `Log de erro - ${testId}`,
            description: `Log detalhado do erro do teste ${testId}`,
            mimeType: 'text/plain'
          });

          // Resource para screenshot, se existir
          if (result.screenshot) {
            resources.push({
              uri: `cypress://test-results/${testId}/screenshot`,
              name: `Screenshot - ${testId}`,
              description: `Screenshot do erro do teste ${testId}`,
              mimeType: 'image/png'
            });
          }
        }
      }

      return { resources };
    });

    // Handler para ler conteúdo de resources específicos
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      // Verificar se é um resource de resultado de teste
      if (uri.startsWith('cypress://test-results/')) {
        const parts = uri.split('/');
        const testId = parts[3];
        const resourceType = parts[4];

        // Buscar o resultado do teste no mapa
        const result = this.testResults.get(testId);
        if (!result) {
          throw new Error(`Resultado de teste não encontrado: ${testId}`);
        }

        // Retornar log de erro
        if (resourceType === 'error-log') {
          return {
            contents: [{
              uri,
              mimeType: 'text/plain',
              text: result.error || 'Erro não disponível'
            }]
          };
        }
        // Retornar screenshot em base64
        else if (resourceType === 'screenshot') {
          if (!result.screenshot) {
            throw new Error(`Screenshot não disponível para o teste: ${testId}`);
          }

          // Construir caminho do arquivo de screenshot
          const screenshotPath = path.join(process.cwd(), 'cypress', 'screenshots', result.screenshot);
          if (fs.existsSync(screenshotPath)) {
            // Ler arquivo e converter para base64
            const imageData = fs.readFileSync(screenshotPath);
            return {
              contents: [{
                uri,
                mimeType: 'image/png',
                blob: imageData.toString('base64')
              }]
            };
          } else {
            throw new Error(`Screenshot não encontrado: ${screenshotPath}`);
          }
        }
      }

      throw new Error(`Resource não encontrado: ${uri}`);
    });
  }

  // Método para executar um caso de teste Cypress
  async runTestCase(args) {
    const { flow, options = {} } = args;
    // Criar ID único para o teste baseado no nome e timestamp
    const testId = `${flow}_${Date.now()}`;

    return new Promise((resolve) => {
      // Construir caminho do arquivo de teste
      const specPath = `cypress/e2e/${flow}`;
      // Comando base do Cypress
      let command = `npx cypress run --spec "${specPath}"`;

      // Adicionar opções do navegador se especificadas
      if (options.browser) {
        command += ` --browser ${options.browser}`;
      }

      // Adicionar opção para modo não-headless se especificado
      if (options.headless === false) {
        command += ' --headed';
      }

      // Executar o comando Cypress
      exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
        // Preparar resultado do teste
        const result = {
          status: error ? 'failed' : 'passed',
          logs: stdout,
          error: stderr,
          timestamp: new Date().toISOString()
        };

        // Procurar por screenshot se o teste falhou
        if (error) {
          const screenshotsDir = path.join(process.cwd(), 'cypress', 'screenshots');
          if (fs.existsSync(screenshotsDir)) {
            // Listar arquivos de screenshot
            const screenshotFiles = fs.readdirSync(screenshotsDir);
            // Encontrar screenshot relacionado ao teste
            const testScreenshot = screenshotFiles.find(file => file.includes(flow.replace('.cy.js', '')));
            if (testScreenshot) {
              result.screenshot = testScreenshot;
            }
          }
        }

        // Armazenar resultado para uso posterior nos resources
        this.testResults.set(testId, result);

        // Retornar resposta formatada para o cliente MCP
        resolve({
          content: [{
            type: 'text',
            text: JSON.stringify({
              testId,
              status: result.status,
              summary: result.status === 'passed' ? 'Teste executado com sucesso' : 'Teste falhou',
              logs: result.logs.substring(0, 500) + (result.logs.length > 500 ? '...' : ''),
              error: result.error ? result.error.substring(0, 500) + (result.error.length > 500 ? '...' : '') : null,
              screenshot: result.screenshot || null
            }, null, 2)
          }]
        });
      });
    });
  }

  // Método para obter o status de um elemento na página
  async getElementStatus(args) {
    const { selector, url = 'https://www.kasa.live' } = args;

    // Criar caminho para arquivo temporário de teste
    const tempSpecPath = path.join(process.cwd(), 'cypress', 'e2e', 'temp_element_check.cy.js');

    // Criar conteúdo do teste temporário que verifica o elemento
    const specContent = `
describe('Verificação Dinâmica de Elemento', () => {
  it('Verificar estado do elemento: ${selector}', () => {
    cy.visit('${url}');
    cy.get('${selector}').then($element => {
      const elementInfo = {
        exists: true,
        visible: $element.is(':visible'),
        text: $element.text().trim(),
        tagName: $element.prop('tagName'),
        className: $element.attr('class') || '',
        id: $element.attr('id') || '',
        attributes: {}
      };

      // Capturar alguns atributos importantes
      const importantAttrs = ['type', 'placeholder', 'value', 'href', 'src', 'alt', 'data-cy'];
      importantAttrs.forEach(attr => {
        const value = $element.attr(attr);
        if (value) {
          elementInfo.attributes[attr] = value;
        }
      });

      cy.writeFile('element_status.json', elementInfo);
    });
  });
});
`;

    // Escrever arquivo temporário
    fs.writeFileSync(tempSpecPath, specContent);

    return new Promise((resolve) => {
      // Executar teste temporário em modo quiet
      exec(`npx cypress run --spec "${tempSpecPath}" --quiet`, { cwd: process.cwd() }, (error, stdout, stderr) => {
        // Valor padrão se elemento não for encontrado
        let elementInfo = { exists: false, error: 'Elemento não encontrado' };

        try {
          // Tentar ler arquivo de resultado gerado pelo teste
          const statusFile = path.join(process.cwd(), 'element_status.json');
          if (fs.existsSync(statusFile)) {
            elementInfo = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
            // Limpar arquivo temporário após uso
            fs.unlinkSync(statusFile);
          }
        } catch (e) {
          elementInfo.error = `Erro ao ler status do elemento: ${e.message}`;
        }

        // Limpar arquivo de spec temporário
        if (fs.existsSync(tempSpecPath)) {
          fs.unlinkSync(tempSpecPath);
        }

        // Retornar informações do elemento
        resolve({
          content: [{
            type: 'text',
            text: JSON.stringify(elementInfo, null, 2)
          }]
        });
      });
    });
  }

  // Método para iniciar o servidor MCP
  async start() {
    // Configurar transporte stdio para comunicação com cliente MCP
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Cypress MCP Server iniciado');
  }
}

// Inicializar e iniciar o servidor
const server = new CypressMCPServer();
server.start().catch(console.error);
