import { IconMagniferZoomIn } from '#Components/svg';
import styles from './_AuditDetails.module.scss';

function AuditDetails(): JSX.Element {
  return (
    <div className={styles.auditDetails}>
      <IconMagniferZoomIn svgClass={styles.auditDetails__svg} />
      <span>Details</span>
    </div>
  );
}

export default AuditDetails;
