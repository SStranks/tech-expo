import { EditableRow, TableSingleColumn } from '@Components/general';
import { IconCompanies } from '@Components/svg';

import styles from './ContactTableInformation.module.scss';

interface IUserInfo {
  username: string;
  email: string;
  company: string;
  title: string;
  phone: string;
  timezone: string;
  stage: string;
}

interface IProps {
  userInfo: IUserInfo;
}

function ContactTableInformation(props: IProps): React.JSX.Element {
  const { userInfo } = props;

  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <IconCompanies svgClass={styles.header__headerSvg} />
          <span className={styles.header__headerTitle}>User Information</span>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Email" description={userInfo.email} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Company Revenue" description={userInfo.company} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Company Industry" description={userInfo.title} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Company Type" description={userInfo.phone} />
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.row}>
          <EditableRow IconSvg={IconCompanies} title="Country" description={userInfo.timezone} />
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default ContactTableInformation;
