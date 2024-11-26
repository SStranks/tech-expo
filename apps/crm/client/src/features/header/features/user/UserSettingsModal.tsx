import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { EditableRow, UserRole } from '@Components/general';
import { ReactPortal } from '@Components/index';
import { IconClose, IconEmail, IconPhone, IconSmartphone, IconTimezone, IconUserTitle } from '@Components/svg';
import { UserData } from '@Data/MockData';
import usePortalClose from '@Hooks/usePortalClose';
import CompanyLogo from '@Img/CompanyLogo.png';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '@Utils/cssTransitionGroup';

import styles from './UserSettingsModal.module.scss';

interface IProps {
  userName: string;
  settingsPortalActive: boolean;
  setSettingsPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function UserSettingsModal(props: IProps): JSX.Element {
  const { setSettingsPortalActive, settingsPortalActive, userName } = props;
  const portalRef = useRef<HTMLDivElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  const portalCloseButtonRef = useRef<HTMLButtonElement>(null);
  usePortalClose(settingsPortalActive, setSettingsPortalActive, portalContentRef, portalCloseButtonRef);

  const closeModalBtnClickHandler = () => {
    setSettingsPortalActive(false);
  };

  return (
    <ReactPortal wrapperId="portal-usersettings">
      <CSSTransition
        in={settingsPortalActive}
        timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
        unmountOnExit
        classNames={{
          enter: `${styles['enter']}`,
          enterActive: `${styles['enterActive']}`,
          enterDone: `${styles['enterDone']}`,
          exit: `${styles['exit']}`,
          exitActive: `${styles['exitActive']}`,
        }}
        nodeRef={portalRef}>
        <div className={styles.portalContent} ref={portalRef}>
          <div className={styles.userSettingsModal} ref={portalContentRef}>
            <div className={styles.titleBar}>
              <span>Account Settings: {userName}</span>
              <UserRole />
              <button
                type="button"
                onClick={closeModalBtnClickHandler}
                ref={portalCloseButtonRef}
                className={styles.titleBar__closeBtn}>
                <IconClose svgClass={styles.titleBar__closeBtn__svg} />
              </button>
            </div>
            <div className={styles.userProfile}>
              <img src={CompanyLogo} alt="user profile" />
              <span>{userName}</span>
            </div>
            <div className={styles.details}>
              <div>
                <img src="" alt="" />
                <span>{userName} Profile</span>
              </div>
              <EditableRow IconSvg={IconUserTitle} title="Organisation Role" description={UserData.role} />
              <EditableRow IconSvg={IconPhone} title="Office Phone" description={UserData.phone} />
              <EditableRow IconSvg={IconSmartphone} title="Mobile Phone" description={UserData.mobile} />
              <EditableRow IconSvg={IconEmail} title="Email" description={UserData.email} />
              <EditableRow IconSvg={IconTimezone} title="Time Zone" description={UserData.timezone} />
            </div>
          </div>
        </div>
      </CSSTransition>
    </ReactPortal>
  );
}

export default UserSettingsModal;
