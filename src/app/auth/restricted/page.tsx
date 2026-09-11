import { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Acesso restrito — wholehearted.stats',
  description: 'Aplicativo em modo de testes limitados pelo Spotify for Developers.',
};

export default function RestrictedAccessPage() {
  const linkedinUrl = 'https://www.linkedin.com/in/leonardolimaalves/';

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link href="/" className={styles.brand}>
          wholehearted<span className={styles.accent}>.stats</span>
        </Link>

        <span className={styles.badge}>modo de testes</span>

        <h1 className={styles.title}>permissões limitadas no spotify</h1>

        <p className={styles.description}>
          esta aplicação está em fase de demonstração restrita devido à cota de usuários
          da api do spotify for developers. para conhecer todas as funcionalidades e visualizações,
          você pode navegar pelo perfil de demonstração ativo.
        </p>

        <div className={styles.actions}>
          <Link href="/u/leonardo" className={styles.primaryButton}>
            conhecer a demo (/u/leonardo)
          </Link>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryLink}
          >
            deseja testar com sua conta? me chame no linkedin ↗
          </a>

          <Link href="/" className={styles.homeLink}>
            ← voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
