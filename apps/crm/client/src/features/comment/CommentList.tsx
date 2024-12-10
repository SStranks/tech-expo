import { CommentPosted } from './index';

import styles from './CommentList.module.scss';

function CommentList(): React.JSX.Element {
  return (
    <div className={styles.commentList}>
      <CommentPosted />
    </div>
  );
}

export default CommentList;
