import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { ReactPortal } from '#Components/index';
import { IconSearch } from '#Components/svg';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '#Utils/cssTransitionGroup';

import Search from '../features/search/Search';

import styles from './_SearchBar.module.scss';

function SearchBar(): JSX.Element {
  const [portalActive, setPortalActive] = useState<boolean>(false);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const portalButtonRef = useRef<HTMLButtonElement>(null);

  const buttonClickHandler = () => {
    setPortalActive(true);
  };

  // Detect '/' keypress and open portal content, if there are no inputs focused in the document
  useEffect(() => {
    const forwardSlashKey = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        buttonClickHandler();
      }
    };

    document.addEventListener('keypress', forwardSlashKey);
    return () => document.removeEventListener('keypress', forwardSlashKey);
  });

  return (
    <>
      <button type="button" onClick={buttonClickHandler} className={styles.searchBar} ref={portalButtonRef}>
        <IconSearch svgClass={styles.searchBar__svg} data-testid="search-icon" />
        Search
        <div className={styles.searchBar__shortcutKey}>
          <kbd>/</kbd>
        </div>
      </button>
      <ReactPortal wrapperId="portal-search">
        <CSSTransition
          in={portalActive}
          timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={portalContentRef}>
          <div className={styles.portalContent} data-testid="portal-search" ref={portalContentRef}>
            <Search portalActive={portalActive} setPortalActive={setPortalActive} />
          </div>
        </CSSTransition>
      </ReactPortal>
    </>
  );
}

export default SearchBar;
