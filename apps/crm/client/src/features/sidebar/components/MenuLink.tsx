import { useRef } from 'react';
import { Link } from 'react-router-dom';
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
  const menuLinkRef = useRef<HTMLLIElement>(null);

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
    <li className={`${styles.menuLink} ${animatedStyles}`} ref={menuLinkRef}>
      <div className={styles.menuLink__iconContainer}>
        <img src={icon} alt={name} className={styles.menuLink__img} />
      </div>
      <Link to={href} key={name}>
        <span className={styles.menuLink__text}>{name}</span>
      </Link>
    </li>
  );
}

export default MenuLink;
