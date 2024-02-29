import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactPortal } from '#Components/index';
import usePortalClose from '#Hooks/usePortalClose';
import { IconLogout, IconSettings } from '#Svg/icons';
import UserIcon from '#Svg/icons/User Circle.svg';
import styles from './_UserSettingsMenu.module.scss';
import UserSettingsModal from './UserSettingsModal';
import { useNavigate } from 'react-router-dom';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '#Utils/cssTransitionGroup';

interface IProps {
  userName: string;
}

function UserSettingsMenu(props: IProps): JSX.Element {
  const { userName } = props;
  const [menuPortalActive, setMenuPortalActive] = useState<boolean>(false);
  const [settingsPortalActive, setSettingsPortalActive] = useState<boolean>(false);
  const menuPortalContentRef = useRef<HTMLDivElement>(null);
  const menuPortalButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  usePortalClose(menuPortalActive, setMenuPortalActive, menuPortalContentRef, menuPortalButtonRef);

  const menuIconClickHandler = () => {
    setMenuPortalActive((p) => !p);
  };

  const settingsBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPortalActive(false);
    setSettingsPortalActive(true);
  };

  const logoutBtnClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.localStorage.removeItem('CRM Login Token');
    navigate('/login');
  };

  return (
    <>
      <button
        type="button"
        onClick={menuIconClickHandler}
        className={styles.userIcon}
        ref={menuPortalButtonRef}
        aria-label="user settings menu">
        <img src={UserIcon} alt="user icon" className={styles.userIcon__svg} />
      </button>
      <ReactPortal wrapperId="portal-usersettings">
        <CSSTransition
          in={menuPortalActive}
          timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={menuPortalContentRef}>
          <div
            style={{ left: menuPortalButtonRef.current?.getBoundingClientRect().right }}
            className={styles.portalContent}
            data-testid="user-settings"
            ref={menuPortalContentRef}>
            <div className={styles.portalContent__header}>
              <h5>UserID: {userName}</h5>
            </div>
            <div className={styles.portalContent__buttons}>
              <button type="button" onClick={settingsBtnClickHandler} className={styles.userSettingsBtn}>
                <img src={IconSettings} alt="" className={styles.userSettingsBtn__svg} />
                User Settings
              </button>
              <button type="button" onClick={logoutBtnClickHandler} className={styles.logoutBtn}>
                <img src={IconLogout} alt="" className={styles.logoutBtn__svg} />
                Logout
              </button>
            </div>
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
