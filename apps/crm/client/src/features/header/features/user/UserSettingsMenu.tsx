import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import ReactPortal from '@Components/modal/ReactPortal';
import IconLogout from '@Components/svg/IconLogout';
import IconSettings from '@Components/svg/IconSettings';
import IconUser from '@Components/svg/IconUser';
import usePortalClose from '@Hooks/usePortalClose';
import usePortalResizeEvent from '@Hooks/usePortalResizeEvent';
import { useReduxDispatch } from '@Redux/hooks';
import { logout } from '@Redux/reducers/authSlice';
import {
  CTG_ENTER_MODAL,
  CTG_EXIT_MODAL,
  CTG_ON_ENTER_CSS_ROOT,
  CTG_ON_EXITED_CSS_ROOT,
} from '@Utils/cssTransitionGroup';

import UserSettingsModal from './UserSettingsModal';

import styles from './UserSettingsMenu.module.scss';

// Defined at top of 'styles' scss; used to offset portal from window edge
const CSS_ROOT_PROPERTY = '--user-settings-menu-offset-x';

const GET_MENU_PORTAL_BTN_RECT = (menuPortalButtonRef: React.RefObject<HTMLButtonElement | null>) => {
  return `${menuPortalButtonRef.current?.getBoundingClientRect().right}px`;
};

const PORTAL_ONRESIZE = (menuPortalButtonRef: React.RefObject<HTMLButtonElement | null>) => {
  const CSS_ROOT = document.querySelector(':root') as HTMLElement;
  const cssValue = GET_MENU_PORTAL_BTN_RECT(menuPortalButtonRef);
  CSS_ROOT?.style.setProperty(CSS_ROOT_PROPERTY, cssValue);
};

interface Props {
  userName: string;
}

function UserSettingsMenu(props: Props): React.JSX.Element {
  const { userName } = props;
  const reduxDispatch = useReduxDispatch();
  const [menuPortalActive, setMenuPortalActive] = useState<boolean>(false);
  const [settingsPortalActive, setSettingsPortalActive] = useState<boolean>(false);
  const menuPortalContentRef = useRef<HTMLDivElement>(null);
  const menuPortalButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  usePortalClose(menuPortalActive, setMenuPortalActive, menuPortalContentRef, menuPortalButtonRef);
  usePortalResizeEvent(menuPortalActive, () => PORTAL_ONRESIZE(menuPortalButtonRef));

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
    reduxDispatch(logout());
    navigate('/');
  };

  return (
    <>
      <button
        type="button"
        onClick={menuIconClickHandler}
        className={styles.userIcon}
        ref={menuPortalButtonRef}
        aria-label="user settings menu">
        <IconUser svgClass={styles.userIcon__svg} />
      </button>
      <ReactPortal wrapperId="portal-usersettings">
        <CSSTransition
          in={menuPortalActive}
          timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
          onEnter={() => CTG_ON_ENTER_CSS_ROOT(CSS_ROOT_PROPERTY, GET_MENU_PORTAL_BTN_RECT(menuPortalButtonRef))}
          onExited={() => CTG_ON_EXITED_CSS_ROOT(CSS_ROOT_PROPERTY)}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={menuPortalContentRef}>
          <div className={styles.portalContent} data-testid="user-settings" ref={menuPortalContentRef}>
            <div className={styles.portalContent__header}>
              <h5>UserID: {userName}</h5>
            </div>
            <div className={styles.portalContent__buttons}>
              <button
                type="button"
                onClick={settingsBtnClickHandler}
                className={styles.userSettingsBtn}
                aria-label="User Settings">
                <IconSettings svgClass={styles.userSettingsBtn__svg} />
                User Settings
              </button>
              <button type="button" onClick={logoutBtnClickHandler} className={styles.logoutBtn}>
                <IconLogout svgClass={styles.logoutBtn__svg} />
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
