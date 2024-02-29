import { IconNotebook, IconArrowRightUp } from '#Svg/icons';
import styles from './_SearchResult.module.scss';

interface IProps {
  title: string;
  category: string;
  description: string;
}

function SearchResult(props: IProps): JSX.Element {
  const { title, category, description } = props;

  return (
    <div className={styles.searchResult} role="option" aria-selected={true}>
      <img src={IconNotebook} alt="" />
      <div className={styles.details}>
        <span className={styles.details__title}>{title}</span>
        <span className={styles.details__category}>{category}</span>
        <span className={styles.details__description}>{description}</span>
      </div>
      <img src={IconArrowRightUp} alt="" />
    </div>
  );
}

export default SearchResult;
