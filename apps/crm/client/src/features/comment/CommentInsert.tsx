import { useState } from 'react';

import { UserCircle } from '#Components/general';
// TEMP DEV: .
import userImage from '#Img/image-35.jpg';

import styles from './_CommentInsert.module.scss';

function CommentInsert(): JSX.Element {
  const [editInputValue, setEditInputValue] = useState<string>('');

  return (
    <div className={styles.commentInsert}>
      <UserCircle userImage={userImage} />
      <input
        type="text"
        aria-label="insert comment"
        value={editInputValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditInputValue(e.target.value)}
        className={styles.input}
      />
    </div>
  );
}

export default CommentInsert;
