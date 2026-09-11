import styles from './AuroraBackground.module.css';

export function AuroraBackground() {
  return (
    <div className={styles.auroraContainer} aria-hidden="true">
      <div className={styles.blobsWrapper}>
        <div className={`${styles.blob} ${styles.blobViolet}`} />
        <div className={`${styles.blob} ${styles.blobMagenta}`} />
        <div className={`${styles.blob} ${styles.blobIndigo}`} />
        <div className={`${styles.blob} ${styles.blobEmerald}`} />
      </div>
      <div className={styles.noiseOverlay} />
    </div>
  );
}
