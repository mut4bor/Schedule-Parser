import { HeaderLogo } from './header-logo';
import styles from './style.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <HeaderLogo />
    </header>
  );
};
