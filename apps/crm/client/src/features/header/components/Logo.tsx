import styles from './Logo.module.scss';

interface Props {
  title: string;
  logoUrl: string;
}

function Logo(props: Props): React.JSX.Element {
  const { logoUrl, title } = props;
  return (
    <div className={styles.logo}>
      <img src={logoUrl} alt="company logo" className={styles.logo__img} />
      <h1 className={styles.logo__title}>{title}</h1>
    </div>
  );
}

export default Logo;
