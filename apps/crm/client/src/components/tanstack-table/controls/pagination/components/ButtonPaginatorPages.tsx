import { IconArrowLeftDoubleAlt, IconMenuDots } from '#Components/svg';
import { useState } from 'react';
import styles from './_ButtonPaginator.module.scss';

interface IProps {
  direction: 'previous' | 'next';
  title: string;
  onClick: () => void;
}

function ButtonPaginatorPages(props: IProps): JSX.Element {
  const { direction, title, onClick } = props;
  const [active, setActive] = useState<boolean>(false);

  const activate = () => {
    setActive(true);
  };

  const deactivate = () => {
    setActive(false);
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      onMouseEnter={activate}
      onMouseLeave={deactivate}
      onFocus={activate}
      onBlur={deactivate}
      className={styles.button}>
      {!active && <IconMenuDots svgClass={styles.svg} />}
      {active && direction === 'previous' && <IconArrowLeftDoubleAlt svgClass={styles.svg__active} />}
      {active && direction === 'next' && <IconArrowLeftDoubleAlt svgClass={styles.svg__active} mirror />}
    </button>
  );
}

export default ButtonPaginatorPages;
