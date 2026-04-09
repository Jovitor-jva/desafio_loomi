
# Kasa.live - Automação de Testes E2E com Cypress

Projeto de automação de testes end-to-end para o site **Kasa.live** usando **Cypress**.

## 📋 Descrição

Este projeto implementa testes automatizados para validar a funcionalidade da plataforma Kasa.live, um agregador de partidas de futebol em tempo real. Todos os testes estão passando e seguem as melhores práticas de automação.

## 🎯 Testes Implementados

- ✅ **Carregamento de Página**: Validar que a página inicial carrega com sucesso
- ✅ **Exibição de Partidas**: Verificar que as abas e partidas estão visíveis
- ✅ **Informações de Ligas**: Validar ligações e campeonatos exibidos
- ✅ **Detalhes de Partidas**: Testar exibição de times, escudos e status
- ✅ **Rodapé**: Validar informações de copyright e versão

## 🛠️ Tecnologias Utilizadas

- **Node.js** v24.14.1
- **npm** 11.11.0
- **Cypress** 13.17.0
- **JavaScript** (ES6+)

## 📦 Estrutura do Projeto

```
desafio_loomi/
├── cypress/
│   ├── e2e/
│   │   └── homePage.cy.js           # Testes e2e da página inicial
│   ├── spec/
│   │   └── homePage.js              # Funções auxiliares
│   ├── support/
│   │   ├── e2e.js                   # Configuração global
│   │   └── selectors.js             # Seletores centralizados
│   ├── screenshots/                 # Capturas de testes com falha
│   └── config.js                    # Configuração do Cypress
├── mcp/
│   └── server.js
├── package.json
├── pom.xml                          # Configuração Maven
├── cypress.config.js
├── .gitignore
└── README.md
```

## 🚀 Como Rodar

### Pré-requisitos

- Node.js v18+ instalado
- npm v11+

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/desafio_loomi.git
cd desafio_loomi

# Instale as dependências
npm install
```

### Executar Testes

```bash
# Modo headless (sem interface gráfica)
npm test

# Modo com interface gráfica
npm test -- --headed

# Modo interativo (Cypress UI)
npm run cypress:open
```

## 📊 Resultados dos Testes

Todos os **8 testes** implementados estão **passando** ✅

| Métrica | Valor |
|---------|-------|
| **Total de Testes** | 8 |
| **Passou** | 8 |
| **Falhou** | 0 |
| **Duração** | ~20 segundos |

## 📁 Arquivos Principais

### `cypress/e2e/homePage.cy.js`
Arquivo principal de testes que valida:
- Carregamento da página
- Exibição de partidas
- Detalhes das partidas
- Informações do rodapé

### `cypress/support/selectors.js`
Centraliza todos os seletores CSS para facilitar manutenção

### `cypress/spec/homePage.js`
Funções auxiliares reutilizáveis para testes

## 🔧 Configuração

O projeto está configurado em `cypress.config.js`:
- **Base URL**: https://www.kasa.live/
- **Browser**: Electron (padrão do Cypress)
- **Viewport**: 1280x720

## 📝 Padrões de Teste

Os testes seguem o padrão BDD (Behavior Driven Development) do Cypress:

```javascript
describe('Página Inicial - Kasa.live', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Deve carregar com sucesso', () => {
    cy.get('body').should('be.visible');
  });
});
```

## 🌐 Links Úteis

- [Cypress Documentation](https://docs.cypress.io)
- [Kasa.live](https://www.kasa.live/)
- [Node.js](https://nodejs.org/)

## 📄 Licença

Este projeto é fornecido como está para fins educacionais e de automação de testes.

## 👤 Autor

Desafio Loomi - Automação e Testes

---

**Última atualização**: Abril, 2026
