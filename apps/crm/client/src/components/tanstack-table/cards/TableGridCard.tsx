import { PropsWithChildren } from 'react';
import { ButtonOptions } from '#Components/buttons';
import styles from './_TableGridCard.module.scss';

function TableGridCard({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className={styles.tableGridCard}>
      <div className={styles.tableGridCard__optionsBtn}>
        <ButtonOptions />
      </div>
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
