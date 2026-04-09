// cypress/e2e/homePage.cy.js
// Testes e2e para a página inicial do Kasa.live

import { selectors } from '../support/selectors.js';

describe('Página Inicial - Kasa.live', () => {
  beforeEach(() => {
    // Acessa a página principal antes de cada teste
    cy.visit('/', { timeout: 10000 });
  });

  describe('Carregamento da Página', () => {
    it('Deve carregar a página inicial com sucesso', () => {
      // Validar que o body (corpo da página) está visível
      cy.get(selectors.pageBody).should('be.visible');
      
      // Validar que há conteúdo na página
      cy.get(selectors.pageBody).then(($body) => {
        expect($body.text().length).to.be.greaterThan(0);
      });
    });
  });

  describe('Exibição de Partidas', () => {
    it('Deve exibir as abas de navegação (Partidas e Melhores Momentos)', () => {
      // Validar aba de Partidas
      cy.contains('Partidas').should('be.visible');
      
      // Validar aba de Melhores Momentos
      cy.contains('Melhores momentos').should('be.visible');
    });

    it('Deve exibir informações de liga/campeonato', () => {
      // Validar que nome da liga está visível
      cy.contains('MLS').should('be.visible');
      
      // Validar que há também outras ligas
      cy.contains('Premier League').should('be.visible');
    });
  });

  describe('Detalhes das Partidas', () => {
    it('Deve exibir o status das partidas (Finalizada)', () => {
      // Validar status de partida
      cy.contains('Finalizada').should('be.visible');
    });

    it('Deve exibir escudos dos times', () => {
      // Validar que há imagens de escudos
      cy.get('img[alt*="Escudo"]').should('have.length.at.least', 2);
      
      // Validar que as imagens estão visíveis
      cy.get('img[alt*="Escudo"]').first().should('be.visible');
    });

    it('Deve exibir nomes dos times nas partidas', () => {
      // Validar que há nomes de times visíveis
      cy.contains(/\b(Minnesota Utd|Inter Miami CF|Toronto FC|DC United)\b/)
        .should('be.visible');
    });
  });

  describe('Rodapé e Links', () => {
    it('Deve exibir texto informativo/religioso', () => {
      // Validar mensagem no rodapé
      cy.contains(/Porque Deus amou/i).should('exist');
    });

    it('Deve exibir versão e copyright', () => {
      // Scroll para o final da página
      cy.get('body').scrollTo('bottom');
      
      // Validar copyright
      cy.contains(/© 2022 Kasa.live/i).should('exist');
      
      // Validar versão
      cy.contains(/v3.1-Web/i).should('exist');
    });
  });
});
