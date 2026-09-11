'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './Footer.module.css';

type ModalType = 'about' | 'privacy' | null;

export function Footer() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const currentYear = new Date().getFullYear();

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Fechar com a tecla Escape e travar o scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (!activeModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal, closeModal]);

  return (
    <>
      <footer className={styles.footerWrap}>
        <div className={styles.island}>
          {/* Badge flutuante: Keep listening */}
          <div className={styles.floatingBadge}>
            <span className={styles.musicIcon} aria-hidden="true">
              <MusicNoteIcon />
            </span>
            <span className={styles.badgeText}>Keep listening.</span>
          </div>

          {/* Branding */}
          <div className={styles.brand}>
            <span className={styles.brandName}>wholehearted</span>
            <span className={styles.brandAccent}>.stats</span>
          </div>

          {/* Tagline */}
          <p className={styles.tagline}>
            Your listening history, beautifully visualized.
          </p>

          {/* Navigation Links */}
          <nav className={styles.nav} aria-label="Links do rodapé">
            <a
              href="https://gitlab.com/caritas-html/spotify-charts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              GitLab
            </a>

            <span className={styles.dot} aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => setActiveModal('about')}
              className={styles.linkButton}
            >
              About
            </button>

            <span className={styles.dot} aria-hidden="true">·</span>

            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className={styles.linkButton}
            >
              Privacy
            </button>

            <span className={styles.dot} aria-hidden="true">·</span>

            <a
              href="https://open.spotify.com/user/12151343803"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Spotify
            </a>
          </nav>

          {/* Copyright */}
          <p className={styles.copyright}>
            &copy; {currentYear} Leo
          </p>
        </div>
      </footer>

      {/* Modal Dialog */}
      {activeModal && (
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          role="presentation"
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 id="modal-title" className={styles.modalTitle}>
                {activeModal === 'about' ? 'Sobre o wholehearted.stats' : 'Privacidade & Dados'}
              </h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Fechar janela"
              >
                <CloseIcon />
              </button>
            </div>

            <div className={styles.modalBody}>
              {activeModal === 'about' ? (
                <>
                  <p>
                    O <strong>wholehearted.stats</strong> é uma plataforma independente de análise e visualização de hábitos musicais contínuos.
                  </p>
                  <p>
                    Construído com foco em autonomia de dados, o sistema cataloga reproduções do Spotify e gera métricas detalhadas de artistas, faixas, sequências de escuta e mapas de calor de atividade ao longo do tempo.
                  </p>
                  <div className={styles.modalBadge}>
                    Stack: Next.js · NestJS · TypeORM · BullMQ · Spotify Web API
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Sua privacidade e o controle sobre seus dados musicais são prioridades essenciais da arquitetura:
                  </p>
                  <ul className={styles.modalList}>
                    <li>
                      <strong>Sem acesso a credenciais sensíveis:</strong> Nunca recebemos nem armazenamos senhas ou dados financeiros da sua conta Spotify.
                    </li>
                    <li>
                      <strong>Criptografia de credenciais:</strong> Tokens de acesso OAuth são armazenados com criptografia simétrica AES-256-GCM.
                    </li>
                    <li>
                      <strong>Apenas histórico de escuta:</strong> Registramos exclusivamente títulos, artistas e timestamps de faixas reproduzidas para construir suas estatísticas.
                    </li>
                    <li>
                      <strong>Controle absoluto:</strong> Você pode desconectar e revogar a permissão a qualquer momento através do painel de aplicativos da sua conta do Spotify.
                    </li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MusicNoteIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
