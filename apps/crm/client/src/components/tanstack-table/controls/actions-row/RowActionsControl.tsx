import { IconDelete, IconEdit, IconEye, IconPhone } from '#Components/svg';
import { PropsWithChildren } from 'react';
import styles from './_RowActionsControl.module.scss';

interface IChildProps {
  onClick: () => void;
}

function RowActionsControl({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.rowActions}>{children}</div>;
}

function ViewControl({ onClick }: IChildProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      <IconEye svgClass={styles.svg} />
    </button>
  );
}

function CallControl({ onClick }: IChildProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      <IconPhone svgClass={styles.svg} />
    </button>
  );
}

function EditControl({ onClick }: IChildProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      <IconEdit svgClass={styles.svg} />
    </button>
  );
}

function DeleteControl({ onClick }: IChildProps): JSX.Element {
  return (
    <button type="button" onClick={onClick} className={styles.buttonDelete}>
      <IconDelete svgClass={styles.svg} />
    </button>
  );
}

RowActionsControl.ViewControl = ViewControl;
RowActionsControl.EditControl = EditControl;
RowActionsControl.CallControl = CallControl;
RowActionsControl.DeleteControl = DeleteControl;

export default RowActionsControl;
