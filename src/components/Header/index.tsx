import Link from 'next/link';
import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Header() {
  return (
    <header className={`${styles.container} ${commonStyles.defaultContainer}`}>
      <div className={`${styles.content}`}>
        <Link href="/">
          <img src="/images/Logo.svg" alt="logo" />
        </Link>
      </div>
    </header>
  );
}
