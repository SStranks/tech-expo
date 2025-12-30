import type { TableDataQuotes } from '@Data/MockData';

import UserCircleAbbv from '@Components/general/UserCircleAbbv';

import styles from './QuotesParticipants.module.scss';

type Props = {
  participantBy: TableDataQuotes['prepared by'];
  participantFor: TableDataQuotes['prepared for'];
};

function QuoteParticipants(props: Props): React.JSX.Element {
  const { participantBy, participantFor } = props;

  return (
    <div className={styles.quoteParticipants}>
      <UserCircleAbbv userName={participantBy} />
      <UserCircleAbbv userName={participantFor} />
    </div>
  );
}

export default QuoteParticipants;
