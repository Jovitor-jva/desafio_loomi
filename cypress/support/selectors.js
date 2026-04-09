// cypress/support/selectors.js
// Seletores reutilizáveis para os testes

export const selectors = {
  // Elementos da página inicial
  pageBody: 'body',
  
  // Barra de busca e entrada
  searchInput: 'input[type="text"]',
  searchContainer: '[class*="search"]',
  
  // Navegação e abas
  partiesTab: 'button:contains("Partidas")',
  bestMomentsTab: 'a:contains("Melhores momentos")',
  navigationMenu: 'nav',
  
  // Partidas e cards
  matchCard: '[class*="card"]',
  matchContainer: '[class*="match"]',
  teamBadge: 'img[alt*="Escudo"]',
  
  // Informações das partidas
  leagueName: '[class*="league"]',
  matchStatus: 'text=Finalizada',
  score: '[class*="score"]',
  teamName: '[class*="team"]',
  
  // Logos e elementos visuais
  whistelLogo: 'svg[alt="Whistle"]',
  kastLogo: '[class*="logo"]',
  
  // Botões gerais
  primaryButton: 'button[class*="chakra-button"]',
  
  // Rodapé e links
  playStoreLink: 'a[href*="play.google"]',
  appStoreLink: 'a[href*="apps.apple"]',
  privacyLink: 'a:contains("Termos de Uso")',
};
