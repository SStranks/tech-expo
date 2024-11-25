import type { ITableSettingsContacts } from '#Data/MockData';

import { IconUser, IconUserShield } from '#Components/svg';

import styles from './_SettingsRole.module.scss';

const CSS_ROLE_CLASS = {
  admin: 'admin',
  'sales intern': 'salesIntern',
  'sales manager': 'salesManager',
  'sales person': 'salesPerson',
};

function RoleIcon(userRole: ITableSettingsContacts['role']) {
  switch (userRole) {
    case 'admin': {
      return <IconUserShield svgClass={styles.icon} />;
    }
    case 'sales manager': {
      return <IconUser svgClass={styles.icon} />;
    }
    case 'sales person': {
      return <IconUser svgClass={styles.icon} />;
    }
    case 'sales intern': {
      return <IconUser svgClass={styles.icon} />;
    }
  }
}

interface IProps {
  userRole: ITableSettingsContacts['role'];
}

function SettingsRole(props: IProps): JSX.Element {
  const { userRole } = props;

  return (
    <div className={`${styles.settingsRole} ${styles[`settingsRole--${CSS_ROLE_CLASS[userRole]}`]}`}>
      {RoleIcon(userRole)}
      <span>{userRole}</span>
    </div>
  );
}

export default SettingsRole;
