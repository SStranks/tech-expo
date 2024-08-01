import type { ITableDataQuotes } from '#Data/MockData';
import UserCircleAbbv from '#Components/general/UserCircleAbbv';
import styles from './_QuotesParticipants.module.scss';

interface IProps {
  participantBy: ITableDataQuotes['prepared by'];
  participantFor: ITableDataQuotes['prepared for'];
}

function QuoteParticipants(props: IProps): JSX.Element {
  const { participantBy, participantFor } = props;

  return (
    <div className={styles.quoteParticipants}>
      <UserCircleAbbv userName={participantBy} />
      <UserCircleAbbv userName={participantFor} />
    </div>
  );
}

export default QuoteParticipants;