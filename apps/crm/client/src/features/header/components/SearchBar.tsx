import Search from '../features/search/Search';
import styles from './_SearchBar.module.scss';

function SearchBar(): JSX.Element {
  return (
    <div className={styles.searchBar}>
      <Search />
    </div>
  );
}

export default SearchBar;
