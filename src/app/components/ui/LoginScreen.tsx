import Link from 'next/link';
import styles from './LoginScreen.module.css';

export function LoginScreen() {
  const loginUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/auth/login`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          wholehearted<span className={styles.accent}>.stats</span>
        </h1>
        <p className={styles.subtitle}>scrobbling via spotify</p>
      </div>

      <div className={styles.actions}>
        <a href={loginUrl} className={styles.button}>
          conectar com spotify
        </a>

        <Link href="/u/leonardo" className={styles.demoLink}>
          ou explore a demo (/u/leonardo) →
        </Link>
      </div>

      <p className={styles.note}>
        suas estatísticas de escuta, seus dados, seu controle.
      </p>
    </div>
  );
}