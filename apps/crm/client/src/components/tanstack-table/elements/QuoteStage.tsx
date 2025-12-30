import type { ITableDataQuotes } from '@Data/MockData';

import IconCircleTick from '@Components/svg/IconCircleTick';
import IconFullScreen from '@Components/svg/IconFullScreen';
import IconSquareArrowTopRight from '@Components/svg/IconSquareArrowTopRight';

import styles from './QuoteStage.module.scss';

function StageIcon(stage: ITableDataQuotes['stage']) {
  switch (stage) {
    case 'accepted': {
      return <IconCircleTick svgClass={styles.icon} />;
    }
    case 'draft': {
      return <IconFullScreen svgClass={styles.icon} />;
    }
    case 'sent': {
      return <IconSquareArrowTopRight svgClass={styles.icon} />;
    }
  }
}

type Props = {
  stage: ITableDataQuotes['stage'];
};

function QuoteStage(props: Props): React.JSX.Element {
  const { stage } = props;

  return (
    <div className={`${styles.quoteStage} ${styles[`quoteStage--${stage}`]}`}>
      {StageIcon(stage)}
      <span>{stage}</span>
    </div>
  );
}

export default QuoteStage;
