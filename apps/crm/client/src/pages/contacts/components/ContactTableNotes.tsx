import { TableSingleColumn } from '@Components/general';
import { IconList } from '@Components/svg';
import { CommentThread } from '@Features/comment';

import styles from './ContactTableNotes.module.scss';

function ContactTableNotes(): JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <IconList svgClass={styles.header__svg} />
          <span className={styles.header__title}>Notes</span>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <CommentThread />
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default ContactTableNotes;
