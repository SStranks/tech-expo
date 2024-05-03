import { IconDelete, IconEdit, IconEye, IconPhone } from '#Components/svg';
import { PropsWithChildren } from 'react';
import styles from './_RowActionsControl.module.scss';
import { Link } from 'react-router-dom';

interface IChildProps {
  onClick: () => void;
}

interface IViewControl {
  entryId: string;
}

interface IUpdateControl {
  entryId: string;
}

interface ICallControl {
  entryId: string;
}

function RowActionsControl({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.rowActions}>{children}</div>;
}

function ViewControl({ entryId }: IViewControl): JSX.Element {
  return (
    <Link to={`read/${entryId}`} className={styles.link}>
      <IconEye svgClass={styles.svg} />
    </Link>
  );
}

function CallControl({ entryId }: ICallControl): JSX.Element {
  return (
    <Link to={`read/${entryId}`} className={styles.link}>
      <IconPhone svgClass={styles.svg} />
    </Link>
  );
}

function UpdateControl({ entryId }: IUpdateControl): JSX.Element {
  return (
    <Link to={`update/${entryId}`} className={styles.link}>
      <IconEdit svgClass={styles.svg} />
    </Link>
  );
}

function DeleteControl({ onClick }: IChildProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.linkDelete}>
      <IconDelete svgClass={styles.svg} />
    </button>
  );
}

RowActionsControl.ViewControl = ViewControl;
RowActionsControl.UpdateControl = UpdateControl;
RowActionsControl.CallControl = CallControl;
RowActionsControl.DeleteControl = DeleteControl;

export default RowActionsControl;
