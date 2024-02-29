import { useRef, useState } from 'react';
import usePortalClose from '#Hooks/usePortalClose';
import { IconClose, IconSearch } from '#Svg/icons';
import { LogoAlgolia } from '#Svg/logos';
import styles from './_Search.module.scss';
import usePortalFocusTrap from '#Hooks/usePortalFocusTrap';
import SearchResults from './SearchResults';

interface IProps {
  portalActive: boolean;
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
  portalContentRef: React.RefObject<HTMLDivElement>;
  openPortalContentBtnRef: React.RefObject<HTMLButtonElement>;
}

// TODO:  Add in DEBOUNCE when the API is functional.
// NOTE:  <search> contains 'is' attribute to satisfy RTL test - currently <search> is unknown tag/recently added.
function Search(props: IProps): JSX.Element {
  const { portalActive, setPortalActive } = props;
  const [searchInput, setSearchInput] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line unicorn/no-null
  usePortalClose(portalActive, setPortalActive, portalContentRef, null);
  usePortalFocusTrap(portalActive);

  const closeModal = () => {
    setPortalActive(false);
  };

  const searchInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Esc' || e.key === 'Escape') setPortalActive(false);
  };

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // If search is empty just focus the input
    if (searchInput === '' && searchInputRef.current) return searchInputRef?.current.focus();
    console.log(`Search Submitted: ${searchInput}`);
  };

  return (
    <search role="search" className={styles.searchModal} ref={portalContentRef}>
      <form
        onSubmit={onSubmitHandler}
        name="search crm interface"
        aria-label="search crm interface"
        className={styles.searchForm}>
        <img src={IconSearch} alt="" className={styles.searchForm__img} />
        <input
          type="search"
          name="search query"
          value={searchInput}
          placeholder="Search..."
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={searchInputKeyDown}
          className={styles.searchForm__input}
          autoComplete="off"
          ref={searchInputRef}
        />
        <button type="button" onClick={closeModal} className={styles.searchForm__closeBtn}>
          <img src={IconClose} alt="Close Search Modal" />
        </button>
      </form>
      <div className={styles.searchResults} role="group">
        <span className={styles.searchResults__title}>Results</span>
        <SearchResults />
      </div>
      <div className={styles.searchControls}>
        <div className={styles.searchControl}>
          <kbd className={styles.searchControl__searchKey}>↵</kbd>
          <span className={styles.searchControl__searchSpan}>to select</span>
        </div>
        <div className={styles.searchControl}>
          <kbd className={styles.searchControl__searchKey}>↑</kbd>
          <kbd className={styles.searchControl__searchKey}>↓</kbd>
          <span className={styles.searchControl__searchSpan}>to navigate</span>
        </div>
        <div className={styles.searchControl}>
          <kbd className={styles.searchControl__searchKey}>esc</kbd>
          <span className={styles.searchControl__searchSpan}>to close</span>
        </div>
        <div className={styles.searchControl}>
          <span className={styles.searchControl__searchSpan}>Powered by</span>
          <img src={LogoAlgolia} alt="Algolia Logo" className={styles.searchControl__logoSvg} />
        </div>
      </div>
    </search>
  );
}

export default Search;
