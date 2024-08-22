import type { ITableDataDeals } from '#Data/MockData';
import UserCircleAbbv from '#Components/general/UserCircleAbbv';
import styles from './_QuotesParticipants.module.scss';

interface IProps {
  dealOwner: ITableDataDeals['dealOwner'];
  dealContact: ITableDataDeals['dealContact'];
}

// REFACTOR:  Same as QuoteParticipants generally
function DealParticipants(props: IProps): JSX.Element {
  const { dealOwner, dealContact } = props;

  return (
    <div className={styles.quoteParticipants}>
      <UserCircleAbbv userName={dealOwner} />
      <UserCircleAbbv userName={dealContact} />
    </div>
  );
}

export default DealParticipants;
