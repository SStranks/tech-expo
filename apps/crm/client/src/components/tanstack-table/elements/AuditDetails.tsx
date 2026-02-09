import { useNavigate } from 'react-router-dom';

import IconMagniferZoomIn from '@Components/svg/IconMagniferZoomIn';

import styles from './AuditDetails.module.scss';

function AuditDetails(): React.JSX.Element {
  const navigate = useNavigate();

  const onClick = () => {
    void navigate('details');
  };

  return (
    <button onClick={onClick} className={styles.auditDetails}>
      <IconMagniferZoomIn svgClass={styles.auditDetails__svg} />
      <span>Details</span>
    </button>
  );
}

export default AuditDetails;
