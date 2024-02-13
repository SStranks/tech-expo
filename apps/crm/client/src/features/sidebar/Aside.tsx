import { useState } from 'react';
import MenuLink from './components/MenuLink';
import styles from './_Aside.module.scss';
// import ToolTip from './components/Tooltip';
import { IconAudit, IconBillQuote, IconCalendar, IconCompanies, IconContacts, IconScrum } from '#Svg/icons';
import { IconDashboard, IconKanban, IconPipe, IconSettings, IconAdmininstration } from '#Svg/icons';
import MenuToggle from './components/MenuToggle';

export const MENU_CATEGORIES = [
  ['Dashboard', '/', IconDashboard],
  ['Calendar', '/calendar', IconCalendar],
  ['Scrumboard', '/scrumboard', IconScrum],
  ['Kanban', '/kanban', IconKanban],
  ['Pipeline', '/pipeline', IconPipe],
  ['Companies', '/companies', IconCompanies],
  ['Contacts', '/contacts', IconContacts],
  ['Quotes', '/quotes', IconBillQuote],
  ['Administration', '/adminstration', IconAdmininstration],
  ['Settings', '/settings', IconSettings],
  ['Audit Log', '/auditlog', IconAudit],
];

export function Aside(): JSX.Element {
  const [sidebarMaximize, setSidebarMaximize] = useState<boolean>(true);

  const menuLinks = MENU_CATEGORIES.map(([name, href, iconSrc]) => {
    return <MenuLink key={name} name={name} href={href} icon={iconSrc} hideText={!sidebarMaximize} />;
  });

  return (
    <aside className={sidebarMaximize ? styles.aside : styles['aside--minimize']}>
      <ul>{menuLinks}</ul>
      <div className={styles.aside__menuButton}>
        <MenuToggle sidebarMaximize={sidebarMaximize} setSidebarMaximize={setSidebarMaximize} />
      </div>
      {/* <ToolTip text="Minimize Menu"></ToolTip> */}
    </aside>
  );
}
