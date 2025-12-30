import { TableAuditLog } from '@Data/MockData';

import styles from './AuditAction.module.scss';

type Props = {
  action: TableAuditLog['action'];
};

function AuditAction(props: Props): React.JSX.Element {
  const { action } = props;

  return (
    <div className={`${styles.auditAction} ${styles[`auditAction--${action}`]}`}>
      <span>{action}</span>
    </div>
  );
}

export default AuditAction;
