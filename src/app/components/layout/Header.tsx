'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BrandLogo } from './BrandLogo';
import { LogoutButton } from '../ui/LogoutButton';
import styles from './Header.module.css';

interface HeaderProps {
  slug?: string; // quando presente, exibe ações de perfil
  isOnline?: boolean;
}

export function Header({ slug, isOnline = false }: HeaderProps) {
  const { data: auth } = useAuth();
  const isOwner = auth?.authenticated && auth.slug === slug;
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Branding */}
        <BrandLogo isOnline={isOnline} />

        {/* Actions */}
        {slug && (
          <div className={styles.actions}>
            <button
              id="header-copy-link-btn"
              className={`${styles.actionBtn} ${copied ? styles.actionBtnSuccess : ''}`}
              onClick={copyLink}
              aria-label={copied ? 'Link copiado!' : 'Copiar link do perfil'}
            >
              {copied ? (
                <>
                  <CheckIcon />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <ShareIcon />
                  <span>Compartilhar</span>
                </>
              )}
            </button>

            {isOwner && (
              <div className={styles.logoutWrap}>
                <LogoutButton />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function ShareIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}