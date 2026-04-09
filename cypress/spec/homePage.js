// cypress/spec/homePage.js
// Funções auxiliares e seletores para os testes de homePage
// Nota: Os testes principais estão em cypress/e2e/homePage.cy.js

import { selectors } from '../support/selectors.js';

// Funções auxiliares para validações comuns
export function visitHomePage() {
  cy.visit('/', { timeout: 10000 });
}

export function validatePageContent() {
  cy.get(selectors.pageBody).should('be.visible');
  cy.get(selectors.pageBody).then(($body) => {
    expect($body.text().length).to.be.greaterThan(0);
  });
}

export function validateNavigationExists() {
  cy.get(selectors.navigationMenu).should('exist');
  cy.get('button').first().should('be.visible');
}

export function validateSearchInput() {
  cy.get(selectors.searchInput).first().should('exist');
  cy.get(selectors.searchInput).first().should('have.attr', 'type', 'text');
}

export function validateMatchesDisplay() {
  cy.contains('Partidas').should('be.visible');
  cy.contains('Melhores momentos').should('be.visible');
  cy.get(selectors.matchCard).should('have.length.at.least', 1);
}

export function validateMatchDetails() {
  cy.contains('MLS').should('be.visible');
  cy.contains('Finalizada').should('be.visible');
  cy.get('img[alt*="Escudo"]').should('have.length.at.least', 2);
}

export function validateFooter() {
  cy.get('body').scrollTo('bottom');
  cy.contains(/© 2022 Kasa.live/i).should('exist');
  cy.contains(/v3.1-Web/i).should('exist');
}