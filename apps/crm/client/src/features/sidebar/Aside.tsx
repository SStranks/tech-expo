import { useState } from 'react';

import { ToolTip } from '@Components/index';
import {
  IconAdministration,
  IconAudit,
  IconBillQuote,
  IconCalendar,
  IconCompanies,
  IconContacts,
  IconDashboard,
  IconKanban,
  IconPipe,
  IconScrum,
  IconSettings,
  IIcon,
} from '@Components/svg';

import { MenuLink, MenuToggle } from './components';

import styles from './Aside.module.scss';

type TMenuCategories = [string, string, IIcon][];

export const MENU_CATEGORIES: TMenuCategories = [
  ['Dashboard', '/', IconDashboard],
  ['Calendar', '/calendar', IconCalendar],
  ['Scrumboard', '/scrumboard', IconScrum],
  ['Kanban', '/kanban', IconKanban],
  ['Pipeline', '/pipeline', IconPipe],
  ['Companies', '/companies', IconCompanies],
  ['Contacts', '/contacts', IconContacts],
  ['Quotes', '/quotes', IconBillQuote],
  ['Administration', '/adminstration', IconAdministration],
  ['Settings', '/settings', IconSettings],
  ['Audit Log', '/auditlog', IconAudit],
];

export function Aside(): React.JSX.Element {
  const [sidebarMaximize, setSidebarMaximize] = useState<boolean | undefined>();

  const menuLinks = MENU_CATEGORIES.map(([name, href, icon], i) => {
    return <MenuLink key={name} name={name} href={href} Icon={icon} minimize={sidebarMaximize} index={i} />;
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
