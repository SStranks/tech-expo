import type { SvgIcon } from '@Components/svg';

import { useState } from 'react';

import IconEdit from '@Components/svg/IconEdit';

import styles from './EditableRow.module.scss';

interface Props {
  IconSvg: SvgIcon;
  title: string;
  description: string;
}

// Consuming components: CompaniesTableInformation, UserSettingsModal
function EditableRow(props: Props): React.JSX.Element {
  const { description, IconSvg, title } = props;
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

export default EditableRow;
