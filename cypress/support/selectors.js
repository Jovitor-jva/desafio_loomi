// cypress/support/selectors.js
// Seletores reutilizáveis para os testes

export const selectors = {
  // Elementos da página inicial
  pageBody: 'body',

  // Barra de busca e entrada
  searchInput: 'input[type="text"]',
  searchContainer: '[class*="search"]',
  searchButton: 'button[type="submit"]',
  searchFilters: '[class*="filter"]',

  // Navegação e abas
  partiesTab: 'button:contains("Partidas")',
  bestMomentsTab: 'a:contains("Melhores momentos")',
  navigationMenu: 'nav',
  calendarTab: '[class*="calendar"]',

  // Partidas e cards
  matchCard: '[class*="card"]',
  matchContainer: '[class*="match"]',
  teamBadge: 'img[alt*="Escudo"]',
  favoriteButton: '[class*="favorite"]',
  favoriteIcon: 'svg[alt*="favorite"]',

  // Informações das partidas
  leagueName: '[class*="league"]',
  matchStatus: 'text=Finalizada',
  score: '[class*="score"]',
  teamName: '[class*="team"]',
  matchTime: '[class*="time"]',

  // Logos e elementos visuais
  whistelLogo: 'svg[alt="Whistle"]',
  kastLogo: '[class*="logo"]',

  // Botões gerais
  primaryButton: 'button[class*="chakra-button"]',
  googleCalendarButton: 'button:contains("Google Calendar")',
  connectCalendarButton: '[class*="connect-calendar"]',

  // Melhores momentos
  videoPlayer: 'video',
  videoThumbnail: '[class*="thumbnail"]',
  videoTitle: '[class*="video-title"]',
  videoSearchInput: '[class*="video-search"] input',

  // Calendário
  calendarView: '[class*="calendar-view"]',
  calendarEvent: '[class*="calendar-event"]',
  calendarNotification: '[class*="notification"]',

  // Rodapé e links
  playStoreLink: 'a[href*="play.google"]',
  appStoreLink: 'a[href*="apps.apple"]',
  privacyLink: 'a:contains("Termos de Uso")',
};
