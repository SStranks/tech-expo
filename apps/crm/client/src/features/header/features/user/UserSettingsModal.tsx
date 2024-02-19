import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactPortal } from '#Components/index';
import UserRole from '#Components/ui/UserRole';
import usePortalClose from '#Hooks/usePortalClose';
import CompanyLogo from '#Img/CompanyLogo.png';
import styles from './_UserSettingsModal.module.scss';
import SettingsItem from './SettingsItem';
import { UserData } from '#Data/MockData';
import { IconEmail, IconPhone, IconSmartPhone, IconTimezone, IconUserTitle } from '#Svg/icons';

interface IProps {
  userName: string;
  settingsPortalActive: boolean;
  setSettingsPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserSettingsModal(props: IProps): JSX.Element {
  const { userName, settingsPortalActive, setSettingsPortalActive } = props;
  const settingsPortalContentRef = useRef<HTMLDivElement>(null);
  const settingsPortalButtonRef = useRef<HTMLButtonElement>(null);
  usePortalClose(settingsPortalActive, setSettingsPortalActive, settingsPortalContentRef, settingsPortalButtonRef);

  const closeModalBtnClickHandler = () => {
    setSettingsPortalActive(false);
  };

  return (
    <ReactPortal wrapperId="portal-usersettings">
      <CSSTransition
        in={settingsPortalActive}
        timeout={{ enter: 1500, exit: 1000 }}
        unmountOnExit
        classNames={{
          enter: `${styles['enter']}`,
          enterActive: `${styles['enterActive']}`,
          enterDone: `${styles['enterDone']}`,
          exit: `${styles['exit']}`,
          exitActive: `${styles['exitActive']}`,
        }}
        nodeRef={settingsPortalContentRef}>
        <div className={styles.userSettings} ref={settingsPortalContentRef}>
          <div className={styles.titleBar}>
            <span>Account Settings: {userName}</span>
            <UserRole />
            <button type="button" onClick={closeModalBtnClickHandler} ref={settingsPortalButtonRef}>
              X
            </button>
          </div>
          <div className={styles.userBar}>
            <img src={CompanyLogo} alt="user profile" />
            <span>{userName}</span>
          </div>
          <div className={styles.details}>
            <div className="">
              <img src="" alt="" />
              <span>{userName} Profile</span>
            </div>
            <SettingsItem icon={IconUserTitle} title="Organisation Role" description={UserData.role} />
            <SettingsItem icon={IconPhone} title="Office Phone" description={UserData.phone} />
            <SettingsItem icon={IconSmartPhone} title="Mobile Phone" description={UserData.mobile} />
            <SettingsItem icon={IconEmail} title="Email" description={UserData.email} />
            <SettingsItem icon={IconTimezone} title="Time Zone" description={UserData.timezone} />
          </div>
        </div>
      </CSSTransition>
    </ReactPortal>
  );
}

export default UserSettingsModal;
