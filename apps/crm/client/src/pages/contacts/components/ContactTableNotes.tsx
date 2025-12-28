import TableSingleColumn from '@Components/general/TableSingleColumn';
import IconList from '@Components/svg/IconList';
import CommentThread from '@Features/comment/CommentThread';

import styles from './ContactTableNotes.module.scss';

function ContactTableNotes(): React.JSX.Element {
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
