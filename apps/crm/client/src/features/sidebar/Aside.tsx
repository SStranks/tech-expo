import { useState } from 'react';
import { ToolTip, MenuLink, MenuToggle } from './components';
import { IconAudit, IconBillQuote, IconCalendar, IconCompanies, IconContacts, IconScrum } from '#Svg/icons';
import { IconDashboard, IconKanban, IconPipe, IconSettings, IconAdmininstration } from '#Svg/icons';
import styles from './_Aside.module.scss';

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
  const [sidebarMaximize, setSidebarMaximize] = useState<boolean | undefined>();

  const menuLinks = MENU_CATEGORIES.map(([name, href, iconSrc], i) => {
    return <MenuLink key={name} name={name} href={href} icon={iconSrc} minimize={sidebarMaximize} index={i} />;
  });

  return (
    <aside className={`${styles.aside} ${sidebarMaximize ? styles['aside--minimize'] : ''}`}>
      <ul className={styles.aside__list}>{menuLinks}</ul>
      <div className={styles.aside__menuButton}>
        <ToolTip text={sidebarMaximize ? 'Maximize Menu' : 'Minimize Menu'} position="right" offset={16}>
          <MenuToggle sidebarMaximize={sidebarMaximize} setSidebarMaximize={setSidebarMaximize} />
        </ToolTip>
      </div>
    </aside>
  );
}
