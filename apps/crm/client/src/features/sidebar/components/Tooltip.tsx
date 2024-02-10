import { PropsWithChildren } from 'react';
import styles from './_ToolTip.module.scss';

interface IProps {
  text: string;
}

function ToolTip({ text, children = undefined }: PropsWithChildren<IProps>): JSX.Element {
  return (
    <div className={styles.toolTip}>
      <span className={styles.toolTip__text}>{text}</span>
      {children}
    </div>
  );
}

export default ToolTip;
