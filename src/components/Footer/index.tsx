import Link from 'next/link';
import styles from './footer.module.scss';

interface Post {
  uid?: string;
  data: {
    title: string;
  };
}

interface FooterProps {
  previousPost: Post;
  nextPost: Post;
}

export function Footer({ previousPost, nextPost }: FooterProps): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div
        className={styles.controlButton}
        style={{ visibility: previousPost ? 'visible' : 'hidden' }}
      >
        <Link href={`/post/${previousPost?.uid}`}>
          <a>
            <div className={styles.title}>{previousPost?.data?.title}</div>
            <div className={styles.controlLabel}>Post anterior</div>
          </a>
        </Link>
      </div>
      <div
        className={styles.controlButton}
        style={{ visibility: nextPost ? 'visible' : 'hidden' }}
      >
        <Link href={`/post/${nextPost?.uid}`}>
          <a>
            <div className={styles.title}>{nextPost?.data?.title}</div>
            <div className={styles.controlLabel}>Próximo post</div>
          </a>
        </Link>
      </div>
    </footer>
  );
}
