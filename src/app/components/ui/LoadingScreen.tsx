import styles from './LoadingScreen.module.css';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'carregando...' }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>
        wholehearted<span className={styles.accent}>.stats</span>
      </p>
      <div className={styles.bar} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}