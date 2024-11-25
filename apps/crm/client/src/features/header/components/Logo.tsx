import styles from './_Logo.module.scss';

interface IProps {
  title: string;
  logoUrl: string;
}

function Logo(props: IProps): JSX.Element {
  const { logoUrl, title } = props;
  return (
    <div className={styles.logo}>
      <img src={logoUrl} alt="company logo" className={styles.logo__img} />
      <h1 className={styles.logo__title}>{title}</h1>
    </div>
  );
}

export default Logo;
