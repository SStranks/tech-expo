import { useState } from 'react';

import IconAdministration from '@Components/svg/IconAdministration';
import IconAudit from '@Components/svg/IconAudit';
import IconBillQuote from '@Components/svg/IconBillQuote';
import IconCalendar from '@Components/svg/IconCalendar';
import IconCompanies from '@Components/svg/IconCompanies';
import IconContacts from '@Components/svg/IconContacts';
import IconDashboard from '@Components/svg/IconDashboard';
import IconKanban from '@Components/svg/IconKanban';
import IconPipe from '@Components/svg/IconPipe';
import IconScrum from '@Components/svg/IconScrum';
import IconSettings from '@Components/svg/IconSettings';
import ToolTip from '@Components/ui/Tooltip';

import MenuLink from './components/MenuLink';
import MenuToggle from './components/MenuToggle';

import styles from './Aside.module.scss';

// type MenuCategories = [string, string, IIcon][];

export const MENU_CATEGORIES = [
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
] as const;

export function Aside(): React.JSX.Element {
  const [sidebarMaximize, setSidebarMaximize] = useState<boolean | undefined>();

  const menuLinks = MENU_CATEGORIES.map(([name, href, icon], i) => {
    return <MenuLink key={name} name={name} href={href} Icon={icon} minimize={sidebarMaximize} index={i} />;
  });

  return (
    <aside className={`${styles.aside} ${sidebarMaximize ? styles['aside--minimize'] : ''}`}>
      <ul className={styles.aside__list}>{menuLinks}</ul>
      <div className={styles.aside__menuButton}>
        <div className={styles.aside__menuButton__mask} />
        <ToolTip text={sidebarMaximize ? 'Maximize Menu' : 'Minimize Menu'} position="right" offset={16}>
          <MenuToggle sidebarMaximize={sidebarMaximize} setSidebarMaximize={setSidebarMaximize} />
        </ToolTip>
      </div>
    </aside>
  );
}
