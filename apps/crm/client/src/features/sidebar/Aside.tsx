import { useState } from 'react';
import MenuLink from './components/MenuLink';
import styles from './_Aside.module.scss';
import ToolTip from './components/Tooltip';

export const MENU_CATEGORIES = [
  ['Dashboard', '/'],
  // ['Calendar', '/calendar'],
  // ['Scrumboard', '/scrumboard'],
  // ['Kanban', '/kanban'],
  // ['Pipeline', '/pipeline'],
  // ['Companies', '/companies'],
  // ['Contacts', '/contacts'],
  // ['Quotes', '/quotes'],
  // ['Administration', '/adminstration'],
  // ['Settings', '/settings'],
  // ['Audit Log', '/auditlog'],
];

export function Aside(): JSX.Element {
  const [menuMaximized, setMenuMaximized] = useState<boolean>(true);

  const menuToggleBtn = () => {
    setMenuMaximized((p) => !p);
  };

  const menuLinks = MENU_CATEGORIES.map(([name, href]) => {
    return <MenuLink key={name} name={name} href={href} hideText={!menuMaximized} />;
  });

  return (
    <aside className={styles.aside}>
      <ul>{menuLinks}</ul>
      <ToolTip text="Minimize Menu">
        <button type="button" aria-label="menu collapse toggle" onClick={menuToggleBtn} className={styles.button}>
          This is a button
        </button>
      </ToolTip>
    </aside>
  );
}
