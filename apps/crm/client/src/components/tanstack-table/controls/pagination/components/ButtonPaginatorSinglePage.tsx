import { IconArrowLeftAlt } from '#Components/svg';

import styles from './_ButtonPaginator.module.scss';

interface IProps {
  direction: 'previous' | 'next';
  title: string;
  disabled: boolean;
  onClick: () => void;
}

function ButtonPaginatorSinglePage(props: IProps): JSX.Element {
  const { direction, disabled, onClick, title } = props;

  return (
    <button type="button" title={title} className={styles.button} onClick={onClick} disabled={disabled}>
      {direction === 'previous' && <IconArrowLeftAlt svgClass={styles.svg} />}
      {direction === 'next' && <IconArrowLeftAlt svgClass={styles.svg} mirror />}
    </button>
  );
}

export default ButtonPaginatorSinglePage;
