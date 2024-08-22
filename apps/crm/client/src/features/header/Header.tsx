import Logo from './components/Logo';
import SettingsBar from './components/SettingsBar';
import SearchBar from './components/SearchBar';
import CompanyLogo from '#Img/CompanyLogo.png';
import styles from './_Header.module.scss';

function Header(): JSX.Element {
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
