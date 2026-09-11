import { describe, it } from 'node:test';
import assert from 'node:assert';
import { isPlaybackActive, formatRelativeTime, ONLINE_THRESHOLD_MS } from './scrobble-status';

describe('scrobble-status', () => {
  const BASE_TIME = new Date('2026-09-11T12:00:00.000Z').getTime();

  describe('isPlaybackActive', () => {
    it('deve retornar false se playedAt for nulo ou indefinido', () => {
      assert.strictEqual(isPlaybackActive(undefined, BASE_TIME), false);
      assert.strictEqual(isPlaybackActive(null, BASE_TIME), false);
      assert.strictEqual(isPlaybackActive('', BASE_TIME), false);
    });

    it('deve retornar false se o timestamp for inválido', () => {
      assert.strictEqual(isPlaybackActive('data-invalida', BASE_TIME), false);
    });

    it('deve retornar true quando a música foi tocada há menos de 10 minutos', () => {
      // 2 minutos atrás
      const playedAt2Min = new Date(BASE_TIME - 2 * 60 * 1000).toISOString();
      assert.strictEqual(isPlaybackActive(playedAt2Min, BASE_TIME), true);

      // 9 minutos e 59 segundos atrás
      const playedAt9Min59s = new Date(BASE_TIME - (9 * 60 * 1000 + 59000)).toISOString();
      assert.strictEqual(isPlaybackActive(playedAt9Min59s, BASE_TIME), true);
    });

    it('deve retornar false quando a música foi tocada há 10 minutos ou mais', () => {
      // Exatos 10 minutos atrás
      const playedAt10Min = new Date(BASE_TIME - 10 * 60 * 1000).toISOString();
      assert.strictEqual(isPlaybackActive(playedAt10Min, BASE_TIME), false);

      // 4 horas atrás (caso da captura de tela do usuário)
      const playedAt4Hours = new Date(BASE_TIME - 4 * 60 * 60 * 1000).toISOString();
      assert.strictEqual(isPlaybackActive(playedAt4Hours, BASE_TIME), false);
    });

    it('deve respeitar threshold customizado se fornecido', () => {
      const playedAt3Min = new Date(BASE_TIME - 3 * 60 * 1000).toISOString();
      const customThreshold = 2 * 60 * 1000; // 2 minutos
      assert.strictEqual(isPlaybackActive(playedAt3Min, BASE_TIME, customThreshold), false);
    });
  });

  describe('formatRelativeTime', () => {
    it('deve retornar "agora" para diferenças menores que 2 minutos', () => {
      const justNow = new Date(BASE_TIME - 30 * 1000).toISOString();
      assert.strictEqual(formatRelativeTime(justNow, BASE_TIME), 'agora');
    });

    it('deve retornar minutos para menos de 1 hora', () => {
      const minutesAgo = new Date(BASE_TIME - 25 * 60 * 1000).toISOString();
      assert.strictEqual(formatRelativeTime(minutesAgo, BASE_TIME), '25min atrás');
    });

    it('deve retornar horas para menos de 24 horas', () => {
      const hoursAgo = new Date(BASE_TIME - 4 * 60 * 60 * 1000).toISOString();
      assert.strictEqual(formatRelativeTime(hoursAgo, BASE_TIME), '4h atrás');
    });
  });
});
