import type { CoreRow } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';
import type { ITableDataCompanies, ITableDataContacts, ITableDataQuotes } from '#Data/MockData';
import { Link } from 'react-router-dom';
import { IconDelete, IconEdit, IconEmail, IconEye, IconPhone } from '#Components/svg';
import styles from './_RowActionsControl.module.scss';

type TTableDataAllUnion = ITableDataContacts | ITableDataCompanies | ITableDataQuotes;

interface IViewControl {
  entryId: string;
}

interface IUpdateControl {
  rowOriginal: CoreRow<TTableDataAllUnion>['original'];
}

interface ICallControl {
  phone: string;
}

interface IEmailControl {
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

function CallControl({ phone }: ICallControl): JSX.Element {
  return (
    <Link to={`tel:${phone}`} className={styles.link}>
      <IconPhone svgClass={styles.svg} />
    </Link>
  );
}

function EmailControl({ entryId }: IEmailControl): JSX.Element {
  return (
    <Link to={`email:${entryId}`} className={styles.link}>
      <IconEmail svgClass={styles.svg} />
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
RowActionsControl.EmailControl = EmailControl;
RowActionsControl.DeleteControl = DeleteControl;

export default RowActionsControl;
