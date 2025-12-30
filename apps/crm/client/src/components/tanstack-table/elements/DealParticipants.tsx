import type { ITableDataDeals } from '@Data/MockData';

import UserCircleAbbv from '@Components/general/UserCircleAbbv';

import styles from './QuotesParticipants.module.scss';

type Props = {
  dealOwner: ITableDataDeals['dealOwner'];
  dealContact: ITableDataDeals['dealContact'];
};

// REFACTOR:  Same as QuoteParticipants generally
function DealParticipants(props: Props): React.JSX.Element {
  const { dealContact, dealOwner } = props;

  return (
    <div className={styles.quoteParticipants}>
      <UserCircleAbbv userName={dealOwner} />
      <UserCircleAbbv userName={dealContact} />
    </div>
  );
}

export default DealParticipants;
