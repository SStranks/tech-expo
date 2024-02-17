import styles from './_Search.module.scss';
import CompanyLogo from '#Img/CompanyLogo.png';
import { useEffect, useRef, useState } from 'react';

// TODO:  Add in DEBOUNCE when the API is functional.
// NOTE:  <search> contains 'is' attribute to satisfy RTL test - currently <search> is unknown tag/recently added.
function Search(): JSX.Element {
  const [searchInput, setSearchInput] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detect '/' keypress and focus search input, if there are no inputs focused in the document
  useEffect(() => {
    const forwardSlashKey = (e: KeyboardEvent) => {
      if (!searchInputRef.current) return;
      if (
        e.key === '/' &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };

    document.addEventListener('keypress', forwardSlashKey);
    return () => document.removeEventListener('keypress', forwardSlashKey);
  });

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    // If search is empty just focus the input
    if (searchInput === '' && searchInputRef.current) return searchInputRef?.current.focus();
    console.log(`Search Submitted: ${searchInput}`);
  };

  return (
    <search is="search" role="search">
      <form
        onSubmit={onSubmitHandler}
        name="search crm interface"
        aria-label="search crm interface"
        className={styles.search}>
        <button type="submit" aria-label="submit search" className={styles.search__submit}>
          <img src={CompanyLogo} alt="company logo" className={styles.search__img} />
        </button>
        <input
          type="search"
          name="search query"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          ref={searchInputRef}
        />
        <div className={styles.search__focusIcon}>/</div>
      </form>
    </search>
  );
}

export default Search;
