import { CommentInsert, CommentList } from './index';

import styles from './CommentThread.module.scss';

// TODO:  Need to make Form wrapper and new input (thinner version of login ones)
function CommentThread(): React.JSX.Element {
  return (
    <div className={styles.commentThread}>
      <div className={styles.commentThread__insert}>
        <CommentInsert />
      </div>
      <div className={styles.commentThread__list}>
        <CommentList />
      </div>
    </div>
  );
}

export default CommentThread;
