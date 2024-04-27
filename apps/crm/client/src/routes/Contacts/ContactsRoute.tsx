import { IconAddCircle } from '#Components/svg';
import ListGridToggle from '#Components/buttons/list-grid-toggle/ListGridToggle';
import { tableDataContacts } from '#Data/MockData';
import ViewportLayout from '#Layouts/ViewportLayout';
import InputSearchField from './components/search-field/InputSearchField';
import styles from './_ContactsRoute.module.scss';
import TableContacts from '#Components/tanstack-table/tables/TableContacts';
import TableControls from '#Components/tanstack-table/TableControls';

const createContactClickHandler = () => {
  console.log('Click');
};

// TEMP DEV:  Value.
const ENTRIES_TOTAL = tableDataContacts.length;

function ContactsRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <div className={styles.contactsRouteLayout}>
        <div className={styles.header}>
          <button type="button" className={styles.header__createContactBtn} onClick={createContactClickHandler}>
            <span>Create Contact</span>
            <IconAddCircle svgClass={styles.header__createContactBtn__svg} />
          </button>
          <div className={styles.header__controls}>
            <InputSearchField label="Search Contacts" />
            <ListGridToggle />
          </div>
        </div>
        <div className={styles.table}>
          <TableContacts tableData={tableDataContacts} />
        </div>
        <div className={styles.tableControls}>
          <TableControls entriesName="contacts" entriesTotal={ENTRIES_TOTAL} />
        </div>
      </div>
    </ViewportLayout>
  );
}

export default ContactsRoute;
