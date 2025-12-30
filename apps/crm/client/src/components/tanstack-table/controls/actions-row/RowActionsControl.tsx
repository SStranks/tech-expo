import type { CoreRow } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import type { TableDataCompanies, TableDataContacts, TableDataQuotes } from '@Data/MockData';

import { Link } from 'react-router-dom';

import IconDelete from '@Components/svg/IconDelete';
import IconEdit from '@Components/svg/IconEdit';
import IconEmail from '@Components/svg/IconEmail';
import IconEye from '@Components/svg/IconEye';
import IconPhone from '@Components/svg/IconPhone';

import styles from './RowActionsControl.module.scss';

type TableDataAllUnion = TableDataContacts | TableDataCompanies | TableDataQuotes;

type ViewControl = {
  entryId: string;
};

type UpdateControl = {
  rowOriginal: CoreRow<TableDataAllUnion>['original'];
};

type CallControl = {
  phone: string;
};

type EmailControl = {
  entryId: string;
};

type DeleteControl = {
  rowOriginal: CoreRow<TableDataAllUnion>['original'];
};

function RowActionsControl({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.rowActions}>{children}</div>;
}

function ViewControl({ entryId }: ViewControl): React.JSX.Element {
  return (
    <Link to={`read/${entryId}`} className={styles.link}>
      <IconEye svgClass={styles.svg} />
    </Link>
  );
}

function CallControl({ phone }: CallControl): React.JSX.Element {
  return (
    <Link to={`tel:${phone}`} className={styles.link}>
      <IconPhone svgClass={styles.svg} />
    </Link>
  );
}

function EmailControl({ entryId }: EmailControl): React.JSX.Element {
  return (
    <Link to={`email:${entryId}`} className={styles.link}>
      <IconEmail svgClass={styles.svg} />
    </Link>
  );
}

function UpdateControl({ rowOriginal }: UpdateControl): React.JSX.Element {
  return (
    <Link to={`update/${rowOriginal.id}`} state={rowOriginal} className={styles.link}>
      <IconEdit svgClass={styles.svg} />
    </Link>
  );
}

function DeleteControl({ rowOriginal }: DeleteControl): React.JSX.Element {
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
