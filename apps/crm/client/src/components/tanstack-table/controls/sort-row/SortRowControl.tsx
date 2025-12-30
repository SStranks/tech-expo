import type { SortDirection } from '@tanstack/react-table';

import IconSortVertical from '@Components/svg/IconSortVertical';

import styles from './SortRowControl.module.scss';

const iconDirectionStyles = (sortDirection: Props['sortDirection']) => {
  if (sortDirection === 'asc') return styles.svg__ascending;
  if (sortDirection === 'desc') return styles.svg__descending;
  return '';
};

interface Props {
  sortDirection: SortDirection | false;
  sortOnClick: ((event: unknown) => void) | undefined;
}

function SortRowControl(props: Props): React.JSX.Element {
  const { sortDirection, sortOnClick } = props;

  const activeStyles = iconDirectionStyles(sortDirection);

  return (
    <button
      type="button"
      onClick={sortOnClick}
      className={`${styles.sortRowControlBtn} ${activeStyles ? styles.sortRowControlBtn__active : ''}`}>
      <IconSortVertical svgClass={`${styles.svg} ${activeStyles}`} />
    </button>
  );
}

export default SortRowControl;
