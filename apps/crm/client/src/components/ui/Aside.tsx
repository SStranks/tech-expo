import { Link } from 'react-router-dom';
import styles from './_Aside.module.scss';

export const MENU_CATEGORIES = [
  ['Dashboard', '/'],
  ['Calendar', '/calendar'],
  ['Scrumboard', '/scrumboard'],
  ['Kanban', '/kanban'],
  ['Pipeline', '/pipeline'],
  ['Companies', '/companies'],
  ['Contacts', '/contacts'],
  ['Quotes', '/quotes'],
  ['Administration', '/adminstration'],
  ['Settings', '/settings'],
  ['Audit Log', '/auditlog'],
];

export function Aside(): JSX.Element {
  const menuLinks = MENU_CATEGORIES.map(([name, href]) => {
    return (
      <Link to={href} key={name}>
        <li>{name}</li>
      </Link>
    );
  });

  return (
    <aside className={styles.aside}>
      <ul>{menuLinks}</ul>
    </aside>
  );
}
