# 🎵 Wholehearted.stats

Dashboard de estatísticas de escuta musical com perfis públicos, alimentado por dados reais do Spotify. Cada música ouvida é registrada automaticamente e transformada em visualizações interativas.

**Produção:** https://wholehearted-stats.vercel.app/u/leonardo

---

## O que é isso

Uma alternativa pessoal ao Last.fm — com dados próprios, visual próprio e sem depender de terceiros para guardar seu histórico de escuta.

Cada usuário tem um perfil público em `/u/[slug]` com seus stats reais: scrobbles registrados, top artistas, top faixas, atividade por hora do dia e evolução ao longo do tempo. O dashboard é acessível por qualquer visitante sem login — o dono do perfil vê um botão de logout e tem acesso ao dashboard completo e interativo.

> ⚠️ O app está em Development Mode no Spotify (limite de 5 usuários). Para testar com sua própria conta, entre em contato.

---

## Arquitetura de autenticação

O fluxo de login usa o backend como intermediário — o browser nunca toca diretamente na Spotify API:

```
Browser → Next.js (/api/*) → Railway (NestJS) → Spotify API
                ↑
         Proxy via rewrites
         Cookie first-party
         Sem bloqueio SameSite
```

As chamadas de API passam pelo Next.js via `rewrites` — isso torna o cookie de sessão first-party (mesmo domínio da Vercel) e elimina os problemas de `SameSite` em aba anônima e navegadores mais restritivos.

---

## Visualizações

| Componente | Dado | Lib |
|---|---|---|
| **Waveform** | Scrobbles por dia — elemento hero animado | Framer Motion |
| **Top Faixas** | Músicas mais ouvidas no período | Nivo Bar |
| **Top Artistas** | Grid de cards com play count | Framer Motion |
| **Timeline** | Evolução de scrobbles ao longo do tempo | Nivo Line |
| **Heatmap de horas** | Intensidade por hora do dia | Nivo Bar |
| **Feed recente** | Últimas músicas com capa e timestamp relativo | Next/Image |

Todos os gráficos respondem ao seletor de período: `7d` / `30d` / `3m` / `6m` / `1a` / `tudo`.

---

## Stack

| Camada | Tecnologia | Decisão |
|---|---|---|
| Framework | Next.js 16 + TypeScript | SSR para Open Graph, App Router, rewrites de proxy |
| Estilo | CSS Modules + CSS Custom Properties | Zero runtime, escopo por componente, theming nativo |
| Gráficos | Nivo | D3 encapsulado, visual mais autoral que Recharts |
| Animações | Framer Motion | Stagger nas barras da waveform, 3D tilt com física de mola nos stat cards |
| Data fetching | TanStack React Query | Cache, staleTime, enabled condicional |
| Deploy | Vercel | Next.js nativo, Edge Network, Open Graph via ImageResponse |

---

## Decisões de design

**Por que CSS Modules em vez de Tailwind?**
Tailwind acelera a iteração mas tem uma "cara" reconhecível. CSS Modules com Custom Properties dão controle total do sistema visual sem runtime overhead — cada token de cor, tipografia e espaçamento é uma variável CSS nativa, alterável via JavaScript sem re-render.

**Por que Nivo em vez de Recharts?**
Nivo é construído sobre D3 com uma API React idiomática. Permite customização profunda de cores, tooltips e layout sem sair do JSX — o heatmap de horas usa intensidade de cor baseada no valor (não uma cor fixa), o que seria mais trabalhoso no Recharts.

**A Waveform como elemento de identidade:**
As barras do hero não são decorativas — representam scrobbles reais por dia do período selecionado. Quando o usuário troca o range, as barras se animam via Framer Motion com stagger. É o gráfico de timeline renderizado como identidade visual.

**Open Graph dinâmico por perfil:**
Cada URL `/u/[slug]` gera uma imagem 1200×630 com stats reais via `next/og` — total de scrobbles, top artista, top faixa e waveform com dados reais. O `generateMetadata` roda no servidor do Next.js via Server Components, sem depender de autenticação.

**`enabled` condicional no React Query:**
Queries de stats só disparam após o `useAuth` confirmar sessão ativa — evita 401s desnecessários ao carregar a página sem autenticação e elimina o flash de erro antes da LoginScreen aparecer.

---

## Estrutura

```
src/
  app/
    layout.tsx          → QueryProvider, metadados globais
    page.tsx            → raiz: redirect pra /u/[slug] se autenticado
    dashboard.tsx       → verifica auth e redireciona
    og/route.tsx        → imagem Open Graph 1200×630
    u/[slug]/
      page.tsx          → Server Component: busca perfil, gera OG
      ProfileDashboard  → Client Component: dashboard interativo
      profile.module.css
  components/
    layout/             → Container, Header, QueryProvider
    charts/             → Waveform, TopTracksChart, TopArtistsChart,
                          TimelineChart, ActivityHeatmap
    ui/                 → StatCard, TrackRow, RangeSelector,
                          LoadingScreen, LoginScreen, LogoutButton
  hooks/
    useAuth.ts          → verifica sessão via /auth/me
    useStats.ts         → React Query hooks com enabled condicional
  lib/
    api.ts              → fetcher com credentials: include
    types.ts            → tipos TypeScript dos dados
```

---

## Design tokens

```css
--color-bg:      #0A0A0F   /* fundo — quase preto com matiz roxo */
--color-surface: #13131A   /* cards e painéis */
--color-border:  #1E1E2E   /* bordas sutis */
--color-accent:  #6C63FF   /* violeta elétrico — destaque principal */
--color-text:    #E8E8F0   /* texto principal */
--color-muted:   #6B6B80   /* texto secundário, labels */

--font-display:  'Space Grotesk'   /* números grandes, títulos */
--font-body:     'Inter'           /* texto corrido */
--font-mono:     'JetBrains Mono'  /* dados, timestamps, play counts */
```

O violeta foi escolhido pelo universo sonoro — frequência, sinestesia. Não é o verde do Spotify (evitar o "clone" visual) nem o ácido genérico de dashboard.

---

## Rodando localmente

### Pré-requisitos
- Node.js 20+
- Backend rodando em `http://127.0.0.1:3001`

```bash
git clone https://gitlab.com/caritas-html/wholehearted-stats-web
cd wholehearted-stats-web
npm install
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BACKEND_URL=http://127.0.0.1:3001
```

```bash
npm run dev
```

Acessa `http://127.0.0.1:3000`.

---

## Variáveis de ambiente (produção)

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | `/api` (proxy via rewrites) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend |
| `BACKEND_URL` | URL do Railway (usada nos rewrites — não exposta ao browser) |

---

## Repositórios

| Projeto | URL |
|---|---|
| API (backend) | https://gitlab.com/caritas-html/spotify-charts |
| Web (frontend) | https://gitlab.com/caritas-html/spotify-lastfm-web |

## Produção

| Serviço | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | https://spotify-lastfm-web.vercel.app |
| Backend | Railway | https://spotify-lastfm-api-production.up.railway.app |
| Banco de dados | Neon (PostgreSQL) | — |
| Cache / Filas | Railway (Redis) | — |