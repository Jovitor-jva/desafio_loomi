import { seletores } from './seletores.js';

/**
 * Gera um nome de usuário fictício para cadastro
 */
function gerarNomeUsuario() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `Usuario${timestamp}${randomSuffix}`;
}

/**
 * Comando customizado para fazer login/cadastro
 * @param {string} email - E-mail do usuário
 * @param {string} password - Senha do usuário
 * @param {string} nome - Nome do usuário (opcional, será gerado se não fornecido)
 */
Cypress.Commands.add('login', (email, password, nome = null) => {
  const nomeUsuario = nome || gerarNomeUsuario();

  // Visitar a página inicial
  cy.visit('/', { timeout: 15000 });

  // Aguardar página carregar completamente
  cy.get('body').should('exist');

  // Aguardar que o botão "Entrar" esteja disponível (com retry automático)
  cy.get(seletores.botaoEntrarPerfil, { timeout: 10000 }).should('exist').should('be.visible');

  // Clicar no botão "Entrar" para abrir o popover de login
  cy.get(seletores.botaoEntrarPerfil).click({ force: true });

  // Aguardar o popover abrir
  cy.wait(2000);

  // Clicar no botão "Criar conta"
  cy.get(seletores.botaoCriarConta, { timeout: 10000 }).should('be.visible').click({ force: true });

  // Aguardar o formulário de cadastro aparecer
  cy.wait(2000);

  // Preencher campo de nome
  cy.get(seletores.campoNome, { timeout: 10000 }).first().should('be.visible').clear().type(nomeUsuario);

  // Preencher campo de e-mail
  cy.get(seletores.campoEmail, { timeout: 10000 }).first().should('be.visible').clear().type(email);

  // Preencher campo de senha
  cy.get(seletores.campoSenha, { timeout: 10000 }).first().should('be.visible').clear().type(password);

  // Preencher campo de confirmação de senha
  cy.get(seletores.campoConfirmarSenha, { timeout: 10000 }).first().should('be.visible').clear().type(password);

  // Aguardar um momento antes de clicar no botão de envio
  cy.wait(1000);

  // Clicar no botão de enviar/criar conta (submit button)
  cy.get('button[data-cy="register-submit"]', { timeout: 10000 }).should('be.visible').click({ force: true });

  // Clicar novamente no botão "Criar conta" como confirmação (pode ser um modal de confirmação)
  cy.get('button[type="submit"][data-cy="register-submit"]', { timeout: 10000 }).should('be.visible').click({ force: true });

  // Aguardar criação da conta
  cy.wait(3000);

  // Validar que o cadastro foi bem-sucedido procurando por indicadores de perfil autenticado
  cy.contains(/perfil|minha conta|sair|logout/i, { timeout: 15000 }).should('exist');
});
