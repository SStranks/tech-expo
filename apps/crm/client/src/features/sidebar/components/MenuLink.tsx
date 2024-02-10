import { Link } from 'react-router-dom';
import MenuNavigation from '#Svg/icons/MenuNavigation.svg';
import styles from './_MenuLink.module.scss';

interface IProps {
  name: string;
  href: string;
  hideText: boolean;
}

// NOTE:  inline-style is required for RTL testing.
function MenuLink(props: IProps): JSX.Element {
  const { name, href, hideText } = props;

  return (
    <li className={styles.menuLink}>
      <img src={MenuNavigation} alt="" />
      <Link to={href} key={name}>
        <span style={hideText ? { visibility: 'hidden' } : {}} className={styles.menuText}>
          {name}
        </span>
      </Link>
    </li>
  );
}

export default MenuLink;
