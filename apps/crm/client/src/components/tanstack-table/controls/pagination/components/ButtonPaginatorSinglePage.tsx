import IconArrowLeftAlt from '@Components/svg/IconArrowLeftAlt';

import styles from './ButtonPaginator.module.scss';

interface IProps {
  direction: 'previous' | 'next';
  title: string;
  disabled: boolean;
  onClick: () => void;
}

function ButtonPaginatorSinglePage(props: IProps): React.JSX.Element {
  const { direction, disabled, onClick, title } = props;

  return (
    <button type="button" title={title} className={styles.button} onClick={onClick} disabled={disabled}>
      {direction === 'previous' && <IconArrowLeftAlt svgClass={styles.svg} />}
      {direction === 'next' && <IconArrowLeftAlt svgClass={styles.svg} mirror />}
    </button>
  );
}

export default ButtonPaginatorSinglePage;
