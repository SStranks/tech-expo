// import Search from '../features/search/Search';
import { IconSearch } from '#Svg/icons';
import styles from './_SearchBar.module.scss';

function SearchBar(): JSX.Element {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const buttonClickHandler = () => {
    console.log('click');
  };

  return (
    <button type="button" onClick={buttonClickHandler} className={styles.searchBar}>
      <img src={IconSearch} alt="" className={styles.searchBar__svg} />
      Search
      <div className={styles.searchBar__shortcutKey}>
        <kbd>/</kbd>
      </div>
    </button>
  );
}

export default SearchBar;
