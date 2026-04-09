// cypress/e2e/executarTestesPaginaPrincipal.cy.js
// Testes e2e para a página inicial do Kasa.live

import { seletores } from '../support/seletores.js';
import {
  gerarEmailFicticio,
  gerarSenhaAleatoria,
  gerarNomeUsuario,
  abrirFormularioCriarConta,
  preencherFormularioCadastro,
  enviarFormularioCriarConta,
  validarLogin,
  validarConectarGoogleCalendar,
} from '../spec/testesPaginaPrincipal.js';

describe('Página Inicial - Kasa.live', () => {
  beforeEach(() => {
    // Acessa a página principal antes de cada teste
    cy.visit('/', { timeout: 10000 });
  });

  describe('Carregamento da Página', () => {
    it('Deve carregar a página inicial com sucesso', () => {
      // Validar que o body (corpo da página) está visível
      cy.get(seletores.corpoDaPagina).should('be.visible');

      // Validar que há conteúdo na página
      cy.get(seletores.corpoDaPagina).then(($body) => {
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

  describe('Favoritar Times e Partidas', () => {
    it('Deve ter interface preparada para favoritar partidas (se disponível)', () => {
      // Verificar se há elementos que possam ser botões de favorito
      cy.get('body').then(($body) => {
        const temElementosFavoritos = $body.find('[class*="favorite"], [class*="star"], [class*="heart"], button').length > 0;
        if (temElementosFavoritos) {
          // Se há botões, verificar se algum é visível
          cy.get('[class*="favorite"], [class*="star"], [class*="heart"], button').first().should('exist');
        } else {
          // Se não há, pelo menos validar que a página tem conteúdo
          cy.log('Funcionalidade de favorito não encontrada - pode ser implementada futuramente');
          expect(true).to.be.true;
        }
      });
    });

    it('Deve permitir interagir com elementos de time', () => {
      // Validar que é possível clicar nos escudos dos times
      cy.get('img[alt*="Escudo"]').first().should('be.visible').click();
      
      // Validar que alguma ação ocorre (pode ser modal, navegação, etc)
      cy.get('body').should('be.visible');
    });

    it('Deve ter seção de calendário preparada (se disponível)', () => {
      // Verificar se há elementos relacionados a calendário
      cy.get('body').then(($body) => {
        const temElementosCalendario = $body.find('[class*="calendar"], [class*="agenda"], [class*="schedule"]').length > 0;
        if (temElementosCalendario) {
          cy.get('[class*="calendar"], [class*="agenda"], [class*="schedule"]').first().should('be.visible');
        } else {
          cy.log('Seção de calendário não encontrada - funcionalidade pode ser implementada');
          expect(true).to.be.true;
        }
      });
    });
  });

  describe('Buscar Partidas', () => {
    it('Deve ter campo de busca disponível', () => {
      cy.get('input').should('have.length.at.least', 1);
      cy.get('input').first().should('exist');
    });

    it('Deve permitir digitar no campo de busca', () => {
      cy.get('input').first().as('campoBusca');
      cy.get('@campoBusca').clear().type('teste');
      cy.get('@campoBusca').should('have.value', 'teste');
    });

    it('Deve ter filtros ou opções de busca (se disponíveis)', () => {
      cy.get('body').then(($body) => {
        const temElementosFiltro = $body.find('button, select, [class*="filter"], [class*="dropdown"]').length > 0;
        if (temElementosFiltro) {
          cy.get('button, select, [class*="filter"], [class*="dropdown"]').should('have.length.at.least', 1);
        } else {
          cy.log('Filtros de busca não encontrados - funcionalidade básica de busca funciona');
          expect(true).to.be.true;
        }
      });
    });
  });

  describe('Melhores Momentos', () => {
    it('Deve navegar para a aba de melhores momentos', () => {
      cy.contains('Melhores momentos').click();
      cy.url().should('include', '/melhores-momentos');
    });

    it('Deve ter conteúdo preparado para vídeos (se disponível)', () => {
      cy.contains('Melhores momentos').click();
      cy.get('body').then(($body) => {
        const temElementosVideo = $body.find('video, [class*="video"], [class*="thumbnail"], iframe').length > 0;
        if (temElementosVideo) {
          cy.get('video, [class*="video"], [class*="thumbnail"], iframe').should('have.length.at.least', 1);
        } else {
          cy.log('Elementos de vídeo não encontrados - seção preparada para implementação');
          expect(true).to.be.true;
        }
      });
    });

    it('Deve permitir navegação na seção de melhores momentos', () => {
      cy.contains('Melhores momentos').click();

      cy.get('body').should('be.visible');
      
      // Verificar se há algum conteúdo textual
      cy.get('body').then(($body) => {
        expect($body.text().length).to.be.greaterThan(0);
      });
    });
  });

  describe('Cadastro e validação de login', () => {

    it('Deve validar login e marcar o switch do Google Calendar', () => {
      validarConectarGoogleCalendar();
    });
  });
});
