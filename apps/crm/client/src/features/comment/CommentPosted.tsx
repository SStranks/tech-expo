import { useState } from 'react';

import ButtonCancel from '@Components/buttons/ButtonCancel';
import ButtonSave from '@Components/buttons/ButtonSave';
import UserCircle from '@Components/general/UserCircle';
// TEMP DEV: .
import userImage from '@Img/image-35.jpg';

import styles from './CommentPosted.module.scss';

const userName = 'Creed Bob';
const dateTime = 'April 27, 2024 - 2:27pm';

const deleteBtnClickHandler = () => {
  console.log('Fired');
};

function CommentPosted(): React.JSX.Element {
  const [editInputValue, setEditInputValue] = useState<string>('');
  const [editTextAreaValue, setEditTextAreaValue] = useState<string>('');
  const [editActive, setEditActive] = useState<boolean>(false);

  const editBtnClickHandler = () => {
    setEditActive(true);
    setEditTextAreaValue(editInputValue);
  };

  const cancelBtnClickHandler = () => {
    setEditActive(false);
  };

  const saveBtnClickHanlder = () => {
    setEditInputValue(editTextAreaValue);
    setEditActive(false);
  };

  return (
    <div className={styles.commentPosted}>
      <UserCircle userImage={userImage} />
      <div className={styles.commentPosted__details}>
        <div className={styles.commentPosted__header}>
          <span>{userName}</span>
          <span>{dateTime}</span>
        </div>
        {!editActive && (
          <input
            type="text"
            aria-label="insert comment"
            value={editInputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditInputValue(e.target.value)}
            className={styles.commentPosted__input}
          />
        )}
        {editActive && (
          <textarea
            value={editTextAreaValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditTextAreaValue(e.target.value)}
          />
        )}
        <div className={styles.commentPosted__buttons}>
          {!editActive && (
            <button type="button" onClick={editBtnClickHandler}>
              Edit
            </button>
          )}
          {!editActive && (
            <button type="button" onClick={deleteBtnClickHandler}>
              Delete
            </button>
          )}
          {editActive && <ButtonCancel onClick={cancelBtnClickHandler} />}
          {editActive && <ButtonSave onClick={saveBtnClickHanlder} name="" />}
        </div>
      </div>
    </div>
  );
}

export default CommentPosted;
