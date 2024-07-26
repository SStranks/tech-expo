import type { CoreRow } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';
import type { ITableDataCompanies, ITableDataContacts, ITableDataQuotes } from '#Data/MockData';
import { Link } from 'react-router-dom';
import { IconDelete, IconEdit, IconEye, IconPhone } from '#Components/svg';
import styles from './_RowActionsControl.module.scss';

type TTableDataAllUnion = ITableDataContacts | ITableDataCompanies | ITableDataQuotes;

interface IViewControl {
  entryId: string;
}

interface IUpdateControl {
  rowOriginal: CoreRow<TTableDataAllUnion>['original'];
}

interface ICallControl {
  entryId: string;
}

interface IDeleteControl {
  rowOriginal: CoreRow<TTableDataAllUnion>['original'];
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

function UpdateControl({ rowOriginal }: IUpdateControl): JSX.Element {
  return (
    <Link to={`update/${rowOriginal.id}`} state={rowOriginal} className={styles.link}>
      <IconEdit svgClass={styles.svg} />
    </Link>
  );
}

function DeleteControl({ rowOriginal }: IDeleteControl): JSX.Element {
  return (
    <Link to={`delete/${rowOriginal.id}`} state={rowOriginal} className={styles.linkDelete}>
      <IconDelete svgClass={styles.svg} />
    </Link>
  );
}

RowActionsControl.ViewControl = ViewControl;
RowActionsControl.UpdateControl = UpdateControl;
RowActionsControl.CallControl = CallControl;
RowActionsControl.DeleteControl = DeleteControl;

export default RowActionsControl;
