import { useState } from 'react';
import ButtonPaginatorNumber from '#Components/buttons/paginator-pages/ButtonPaginatorNumber';
import ButtonPaginatorPages from '#Components/buttons/paginator-pages/ButtonPaginatorPages';
import ButtonPaginatorSinglePage from '#Components/buttons/paginator-pages/ButtonPaginatorSinglePage';
import styles from './_TablePaginatorControl.module.scss';

interface IProps {
  numberOfPages: number;
}

function TablePaginatorControl(props: IProps): JSX.Element {
  const { numberOfPages } = props;
  const [activePageNumber, setActivePageNumber] = useState<number>(1);

  const singlePagePreviousDisabled = () => {
    if (activePageNumber > 1 && numberOfPages > 1) return false;
    return true;
  };

  const singlePageNextDisabled = () => {
    if (activePageNumber < numberOfPages && numberOfPages > 1) return false;
    return true;
  };

  const shiftPages = (direction: 'previous' | 'next', amount: 1 | 5) => {
    let pageNumber;
    if (direction === 'previous') {
      pageNumber = activePageNumber - amount;
      pageNumber < 1 ? (pageNumber = 1) : null;
    } else {
      pageNumber = activePageNumber + amount;
      pageNumber > numberOfPages ? (pageNumber = numberOfPages) : null;
    }
    return setActivePageNumber(pageNumber);
  };

  const createButtonPaginatorNumber = (i: number) => {
    return (
      <ButtonPaginatorNumber
        key={i}
        number={i}
        active={i === activePageNumber}
        onClick={() => setActivePageNumber(i)}
      />
    );
  };

  // Construct numbers buttons elements and multi-page-shift button elements
  const numberRangeButtons = () => {
    // Start/End numbers always included;
    // Number range should be +-2 from active number, not including end numbers;
    const jsxElements = [
      <ButtonPaginatorNumber
        key={0}
        number={1}
        active={1 === activePageNumber}
        onClick={() => setActivePageNumber(1)}
      />,
    ];

    if (activePageNumber > 4)
      jsxElements.push(
        <ButtonPaginatorPages
          key={'prev'}
          direction="previous"
          title="Previous 5 Pages"
          onClick={() => shiftPages('previous', 5)}
        />
      );

    const initialPos =
      activePageNumber -
      2 +
      Math.abs(Math.min(activePageNumber - 3, 0)) -
      Math.abs(Math.min(numberOfPages - (activePageNumber + 2), 0));

    for (let i = 0, j = initialPos; i < 5; i++, j++) {
      if (j < activePageNumber && j > 1) {
        jsxElements.push(createButtonPaginatorNumber(j));
        continue;
      }
      if (j === activePageNumber && j > 1 && j < numberOfPages) {
        jsxElements.push(createButtonPaginatorNumber(j));
        continue;
      }
      if (j > activePageNumber && j < numberOfPages) {
        jsxElements.push(createButtonPaginatorNumber(j));
        continue;
      }
    }

    if (activePageNumber < numberOfPages - 3)
      jsxElements.push(
        <ButtonPaginatorPages
          key={'next'}
          direction="next"
          title="Next 5 Pages"
          onClick={() => shiftPages('next', 5)}
        />
      );

    if (numberOfPages > 1) jsxElements.push(createButtonPaginatorNumber(numberOfPages));

    return jsxElements;
  };

  return (
    <div className={styles.tablePaginatorControl}>
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

export default TablePaginatorControl;
