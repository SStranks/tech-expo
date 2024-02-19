import { IconEdit } from '#Svg/icons';
import { useState } from 'react';
import styles from './_SettingsItem.module.scss';

interface IProps {
  icon: string;
  title: string;
  description: string;
}

function SettingsItem(props: IProps): JSX.Element {
  const { icon, title, description } = props;
  const [editSettingActive, setEditSettingActive] = useState<boolean>(false);

  const editBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSettingActive(true);
  };

  const cancelBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditSettingActive(false);
  };

  return (
    <div className={styles.item}>
      <img src={icon} alt="icon" className={styles.item__icon} />
      <span className={styles.item__title}>{title}</span>
      <span className={styles.item__description}>{description}</span>
      {!editSettingActive && (
        <button type="button" onClick={editBtnClickHandler} className={styles.item__edit} aria-label={`edit ${title}`}>
          <img src={IconEdit} alt="" />
        </button>
      )}
      {editSettingActive && (
        <div className="">
          <input type="text" />
          <button type="button" onClick={cancelBtnClickHandler}>
            Cancel
          </button>
          <button type="button">Save</button>
        </div>
      )}
    </div>
  );
}

export default SettingsItem;
