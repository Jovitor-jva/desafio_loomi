// cypress/support/selectors.js
// Seletores reutilizáveis para os testes

export const seletores = {
  // Elementos da página inicial
  corpoDaPagina: 'body',

  // Barra de busca e entrada
  entradaDeBusca: 'input[type="text"], input[type="search"], [class*="search"] input, input[placeholder*="Buscar"], input[placeholder*="Search"], input[aria-label*="Buscar"], input[aria-label*="Search"]',
  containerDeBusca: '[class*="search"]',
  botaoDeBusca: 'button[type="submit"]',
  filtrosDeBusca: '[class*="filter"]',

  // Autenticação e cadastro
  botaoEntrarPerfil: 'button[data-cy="btn-trigger-profile"]',
  botaoCriarConta: 'button[data-cy="login-createAccount"]',
  campoNome: 'input[data-cy="register-name"]',
  campoEmail: 'input[data-cy="register-email"]',
  campoSenha: 'input[data-cy="register-password"]',
  campoConfirmarSenha: 'input[data-cy="register-confirmPassword"]',
  botaoEnviarCadastro: 'button[data-cy="register-submit"]',
  switchGoogleCalendar: 'input[type="checkbox"][aria-label*="Google"], [class*="switch"] input',

  // Navegação e abas
  abaDePartidas: 'button:contains("Partidas")',
  abaDeMelhoresMomentos: 'a:contains("Melhores momentos")',
  menuDeNavegacao: 'nav',
  abaDeCalendario: '[class*="calendar"]',

  // Partidas e cards
  cartaoDePartida: '[class*="card"]',
  containerDePartida: '[class*="match"]',
  emblemaDoTime: 'img[alt*="Escudo"]',
  botaoDeFavorito: '[class*="favorite"]',
  iconeDeFavorito: 'svg[alt*="favorite"]',

  // Informações das partidas
  nomeDaLiga: '[class*="league"]',
  statusDaPartida: 'text=Finalizada',
  placar: '[class*="score"]',
  nomeDoTime: '[class*="team"]',
  horarioDaPartida: '[class*="time"]',

  // Logos e elementos visuais
  logoDoApito: 'svg[alt="Whistle"]',
  logoDoKast: '[class*="logo"]',

  // Botões gerais
  botaoPrimario: 'button[class*="chakra-button"]',
  botaoDoGoogleCalendar: 'button:contains("Google Calendar")',

  // Favoritar times
  linkFavoritos: 'a[data-cy="link/favoritos"]',
  botaoFavoritar: 'button[data-cy="btn-favorite-team"]',
  botaoAddTime: 'button:contains("Add"), button.chakra-button:contains("Add"), button[type="button"].chakra-button',
  botaoConcluir: 'button:contains("Concluir"), [data-cy*="concluir"]',
  primeiroTimeDaLista: '[class*="team"]:first, [class*="match"]:first [class*="team"], .team-item:first',
  botaoDeConectarCalendario: '[class*="connect-calendar"]',

  // Melhores momentos
  reprodutorDeVideo: 'video',
  miniaturaDoVideo: '[class*="thumbnail"]',
  tituloDoVideo: '[class*="video-title"]',
  entradaDeBuscaDeVideo: '[class*="video-search"] input',

  // Calendário
  visualizacaoDoCalendario: '[class*="calendar-view"]',
  eventoDoCalendario: '[class*="calendar-event"]',
  calendarEvent: '[class*="calendar-event"]',
  calendarNotification: '[class*="notification"]',

  // Rodapé e links
  playStoreLink: 'a[href*="play.google"]',
  appStoreLink: 'a[href*="apps.apple"]',
  privacyLink: 'a:contains("Termos de Uso")',
};
