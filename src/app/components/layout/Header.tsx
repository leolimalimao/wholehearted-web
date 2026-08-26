import { Container } from './Container';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <p className={styles.title}>
          Wholehearted<span className={styles.accent}>.stats</span>
        </p>
        <p className={styles.subtitle}>scrobbling via spotify</p>
      </Container>
    </header>
  );
}