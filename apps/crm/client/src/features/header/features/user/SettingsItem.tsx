import { useState } from 'react';
import { IIcon, IconEdit } from '#Components/svg';
import styles from './_SettingsItem.module.scss';

interface IProps {
  IconSvg: IIcon;
  title: string;
  description: string;
}

function SettingsItem(props: IProps): JSX.Element {
  const { IconSvg, title, description } = props;
  const [editSettingActive, setEditSettingActive] = useState<boolean>(false);
  const [editInputValue, setEditInputValue] = useState<string>(description);

  const editBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSettingActive(true);
  };

  const cancelBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSettingActive(false);
  };

  const saveBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSettingActive(false);
    console.log(editInputValue);
  };

  return (
    <div className={styles.item}>
      <IconSvg svgClass={styles.item__svg} />
      <span className={styles.item__title}>{title}</span>
      {!editSettingActive && <span className={styles.item__description}>{description}</span>}
      {!editSettingActive && (
        <button
          type="button"
          onClick={editBtnClickHandler}
          className={styles.item__edit}
          aria-label={`show edit ${title} input`}>
          <IconEdit svgClass={styles.item__edit__svg} />
        </button>
      )}
      {editSettingActive && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            aria-label={`edit ${title}`}
            value={editInputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditInputValue(e.target.value)}
            className={styles.inputGroup__input}
          />
          <button type="button" onClick={cancelBtnClickHandler} className={styles.inputGroup__cancelBtn}>
            Cancel
          </button>
          <button type="button" onClick={saveBtnClickHandler} className={styles.inputGroup__saveBtn}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default SettingsItem;
