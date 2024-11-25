import type { ITableDataQuotes } from '#Data/MockData';

import { IconCircleTick, IconFullScreen, IconSquareArrowTopRight } from '#Components/svg';

import styles from './_QuoteStage.module.scss';

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

interface IProps {
  stage: ITableDataQuotes['stage'];
}

function QuoteStage(props: IProps): JSX.Element {
  const { stage } = props;

  return (
    <div className={`${styles.quoteStage} ${styles[`quoteStage--${stage}`]}`}>
      {StageIcon(stage)}
      <span>{stage}</span>
    </div>
  );
}

export default QuoteStage;
