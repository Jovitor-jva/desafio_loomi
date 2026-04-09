// cypress/spec/testesPaginaPrincipal.js
// Funções auxiliares e seletores para os testes da página principal
// Nota: Os testes principais estão em cypress/e2e/homePage.cy.js

import { seletores } from '../support/seletores.js';

/* Visita a página inicial da aplicação Kasa.live */
export function visitarPaginaInicial() {
  cy.visit('/', { timeout: 10000 });
}

/* Valida se o conteúdo da página foi carregado corretamente, bem como se o corpo da página está visível e contém texto */
export function validarConteudoDaPagina() {
  cy.get(seletores.corpoDaPagina).should('be.visible');
  cy.get(seletores.corpoDaPagina).then(($body) => {
    expect($body.text().length).to.be.greaterThan(0);
  });
}

/* Valida se os elementos de navegação estão presentes na página Verifica menu de navegação e botões disponíveis */
export function validarNavegacaoExiste() {
  cy.get(seletores.menuDeNavegacao).should('exist');
  cy.get('button').first().should('be.visible');
}

/*Verifica se existe input do tipo texto para busca*/
export function validarCampoDeBusca() {
  cy.get(seletores.entradaDeBusca).first().should('exist');
  cy.get(seletores.entradaDeBusca).first().should('have.attr', 'type', 'text');
}

/* Valida se as partidas estão sendo exibidas na página Verifica presença das abas de navegação e cartões de partida */
export function validarExibicaoDePartidas() {
  cy.contains('Partidas').should('be.visible');
  cy.contains('Melhores momentos').should('be.visible');
  cy.get(seletores.cartaoDePartida).should('have.length.at.least', 1);
}

/* Valida os detalhes das partidas exibidas na página Verifica nome da liga, status da partida e escudos dos times */
export function validarDetalhesDaPartida() {
  cy.contains('MLS').should('be.visible');
  cy.contains('Finalizada').should('be.visible');
  cy.get('img[alt*="Escudo"]').should('have.length.at.least', 2);
}

/* Valida o rodapé da página Verifica presença de direitos autorais e versão da aplicação */
export function validarRodape() {
  cy.get('body').scrollTo('bottom');
  cy.contains(/© 2022 Kasa.live/i).should('exist');
  cy.contains(/v3.1-Web/i).should('exist');
}

// ========== FUNÇÕES PARA FUNCIONALIDADES CORE DA APLICAÇÃO ==========

/**
 * Realiza busca de partidas usando o campo de busca
 * @param {string} termoDeBusca - Termo a ser pesquisado
 */
export function buscarPartidas(termoDeBusca) {
  cy.get(seletores.entradaDeBusca).first().clear().type(termoDeBusca);
  cy.get(seletores.botaoDeBusca).click();
}

/* Favorita a primeira partida exibida na lista de partidas e clica no botão de favorito para marcar a partida como favorita */ 
export function favoritarPartida() {
  cy.get(seletores.botaoDeFavorito).first().click();
}

/* Navega para a seção de melhores momentos clicando na aba correspondente */
export function navegarParaMelhoresMomentos() {
  cy.contains('Melhores momentos').click();
}

/**
 * Realiza busca dentro da seção de melhores momentos
 * @param {string} termoDeBusca - Termo a ser pesquisado nos vídeos
 */
export function buscarMelhoresMomentos(termoDeBusca) {
  cy.get(seletores.entradaDeBuscaDeVideo).clear().type(termoDeBusca);
}

/* Reproduz o primeiro vídeo disponível na seção de melhores momentos
Clica na miniatura do vídeo para iniciar a reprodução */
export function reproduzirVideo() {
  cy.get(seletores.miniaturaDoVideo).first().click();
}

/**
 * Gera um e-mail fictício válido para cadastro
 * Sempre usa o domínio gmail.com para evitar autenticação externa
 */
export function gerarEmailFicticio() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `usuario${timestamp}${randomSuffix}@gmail.com`;
}

/**
 * Gera uma senha aleatória entre 6 e 12 caracteres
 * A senha contém letras maiúsculas, minúsculas e números
 */
export function gerarSenhaAleatoria() {
  const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const tamanho = Math.floor(Math.random() * 7) + 6;
  return Array.from({ length: tamanho }, () => caracteres.charAt(Math.floor(Math.random() * caracteres.length))).join('');
}

/**
 * Gera um nome de usuário fictício para cadastro
 */
export function gerarNomeUsuario() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `Usuario${timestamp}${randomSuffix}`;
}

/**
 * Abre o fluxo de criação de conta clicando em Entrar e depois Criar conta
 * Estratégia com force click para lidar com popover que se fecha
 */
export function abrirFormularioCriarConta() {
  // Clicar no botão "Entrar" para abrir o popover
  cy.contains('Entrar').should('be.visible').click({ force: true });
  
  // Aguardar brevemente e clicar no botão "Criar conta" com force para contornar visibility hidden
  cy.wait(500);
  cy.contains('Criar conta').click({ force: true });
  
  // Aguardar o formulário de cadastro aparecer
  cy.get('body').should($body => {
    expect($body.text()).to.include('Nome') || expect($body.text()).to.include('Email');
  });
}

/**
 * Preenche o formulário de cadastro com nome, e-mail e senha
 * @param {string} nome - Nome do usuário
 * @param {string} email - E-mail gerado para cadastro
 * @param {string} senha - Senha gerada para cadastro
 */
export function preencherFormularioCadastro(nome, email, senha) {
  cy.get(seletores.campoNome).first().should('be.visible').clear().type(nome);
  cy.get(seletores.campoEmail).first().should('be.visible').clear().type(email);
  cy.get(seletores.campoSenha).first().should('be.visible').clear().type(senha);
  // Para confirmar senha, pegar o segundo campo de senha
  cy.get(seletores.campoConfirmarSenha).eq(1).should('be.visible').clear().type(senha);
}

/**
 * Envia o formulário de criação de conta após preenchimento
 */
export function enviarFormularioCriarConta() {
  cy.contains('Criar conta').should('be.visible').click({ force: true });
}

/**
 * Valida o login de um usuário existente usando e-mail e senha
 * @param {string} email - E-mail do usuário
 * @param {string} senha - Senha do usuário
 */
export function validarLogin(email, senha) {
  cy.get(seletores.botaoEntrarPerfil).should('be.visible').click();
  cy.get(seletores.campoEmail).first().should('be.visible').clear().type(email);
  cy.get(seletores.campoSenha).first().should('be.visible').clear().type(senha);
  cy.contains('button', /Entrar|Login|Acessar/i, { timeout: 10000 }).click({ force: true });
  cy.contains(/perfil|minha conta|sair|logout/i, { timeout: 10000 }).should('exist');
}

/* Valida a funcionalidade de conectar ao Google Calendar após login*/
export function validarConectarGoogleCalendar() {
  // Aguardar o popover abrir e marcar o switch
  cy.get(seletores.switchGoogleCalendar).should('exist').check({ force: true }).should('be.checked').click( { force: true } );
}

