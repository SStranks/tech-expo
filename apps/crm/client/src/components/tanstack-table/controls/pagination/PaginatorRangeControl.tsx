import type { Updater } from '@tanstack/react-table';

import ButtonPaginatorNumber from './components/ButtonPaginatorNumber';
import ButtonPaginatorPages from './components/ButtonPaginatorPages';
import ButtonPaginatorSinglePage from './components/ButtonPaginatorSinglePage';

import styles from './PaginatorRangeControl.module.scss';

interface IProps {
  pageCount: number;
  pageIndex: number;
  setPageIndex: (updater: Updater<number>) => void;
}

function PaginatorRangeControl(props: IProps): React.JSX.Element {
  const { pageCount, pageIndex: pageIndexProp, setPageIndex: setPageIndexProp } = props;
  // Tanstack-Table; pagination is zero-based
  const pageIndex = pageIndexProp + 1;
  const setPageIndex = (i: number) => setPageIndexProp(i - 1);

  const singlePagePreviousDisabled = () => {
    if (pageIndex > 1 && pageCount > 1) return false;
    return true;
  };

  const singlePageNextDisabled = () => {
    if (pageIndex < pageCount && pageCount > 1) return false;
    return true;
  };

  const shiftPages = (direction: 'previous' | 'next', amount: 1 | 5) => {
    let pageNumber;
    if (direction === 'previous') {
      pageNumber = pageIndex - amount;
      pageNumber < 1 ? (pageNumber = 1) : null;
    } else {
      pageNumber = pageIndex + amount;
      pageNumber > pageCount ? (pageNumber = pageCount) : null;
    }
    return setPageIndex(pageNumber);
  };

  const createButtonPaginatorNumber = (i: number) => {
    return <ButtonPaginatorNumber key={i} number={i} active={i === pageIndex} onClick={() => setPageIndex(i)} />;
  };

  // Construct numbers buttons elements and multi-page-shift button elements
  const numberRangeButtons = () => {
    // Start/End numbers always included;
    // Number range should be +-2 from active number, not including end numbers;
    const jsxElements = [
      <ButtonPaginatorNumber key={0} number={1} active={1 === pageIndex} onClick={() => setPageIndex(1)} />,
    ];

    if (pageIndex > 4)
      jsxElements.push(
        <ButtonPaginatorPages
          key="prev"
          direction="previous"
          title="Previous 5 Pages"
          onClick={() => shiftPages('previous', 5)}
        />
      );

    const initialPos =
      pageIndex - 2 + Math.abs(Math.min(pageIndex - 3, 0)) - Math.abs(Math.min(pageCount - (pageIndex + 2), 0));

    for (let i = 0, j = initialPos; i < 5; i++, j++) {
      if (j < pageIndex && j > 1) {
        jsxElements.push(createButtonPaginatorNumber(j));
        continue;
      }
      if (j === pageIndex && j > 1 && j < pageCount) {
        jsxElements.push(createButtonPaginatorNumber(j));
        continue;
      }
      if (j > pageIndex && j < pageCount) {
        jsxElements.push(createButtonPaginatorNumber(j));
        continue;
      }
    }

    if (pageIndex < pageCount - 3)
      jsxElements.push(
        <ButtonPaginatorPages key="next" direction="next" title="Next 5 Pages" onClick={() => shiftPages('next', 5)} />
      );

    if (pageCount > 1) jsxElements.push(createButtonPaginatorNumber(pageCount));

    return jsxElements;
  };

  return (
    <div className={styles.paginatorRangeControl}>
      <ButtonPaginatorSinglePage
        direction="previous"
        title="Previous page"
        onClick={() => shiftPages('previous', 1)}
        disabled={singlePagePreviousDisabled()}
      />
      {numberRangeButtons()}
      <ButtonPaginatorSinglePage
        direction="next"
        title="Next page"
        onClick={() => shiftPages('next', 1)}
        disabled={singlePageNextDisabled()}
      />
    </div>
  );
}

export default PaginatorRangeControl;
