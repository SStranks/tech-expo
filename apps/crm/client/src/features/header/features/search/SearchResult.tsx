import { IconArrowRightUp, IconNotebook } from '@Components/svg';

import styles from './SearchResult.module.scss';

interface IProps {
  title: string;
  category: string;
  description: string;
}

function SearchResult(props: IProps): JSX.Element {
  const { category, description, title } = props;

  return (
    <div className={styles.searchResult} role="option" aria-selected={true}>
      <IconNotebook svgClass={styles.searchResult__svg} />
      <div className={styles.details}>
        <span className={styles.details__title}>{title}</span>
        <span className={styles.details__category}>{category}</span>
        <span className={styles.details__description}>{description}</span>
      </div>
      <IconArrowRightUp svgClass={styles.searchResult__svg} />
    </div>
  );
}

export default SearchResult;
