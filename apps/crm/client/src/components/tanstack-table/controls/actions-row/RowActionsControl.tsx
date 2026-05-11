import type { LinkProps } from '@tanstack/react-router';
import type { CoreRow } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import type { TableDataCompanies, TableDataContacts, TableDataQuotes } from '@Data/MockData';

import { Link } from '@tanstack/react-router';

import IconDelete from '@Components/svg/IconDelete';
import IconEdit from '@Components/svg/IconEdit';
import IconEmail from '@Components/svg/IconEmail';
import IconEye from '@Components/svg/IconEye';
import IconPhone from '@Components/svg/IconPhone';

import styles from './RowActionsControl.module.scss';

type TableDataAllUnion = TableDataContacts | TableDataCompanies | TableDataQuotes;

type UpdateControl = {
  rowOriginal: CoreRow<TableDataAllUnion>['original'];
};

type CallControl = {
  phone: string;
};

type EmailControl = {
  email: string;
};

type DeleteControl = {
  rowOriginal: CoreRow<TableDataAllUnion>['original'];
};

function RowActionsControl({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.rowActions}>{children}</div>;
}

function ViewControl({ params, to }: LinkProps): React.JSX.Element {
  return (
    <Link to={to} params={params} className={styles.link}>
      <IconEye svgClass={styles.svg} />
    </Link>
  );
}

function CallControl({ phone }: CallControl): React.JSX.Element {
  return (
    <a href={`tel:${phone}`} className={styles.link}>
      <IconPhone svgClass={styles.svg} />
    </a>
  );
}

function EmailControl({ email }: EmailControl): React.JSX.Element {
  return (
    <a href={`email:${email}`} className={styles.link}>
      <IconEmail svgClass={styles.svg} />
    </a>
  );
}

function UpdateControl({ params, to }: LinkProps): React.JSX.Element {
  return (
    // <Link to={to} params={params} state={rowOriginal} className={styles.link}>
    <Link to={to} params={params} className={styles.link}>
      <IconEdit svgClass={styles.svg} />
    </Link>
  );
}

function DeleteControl({ params, to }: LinkProps): React.JSX.Element {
  return (
    // <Link to={`delete/${rowOriginal.id}`} state={rowOriginal} className={styles.linkDelete}>
    <Link to={to} params={params} className={styles.linkDelete}>
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
