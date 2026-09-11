'use client';

import React from 'react';
import Link from 'next/link';
import styles from './BrandLogo.module.css';

interface BrandLogoProps {
  isOnline?: boolean;
}

const BRAND_NAME = 'wholehearted';
const BRAND_ACCENT = '.stats';

export function BrandLogo({ isOnline = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={styles.brand}
      aria-label="wholehearted.stats — Voltar ao início"
    >
      {/* Símbolo: Coração + Micro-Waveform */}
      <span className={styles.symbolWrap} aria-hidden="true">
        <svg
          className={styles.heartIcon}
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#6C63FF" />
            </linearGradient>
          </defs>
          <path
            className={styles.heartPath}
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          />
        </svg>

        {/* Micro Waveform musical */}
        <span className={styles.waveform}>
          <span className={`${styles.waveBar} ${styles.bar1}`} />
          <span className={`${styles.waveBar} ${styles.bar2}`} />
          <span className={`${styles.waveBar} ${styles.bar3}`} />
        </span>
      </span>

      {/* Texto com animação Staggered Wave */}
      <span className={styles.textWrap} aria-hidden="true">
        <span className={styles.brandName}>
          {BRAND_NAME.split('').map((char, index) => (
            <span
              key={`name-${index}`}
              className={styles.char}
              style={{ '--char-index': index } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </span>
        <span className={styles.brandAccent}>
          {BRAND_ACCENT.split('').map((char, index) => (
            <span
              key={`accent-${index}`}
              className={styles.char}
              style={{ '--char-index': BRAND_NAME.length + index } as React.CSSProperties}
            >
              {char}
            </span>
          ))}
        </span>
      </span>

      {/* Indicador de status de reprodução do usuário */}
      <span
        className={`${styles.statusDot} ${isOnline ? styles.statusDotOnline : styles.statusDotOffline}`}
        title={isOnline ? 'Online — ouvindo agora' : 'Offline — sem reprodução ativa'}
        aria-hidden="true"
      />
    </Link>
  );
}
