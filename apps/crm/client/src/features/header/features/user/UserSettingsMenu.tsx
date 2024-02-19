import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactPortal } from '#Components/index';
import usePortalClose from '#Hooks/usePortalClose';
import { IconLogout, IconSettings } from '#Svg/icons';
import UserIcon from '#Svg/icons/User Circle.svg';
import styles from './_UserSettingsMenu.module.scss';
import UserSettingsModal from './UserSettingsModal';

interface IProps {
  userName: string;
}

function UserSettingsMenu(props: IProps): JSX.Element {
  const { userName } = props;
  const [menuPortalActive, setMenuPortalActive] = useState<boolean>(false);
  const [settingsPortalActive, setSettingsPortalActive] = useState<boolean>(false);
  const menuPortalContentRef = useRef<HTMLDivElement>(null);
  const menuPortalButtonRef = useRef<HTMLButtonElement>(null);
  usePortalClose(menuPortalActive, setMenuPortalActive, menuPortalContentRef, menuPortalButtonRef);

  const menuIconClickHandler = () => {
    setMenuPortalActive((p) => !p);
  };

  const settingsIconClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPortalActive(false);
    setSettingsPortalActive(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={menuIconClickHandler}
        className={styles.userIcon}
        ref={menuPortalButtonRef}
        aria-label="user settings menu">
        <img src={UserIcon} alt="user icon" />
      </button>
      <ReactPortal wrapperId="portal-usersettings">
        <CSSTransition
          in={menuPortalActive}
          timeout={{ enter: 1500, exit: 1000 }}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={menuPortalContentRef}>
          <div className={styles.userMenu} data-testid="user-settings" ref={menuPortalContentRef}>
            <span>UserID: {userName}</span>
            <button type="button" onClick={settingsIconClickHandler} className={styles.userMenu__userSettingsBtn}>
              <img src={IconSettings} alt="" />
              User Settings
            </button>
            <button type="button" className={styles.userMenu__logoutBtn}>
              <img src={IconLogout} alt="" />
              Logout
            </button>
          </div>
        </CSSTransition>
      </ReactPortal>
      <UserSettingsModal
        userName={userName}
        settingsPortalActive={settingsPortalActive}
        setSettingsPortalActive={setSettingsPortalActive}
      />
    </>
  );
}
export default UserSettingsMenu;
