import styles from './footer.module.scss';

interface FooterProps {
  previousPost: string;
  nextPost: string;
}

export function Footer({ previousPost, nextPost }: FooterProps): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.controlButton}>
        <div className={styles.title}>{previousPost}</div>
        <div className={styles.controlLabel}>Post anterior</div>
      </div>
      <div className={styles.controlButton}>
        <div className={styles.title}>{nextPost}</div>
        <div className={styles.controlLabel}>Próximo post</div>
      </div>
    </footer>
  );
}
