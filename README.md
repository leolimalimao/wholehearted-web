# 🎵 Wholehearted.stats

Dashboard pessoal de estatísticas de escuta musical, alimentado por dados reais do Spotify. Cada música ouvida é registrada automaticamente e transformada em visualizações interativas.

**Produção:** https://spotify-lastfm-web.vercel.app

---

## O que é isso

Uma alternativa pessoal ao Last.fm — com dados próprios, visual próprio e sem depender de terceiros pra guardar seu histórico de escuta.

O dashboard mostra em tempo real (atualizado a cada 5 minutos) o que você ouviu, quando ouviu, quais artistas dominam sua escuta e em que horas do dia você mais ouve música.

---

## Visualizações

| Componente | Descrição |
|---|---|
| **Waveform** | Barras animadas representando scrobbles por dia — elemento hero do dashboard |
| **Top Faixas** | Gráfico de barras horizontal com as músicas mais ouvidas no período |
| **Top Artistas** | Grid de cards com contagem de plays por artista |
| **Timeline** | Gráfico de linha com evolução de scrobbles ao longo do tempo |
| **Heatmap de horas** | Barras por hora do dia mostrando padrão de escuta |
| **Feed recente** | Lista das últimas músicas ouvidas com capa, artista e timestamp relativo |

Todos os gráficos respondem ao seletor de período: `7d` / `30d` / `3m` / `6m` / `1a` / `tudo`.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 + TypeScript |
| Estilo | CSS Modules + CSS Custom Properties |
| Gráficos | Nivo (bar, line) |
| Animações | Framer Motion |
| Data fetching | TanStack React Query |
| Deploy | Vercel |

---

## Design

Paleta construída em torno do universo sonoro — violeta elétrico como cor de destaque, fundo quase preto com leve matiz roxo, tipografia tripartite:

```css
--color-bg:      #0A0A0F   /* fundo base */
--color-surface: #13131A   /* cards */
--color-accent:  #6C63FF   /* violeta — destaque principal */
--color-text:    #E8E8F0   /* texto */
--color-muted:   #6B6B80   /* secundário */

--font-display:  'Space Grotesk'   /* títulos e números */
--font-body:     'Inter'           /* texto corrido */
--font-mono:     'JetBrains Mono'  /* dados, timestamps, labels */
```

---

## Open Graph

A URL do dashboard gera automaticamente uma imagem de preview (1200×630) com stats reais ao ser compartilhada em redes sociais. A imagem inclui total de scrobbles, top artista, top faixa e uma waveform dos últimos 30 dias.

---

## Rodando localmente

### Pré-requisitos
- Node.js 20+
- Backend rodando em `http://127.0.0.1:3001`

### Setup

```bash
git clone https://gitlab.com/caritas-html/wholehearted-stats-web
cd wholehearted-stats-web
npm install
```

Cria o `.env.local` na raiz:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Inicia o servidor:

```bash
npm run dev
```

Acessa `http://localhost:3000`.

---

## Variáveis de ambiente (produção)

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API backend |
| `NEXT_PUBLIC_SITE_URL` | URL pública do frontend (para Open Graph) |

---

## Repositórios

| Projeto | URL |
|---|---|
| API (backend) | https://gitlab.com/caritas-html/wholehearted-stats-api |
| Web (frontend) | https://gitlab.com/caritas-html/wholehearted-stats-web |

---

## Produção

| Serviço | Plataforma | URL |
|---|---|---|
| Frontend | Vercel | https://spotify-lastfm-web.vercel.app |
| Backend | Railway | https://spotify-lastfm-api-production.up.railway.app |
| Banco de dados | Neon (PostgreSQL) | — |
| Cache / Filas | Upstash (Redis) | — |