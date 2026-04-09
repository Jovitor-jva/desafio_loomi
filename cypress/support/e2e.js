// cypress/support/e2e.js
// Este arquivo é carregado antes dos testes e2e
// Use-o para configurações globais do Cypress

// Exemplo de comando customizado (opcional)
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/');
  // Adicionar lógica de login aqui, se necessário
});
