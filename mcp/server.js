
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
app.use(express.json());

// Run Cypress test
app.post('/run_test_case', (req, res) => {
  const flow = req.body.flow || 'kasa.cy.js';

  exec(`npx cypress run --spec cypress/e2e/${flow}`, (error, stdout, stderr) => {
    if (error) {
      return res.json({
        status: 'failed',
        error: stderr,
      });
    }

    res.json({
      status: 'passed',
      logs: stdout
    });
  });
});

// Get element status using Cypress via script
app.post('/get_element_status', (req, res) => {
  const selector = req.body.selector;

  const script = `
    const { defineConfig } = require('cypress');
    const cypress = require('cypress');

    cypress.run({
      config: {
        baseUrl: 'https://www.kasa.live'
      },
      spec: 'cypress/e2e/temp.cy.js'
    });
  `;

  fs.writeFileSync('tempRunner.js', script);

  res.json({
    message: "Use Cypress spec para validar elemento dinamicamente"
  });
});

app.listen(3000, () => console.log('MCP Cypress rodando'));
