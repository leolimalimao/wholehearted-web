export const ONLINE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutos em milissegundos

/**
 * Determina se uma faixa foi tocada recentemente o suficiente para caracterizar
 * um estado "Online / Ouvindo agora".
 *
 * @param playedAt Timestamp ISO 8601 do último scrobble gravado
 * @param now Timestamp base de comparação (padrão: Date.now(), injetável para testes puros)
 * @param thresholdMs Janela de tolerância em ms (padrão: 10 minutos)
 */
export function isPlaybackActive(
  playedAt?: string | null,
  now = Date.now(),
  thresholdMs = ONLINE_THRESHOLD_MS,
): boolean {
  if (!playedAt) return false;

  const playedTime = new Date(playedAt).getTime();
  if (Number.isNaN(playedTime)) return false;

  const diffMs = now - playedTime;

  // Tolerância para desvio de relógio (clock skew) de até 1 minuto no futuro
  if (diffMs < -60000) return false;

  return diffMs < thresholdMs;
}

/**
 * Retorna uma representação amigável do tempo decorrido desde a reprodução.
 *
 * @param playedAt Timestamp ISO 8601
 * @param now Timestamp base de comparação (padrão: Date.now())
 */
export function formatRelativeTime(
  playedAt?: string | null,
  now = Date.now(),
): string {
  if (!playedAt) return '';

  const date = new Date(playedAt);
  const playedTime = date.getTime();
  if (Number.isNaN(playedTime)) return '';

  const diffMs = Math.max(0, now - playedTime);
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffH / 24);

  if (diffMin < 2) return 'agora';
  if (diffMin < 60) return `${diffMin}min atrás`;
  if (diffH < 24) return `${diffH}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}
