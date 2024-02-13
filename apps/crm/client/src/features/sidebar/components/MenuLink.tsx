import { Link } from 'react-router-dom';
import styles from './_MenuLink.module.scss';

interface IProps {
  name: string;
  href: string;
  icon: string;
  hideText: boolean;
}

function MenuLink(props: IProps): JSX.Element {
  const { name, href, icon, hideText } = props;

  return (
    <li className={styles.menuLink}>
      <img src={icon} alt="" />
      <Link to={href} key={name}>
        <span className={hideText ? styles['menuText--hidden'] : styles.menuText}>{name}</span>
      </Link>
    </li>
  );
}

export default MenuLink;
