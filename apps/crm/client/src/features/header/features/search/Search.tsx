import { useRef, useState } from 'react';

import { IconClose, IconSearch } from '@Components/svg';
import usePortalClose from '@Hooks/usePortalClose';
import usePortalFocusTrap from '@Hooks/usePortalFocusTrap';
import { LogoAlgolia } from '@Svg/logos';

import SearchResults from './SearchResults';

import styles from './Search.module.scss';

interface IProps {
  portalActive: boolean;
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO:  Add in DEBOUNCE when the API is functional.
// NOTE:  <search> contains 'is' attribute to satisfy RTL test - currently <search> is unknown tag/recently added.
function Search(props: IProps): React.JSX.Element {
  const { portalActive, setPortalActive } = props;
  const [searchInput, setSearchInput] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
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
        <IconSearch svgClass={styles.searchForm__svg} />
        <input
          type="search"
          name="search query"
          value={searchInput}
          placeholder="Search..."
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={searchInputKeyDown}
          className={styles.searchForm__input}
          autoComplete="off"
          autoCorrect="off"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          ref={searchInputRef}
        />
        <button type="button" onClick={closeModal} className={styles.searchForm__closeBtn}>
          <IconClose svgClass={styles.searchForm__closeBtn__svg} />
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
