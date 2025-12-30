import { ITableAuditLog } from '@Data/MockData';

import styles from './AuditAction.module.scss';

interface Props {
  action: ITableAuditLog['action'];
}

function AuditAction(props: Props): React.JSX.Element {
  const { action } = props;

  return (
    <div className={`${styles.auditAction} ${styles[`auditAction--${action}`]}`}>
      <span>{action}</span>
    </div>
  );
}

export default AuditAction;
