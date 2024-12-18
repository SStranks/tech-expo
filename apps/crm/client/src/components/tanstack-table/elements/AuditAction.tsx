import { ITableAuditLog } from '@Data/MockData';

import styles from './AuditAction.module.scss';

interface IProps {
  action: ITableAuditLog['action'];
}

function AuditAction(props: IProps): React.JSX.Element {
  const { action } = props;

  return (
    <div className={`${styles.auditAction} ${styles[`auditAction--${action}`]}`}>
      <span>{action}</span>
    </div>
  );
}

export default AuditAction;
