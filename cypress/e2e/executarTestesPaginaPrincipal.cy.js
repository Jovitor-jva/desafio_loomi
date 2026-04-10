// cypress/e2e/executarTestesPaginaPrincipal.cy.js
// Testes e2e para a página inicial do Kasa.live

import {
  gerarEmailFicticio,
  gerarSenhaAleatoria,
  gerarNomeUsuario,
  abrirFormularioCriarConta,
  preencherFormularioCadastro,
  enviarFormularioCriarConta,
  validarLogin,
  validarConectarGoogleCalendar,
  navegarParaFavoritos,
  fazerLoginENavegarParaFavoritos,
  favoritarTime,
  validarTimeFavoritado,
  testarFluxoCompletoFavoritarTime,
  fazerLogout,
  validarTextoInformativoRodape,
  validarConteudoDaPagina,
  validarAbasDeNavegacao,
  validarInformacoesDeLiga,
  validarStatusDasPartidasVisiveis,
  validarEscudosDosTimesVisiveis,
  validarNomesDosTimesVisiveis,
  validarRodape,
  buscarEventoEspecificoNoCalendario,
  validarInteracaoComElementosDeTime,
  validarCampoDeBuscaDisponivel,
  validarInputDeBuscaDigitavel,
  validarFiltrosOuOpcoesDeBusca,
  validarNavegacaoParaMelhoresMomentos,
  validarConteudoDeVideoNaSecaoMelhoresMomentos,
  validarNavegacaoEmMelhoresMomentos,
} from '../spec/testesPaginaPrincipal.js';

describe('Validar a visualização da página principal', () => {
  beforeEach(() => {
    // Gerar credenciais para login
    const email = gerarEmailFicticio();
    const senha = gerarSenhaAleatoria();
    const nome = gerarNomeUsuario();

    // Visitar a página inicial
    cy.visit('/', { timeout: 15000 });

    // Verificar se o usuário já está logado
    // Se o botão "Entrar" não estiver visível, o usuário já está logado
    cy.get('body').then(($body) => {
      const botaoEntrarExiste = $body.find('button[data-cy="btn-trigger-profile"]').length > 0;
      
      if (botaoEntrarExiste) {
        // Botão "Entrar" está visível, fazer login
        cy.login(email, senha, nome);
      } else {
        // Usuário já está logado, não precisa fazer login novamente
        cy.log('Usuário já está logado, pulando fluxo de login');
      }
    });
  });

  describe('Carregamento da Página', () => {
    it('Deve carregar a página inicial com sucesso', () => {
      validarConteudoDaPagina();
    });
  });

  describe('Validar a exibição de Partidas', () => {
    it('Deve exibir as abas de navegação (Partidas e Melhores Momentos)', () => {
      validarAbasDeNavegacao();
    });

    it('Deve exibir informações de liga/campeonato', () => {
      validarInformacoesDeLiga();
    });
  });

  describe('Validar a exibição dos detalhes das Partidas', () => {
    it('Deve exibir o status das partidas e garantir que esteja visível', () => {
      validarStatusDasPartidasVisiveis();
    });

    it('Deve exibir escudos dos times', () => {
      validarEscudosDosTimesVisiveis();
    });

    it('Deve exibir nomes dos times nas partidas', () => {
      validarNomesDosTimesVisiveis();
    });
  });

  describe('Validar a exibição do rodapé e Links', () => {

    it('Deve exibir versão e copyright', () => {
      validarTextoInformativoRodape();
    });
  });

  describe('Validar a funcionalidade de favoritar e interagir com elementos de times ', () => {
    it('Deve permitir favoritar um time após login (fluxo completo)', () => {
      // Testa o fluxo completo: login → navegação → favoritar → validação
      favoritarTime();
    });
    it('Deve permitir interagir com elementos de time', () => {
      validarInteracaoComElementosDeTime();
    });

    it('Deve buscar um evento específico no calendário', () => {
      buscarEventoEspecificoNoCalendario();
    });
  });

  describe('Buscar Partidas', () => {
    it('Deve ter campo de busca disponível', () => {
      validarCampoDeBuscaDisponivel();
    });

    it('Deve permitir digitar no campo de busca', () => {
      validarInputDeBuscaDigitavel();
    });

    it('Deve ter filtros ou opções de busca (se disponíveis)', () => {
      validarFiltrosOuOpcoesDeBusca();
    });
  });

  describe('Melhores Momentos', () => {
    it('Deve navegar para a aba de melhores momentos', () => {
      validarNavegacaoParaMelhoresMomentos();
    });

    it('Deve ter conteúdo preparado para vídeos (se disponível)', () => {
      validarConteudoDeVideoNaSecaoMelhoresMomentos();
    });

    it('Deve permitir navegação na seção de melhores momentos', () => {
      validarNavegacaoEmMelhoresMomentos();
    });
  });

  describe('Validar o switch de integração com Google Calendar', () => {

    it('Deve validar login e marcar o switch do Google Calendar', () => {
      validarConectarGoogleCalendar();
    });
  });
});
