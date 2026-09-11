# Plano: Animated Aurora Background & Glassmorphism

## Contexto e Motivação
A interface atual utiliza um fundo estático escuro (`--color-bg: #0A0A0F`) e cartões com preenchimento 100% opaco (`--color-surface: #13131A`).
O objetivo é implementar uma estética atmosférica no estilo "Apple / Linear / Vercel", inspirada em visualização musical orgânica (aurora boreal suave e fluida em movimento contínuo), mantendo o desempenho cravado em 60–120 FPS sem onerar a CPU nem a thread principal de JavaScript.

## Decisão Arquitetural
- **Técnica:** Blobs HTML animados puramente via CSS Compositor (`transform: translate3d(...) rotate(...)` e `will-change: transform`).
  - *Por que não Canvas/WebGL:* Elimina complexidade de shaders, mantém zero dependências adicionais no bundle e evita manter um loop contínuo de `requestAnimationFrame` na GPU.
  - *Por que não animação de gradients via CSS properties:* Animar paradas de gradiente ou `background-position` força repaints do viewport inteiro a cada quadro, causando quedas bruscas de taxa de quadros em resoluções maiores.
- **Durações Assíncronas:** Durações de animação usando tempos primos (ex: 26s, 34s, 41s, 31s) para evitar padrões repetitivos visíveis de vai-e-vem.
- **Dithering / Anti-Banding:** Overlay de ruído monocromático sutil via SVG data-uri para eliminar bandas de gradiente (banding) em monitores de 8 bits.
- **Acessibilidade:** Desativação automática da movimentação via `@media (prefers-reduced-motion: reduce)`.

---

## Fases de Execução

### Fase 1: Componente AuroraBackground e Estilos GPU
- **Arquivos:**
  - `src/app/components/layout/AuroraBackground.tsx`
  - `src/app/components/layout/AuroraBackground.module.css`
- **Entrega:**
  - Componente isolado com contêiner fixo (`position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: -1`).
  - 4 blobs com cores da paleta (Violeta `#6C63FF`, Magenta `#D946EF`, Azul/Índigo `#3B82F6`, Esmeralda sutil `#10B981`).
  - Filtro de desfoque pesado (`blur(90px)`) em camada isolada da GPU.
  - Camada de ruído/grão sutil.

### Fase 2: Integração no Root Layout
- **Arquivos:**
  - `src/app/layout.tsx`
- **Entrega:**
  - Inclusão do `<AuroraBackground />` no layout global para garantir persistência entre navegações sem remontar o DOM.

### Fase 3: Translucidez e Glassmorphism nos Cards
- **Arquivos:**
  - `src/app/globals.css`
  - `src/app/components/ui/StatCard.module.css`
  - `src/app/components/layout/Header.module.css`
  - `src/app/components/charts/*.module.css` (conforme necessário)
- **Entrega:**
  - Atualização da variável de superfície para translucidez (`rgba(19, 19, 26, 0.70)`).
  - Adição de `backdrop-filter: blur(16px)` para refratar a aurora sutilmente por trás dos cartões de métricas e gráficos.
  - Preservação do alto contraste de tipografia para leitura confortável das estatísticas.

### Fase 4: Validação e Documentação
- **Entrega:**
  - Validação de build (`npm run build`).
  - Validação de ausência de repaints e fluidez de rolagem.
  - Atualização do `README.md` refletindo a nova identidade visual e decisão arquitetural.
