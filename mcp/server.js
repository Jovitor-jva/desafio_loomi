const { Server } = require('@modelcontextprotocol/sdk/server');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} = require('@modelcontextprotocol/sdk/types');

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class MCPServer {
  constructor() {
    this.server = new Server(
      { name: 'cypress-mcp', version: '1.0.0' },
      { capabilities: { tools: {}, resources: {} } }
    );

    this.testResults = new Map();
    this.setup();
  }

  setup() {
    // LISTAR TOOLS
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'run_test_case',
          description: 'Executa um teste Cypress pelo nome do arquivo',
          inputSchema: {
            type: 'object',
            properties: {
              flow: { type: 'string' }
            },
            required: ['flow']
          }
        },
        {
          name: 'get_element_status',
          description: 'Retorna estado de um elemento',
          inputSchema: {
            type: 'object',
            properties: {
              selector: { type: 'string' },
              url: { type: 'string' }
            },
            required: ['selector']
          }
        }
      ]
    }));

    // EXECUTAR TOOLS
    this.server.setRequestHandler(CallToolRequestSchema, async (req) => {
      const { name, arguments: args } = req.params;

      if (name === 'run_test_case') return this.runTest(args);
      if (name === 'get_element_status') return this.getElement(args);

      throw new Error('Tool não encontrada');
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const resources = [];

      for (const [id, r] of this.testResults) {
        if (r.status === 'failed') {
          resources.push({
            uri: `test://${id}/log`,
            name: `Erro ${id}`,
            mimeType: 'text/plain'
          });

          if (r.screenshot) {
            resources.push({
              uri: `test://${id}/screenshot`,
              name: `Screenshot ${id}`,
              mimeType: 'image/png'
            });
          }
        }
      }

      return { resources };
    });

    // 📌 LER RESOURCE
    this.server.setRequestHandler(ReadResourceRequestSchema, async (req) => {
      const { uri } = req.params;
      const [, id, type] = uri.split('/');

      const result = this.testResults.get(id);
      if (!result) throw new Error('Resultado não encontrado');

      if (type === 'log') {
        return {
          contents: [{ uri, mimeType: 'text/plain', text: result.error }]
        };
      }

      if (type === 'screenshot' && result.screenshot) {
        const file = path.join('cypress/screenshots', result.screenshot);
        const img = fs.readFileSync(file).toString('base64');

        return {
          contents: [{ uri, mimeType: 'image/png', blob: img }]
        };
      }

      throw new Error('Resource inválido');
    });
  }

  // 🚀 RUN TEST
  runTest({ flow }) {
    const id = `${flow}_${Date.now()}`;
    const spec = `cypress/e2e/${flow}`;

    return new Promise((resolve) => {
      exec(`npx cypress run --spec "${spec}"`, (err, stdout, stderr) => {
        const result = {
          status: err ? 'failed' : 'passed',
          logs: stdout,
          error: stderr
        };

        // tenta pegar screenshot simples
        if (err) {
          const dir = 'cypress/screenshots';
          if (fs.existsSync(dir)) {
            const file = fs.readdirSync(dir).find(f => f.includes(flow));
            if (file) result.screenshot = file;
          }
        }

        this.testResults.set(id, result);

        resolve({
          content: [{
            type: 'text',
            text: JSON.stringify({ id, status: result.status }, null, 2)
          }]
        });
      });
    });
  }

  // GET ELEMENT
  getElement({ selector, url = 'https://www.kasa.live' }) {
    const temp = 'cypress/e2e/temp.cy.js';

    const code = `
describe('check', () => {
  it('element', () => {
    cy.visit('${url}');
    cy.get('${selector}').then(el => {
      cy.writeFile('element.json', {
        visible: el.is(':visible'),
        text: el.text()
      });
    });
  });
});
`;

    fs.writeFileSync(temp, code);

    return new Promise((resolve) => {
      exec(`npx cypress run --spec "${temp}" --quiet`, () => {
        let data = { exists: false };

        if (fs.existsSync('element.json')) {
          data = JSON.parse(fs.readFileSync('element.json'));
          fs.unlinkSync('element.json');
        }

        fs.unlinkSync(temp);

        resolve({
          content: [{
            type: 'text',
            text: JSON.stringify(data, null, 2)
          }]
        });
      });
    });
  }

  async start() {
    await this.server.connect(new StdioServerTransport());
    console.error('MCP Server rodando...');
  }
}

new MCPServer().start();