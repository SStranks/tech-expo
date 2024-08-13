import { UserCircle } from '#Components/general';
import CompanyLogo from '#Img/Microsoft_logo.png';
import UserImg from '#Img/image-35.jpg';
import { ScrumboardCardOptionsBtn } from '.';
import styles from './_ScrumboardCard.module.scss';

// TEMP DEV: .
const companyName = 'MicrosoftMicrosoftMicrosoftMicrosoftMicrosoftMicrosoft';
const dealTitle = 'Bespoke Nonsense';
const daysElapsed = 27;
const dealTotal = '27,000';

interface IProps {
  pipelineStage?: 'won' | 'lost';
}

function ScrumBoardCard({ pipelineStage }: IProps): JSX.Element {
  return (
    <div className={`${styles.card} ${pipelineStage ? styles[`card--${pipelineStage}`] : ''}`}>
      <div className={styles.card__upper}>
        <img src={CompanyLogo} alt="" className={styles.companyLogo} />
        <div className={styles.dealInfo}>
          <div className={styles.dealInfo__upper}>
            <span className={styles.dealInfo__company}>{companyName}</span>
            <ScrumboardCardOptionsBtn />
          </div>
          <span className={styles.dealInfo__title}>{dealTitle}</span>
        </div>
      </div>
      <div className={styles.card__lower}>
        <div className={styles.card__lower__details}>
          <UserCircle userImage={UserImg} alt={UserImg} />
          <span>
            {daysElapsed} day{daysElapsed > 1 ? 's' : ''} ago
          </span>
        </div>
        <span className={styles.card__lower__total}>${dealTotal}</span>
      </div>
    </div>
  );
}

export default ScrumBoardCard;
