import { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { IconDelete, IconEdit, IconEye, IconPhone } from '#Components/svg';
import styles from './_RowActionsControl.module.scss';
import { Row } from '@tanstack/react-table';

interface IViewControl {
  entryId: string;
}

interface IUpdateControl {
  entryId: string;
}

interface ICallControl {
  entryId: string;
}

interface IDeleteControl<I> {
  entryId: string;
  row: Row<I>;
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

function DeleteControl<I>({ entryId, row }: IDeleteControl<I>): JSX.Element {
  return (
    <Link to={`delete/${entryId}`} state={row.original} className={styles.linkDelete}>
      <IconDelete svgClass={styles.svg} />
    </Link>
  );
}

RowActionsControl.ViewControl = ViewControl;
RowActionsControl.UpdateControl = UpdateControl;
RowActionsControl.CallControl = CallControl;
RowActionsControl.DeleteControl = DeleteControl;

export default RowActionsControl;
