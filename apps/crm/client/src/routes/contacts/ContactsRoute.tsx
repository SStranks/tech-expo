import { TableContacts } from '#Components/tanstack-table/tables';
import { tableDataContacts } from '#Data/MockData';
import ViewportLayout from '#Layouts/ViewportLayout';
import styles from './_ContactsRoute.module.scss';

function ContactsRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <div className={styles.contactsRouteLayout}>
        <div className={styles.table}>
          <TableContacts tableData={tableDataContacts} />
        </div>
      </div>
    </ViewportLayout>
  );
}

export default ContactsRoute;
