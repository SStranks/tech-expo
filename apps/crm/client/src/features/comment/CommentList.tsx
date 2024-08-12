import styles from './_CommentList.module.scss';
import { CommentPosted } from './index';

function CommentList(): JSX.Element {
  return (
    <div className={styles.commentList}>
      <CommentPosted />
    </div>
  );
}

export default CommentList;
