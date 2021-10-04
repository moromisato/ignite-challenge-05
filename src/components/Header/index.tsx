import styles from './header.module.scss';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Header() {
  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <img src="/images/Logo.svg" alt="logo" />
      </div>
    </header>
  );
}
