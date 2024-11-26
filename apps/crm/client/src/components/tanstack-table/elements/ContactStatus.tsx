import type { ITableDataContacts } from '@Data/MockData';

import {
  IconCircleClock,
  IconCircleClose,
  IconCircleMinus,
  IconCirclePlus,
  IconCircleTick,
  IconCircleTriangleRight,
} from '@Components/svg';

import styles from './ContactStatus.module.scss';

function StatusIcon(status: ITableDataContacts['status']) {
  switch (status) {
    case 'churned': {
      return <IconCircleMinus svgClass={styles.icon} />;
    }
    case 'contacted': {
      return <IconCircleTriangleRight svgClass={styles.icon} />;
    }
    case 'interested': {
      return <IconCircleClock svgClass={styles.icon} />;
    }
    case 'lost': {
      return <IconCircleClose svgClass={styles.icon} />;
    }
    case 'negotiation': {
      return <IconCircleClock svgClass={styles.icon} />;
    }
    case 'new': {
      return <IconCirclePlus svgClass={styles.icon} />;
    }
    case 'qualified': {
      return <IconCircleTriangleRight svgClass={styles.icon} />;
    }
    case 'unqualified': {
      return <IconCircleMinus svgClass={styles.icon} />;
    }
    case 'won': {
      return <IconCircleTick svgClass={styles.icon} />;
    }
  }
}

interface IProps {
  status: ITableDataContacts['status'];
}

function ContactStatus(props: IProps): JSX.Element {
  const { status } = props;

  return (
    <div className={`${styles.contactStatus} ${styles[`contactStatus--${status}`]}`}>
      {StatusIcon(status)}
      <span>{status}</span>
    </div>
  );
}

export default ContactStatus;
