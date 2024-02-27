import { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './_MenuLink.module.scss';

interface IProps {
  name: string;
  href: string;
  icon: string;
  minimize: boolean | undefined;
  index: number;
}

function MenuLink(props: IProps): JSX.Element {
  const { name, href, icon, minimize, index } = props;
  const location = useLocation();
  const menuLinkRef = useRef<HTMLLIElement>(null);

  // Active route
  let activeRoute;
  if (location.pathname === href) activeRoute = true;

  // Set animation (icon-translate) delay variable
  menuLinkRef.current?.style.setProperty('--index', `${index}`);

  // Page load; minimize is undefined - no animation classes applied
  let animatedStyles;
  switch (true) {
    case minimize === true: {
      animatedStyles = styles['menuLink--minimize'];
      break;
    }
    case minimize === false: {
      animatedStyles = styles['menuLink--maximize'];
      break;
    }
    default: {
      ('');
    }
  }

  return (
    <li
      className={`${styles.menuLink} ${activeRoute ? styles.menuLink__activeRoute : ''} ${animatedStyles}`}
      ref={menuLinkRef}>
      <div className={styles.menuLink__iconContainer}>
        <img
          src={icon}
          alt={name}
          className={`${styles.menuLink__img} ${activeRoute ? styles.menuLink__activeRoute__img : ''}`}
        />
      </div>
      <Link to={href} key={name}>
        <span className={styles.menuLink__text}>{name}</span>
      </Link>
    </li>
  );
}

export default MenuLink;
