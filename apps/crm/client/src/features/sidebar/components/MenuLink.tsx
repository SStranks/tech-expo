import type { SvgIcon } from '@Components/svg';

import { useId, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './MenuLink.module.scss';

type Props = {
  name: string;
  href: string;
  Icon: SvgIcon;
  minimize: boolean | undefined;
  index: number;
};

function MenuLink(props: Props): React.JSX.Element {
  const { href, Icon, index, minimize, name } = props;
  const location = useLocation();
  const menuLinkRef = useRef<HTMLLIElement>(null);
  const id = useId();

  // Active route
  let activeRoute;
  if (location.pathname === href) activeRoute = true;
  if (location.pathname.startsWith(`${href}/`)) activeRoute = true;

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
      <div className={styles.menuLink__iconContainer} aria-labelledby={id}>
        <Icon svgClass={styles.menuLink__svg} />
      </div>
      <Link to={href} key={name}>
        <span id={id} className={styles.menuLink__text}>
          {name}
        </span>
      </Link>
    </li>
  );
}

export default MenuLink;
