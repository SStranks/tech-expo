import CompanyLogo from '@Img/CompanyLogo.png';

import Logo from './components/Logo';
import SearchBar from './components/SearchBar';
import SettingsBar from './components/SettingsBar';

import styles from './Header.module.scss';

function Header(): React.JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.companyDetails}>
        <Logo title="Liandri Corp" logoUrl={CompanyLogo} />
      </div>
      <div className={styles.searchBar}>
        <SearchBar />
      </div>
      <div className={styles.settingsBar}>
        <SettingsBar />
      </div>
    </header>
  );
}

export default Header;
