import { PropsWithChildren } from 'react';

import styles from './_TableGridCard.module.scss';

interface ITableGridCard {
  id: string;
}

function TableGridCard({ id, children }: PropsWithChildren<ITableGridCard>): JSX.Element {
  return (
    <div className={styles.tableGridCard} data-table-row-id={id}>
      {children}
    </div>
  );
}

function UpperSection({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.tableGridCard__upper}>{children}</div>;
}

function LowerSection({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.tableGridCard__lower}>{children}</div>;
}

TableGridCard.UpperSection = UpperSection;
TableGridCard.LowerSection = LowerSection;

export default TableGridCard;
