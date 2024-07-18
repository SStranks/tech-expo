import { IconMagniferZoomIn } from '#Components/svg';
import { useNavigate } from 'react-router-dom';
import styles from './_AuditDetails.module.scss';

function AuditDetails(): JSX.Element {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('details');
  };

  return (
    <button onClick={onClick} className={styles.auditDetails}>
      <IconMagniferZoomIn svgClass={styles.auditDetails__svg} />
      <span>Details</span>
    </button>
  );
}

export default AuditDetails;
