import type { SvgIcon } from '@Components/svg';

import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useId, useRef } from 'react';

import styles from './MenuLink.module.scss';

type Props = {
  href: string;
  Icon: SvgIcon;
  index: number;
  minimize: boolean | undefined;
  name: string;
};

function MenuLink(props: Props): React.JSX.Element {
  const { href, Icon, index, minimize, name } = props;
  const location = useLocation();
  const menuLinkRef = useRef<HTMLLIElement>(null);
  const id = useId();

  const activeRoute = location.pathname === href || location.pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (menuLinkRef.current) {
      // Set animation (icon-translate) delay variable
      menuLinkRef.current.style.setProperty('--index', `${index}`);
    }
  }, [index]);

  // Page load; minimize is undefined - no animation classes applied
  let animatedStyles: string | undefined;
  if (minimize === true) animatedStyles = styles['menuLink--minimize'];
  if (minimize === false) animatedStyles = styles['menuLink--maximize'];

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
