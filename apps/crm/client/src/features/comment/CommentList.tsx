import { CommentPosted } from './index';

import styles from './_CommentList.module.scss';

function CommentList(): JSX.Element {
  return (
    <div className={styles.commentList}>
      <CommentPosted />
    </div>
  );
}

export default CommentList;
