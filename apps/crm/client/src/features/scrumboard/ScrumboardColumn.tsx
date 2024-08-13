import { ScrumboardCard, ScrumboardColumnOptionsBtn } from './index';
import { IconCirclePlus } from '#Components/svg';
import styles from './_ScrumboardColumn.module.scss';

// TEMP DEV: .
const columnTitle = 'unassigned';
const cardsTotal = 5;

interface IScrumboardColumn {
  pipeline?: { pipelineColumnTotal: string; pipelineStage?: 'won' | 'lost' };
}

function ScrumboardColumn(props: IScrumboardColumn): JSX.Element {
  const { pipeline } = props;
  const pipelineStage = pipeline?.pipelineStage;

  return (
    <div className={`${styles.column} ${pipelineStage ? styles[`column--${pipelineStage}`] : ''}`}>
      <div className={`${styles.column__header} ${pipelineStage ? styles[`column__header--${pipelineStage}`] : ''}`}>
        <div className={styles.headerPanel}>
          <div className={styles.headerDetails}>
            <span>{columnTitle}</span>
            {cardsTotal > 0 && (
              <div className={styles.cardsTotal}>
                <span>{cardsTotal}</span>
              </div>
            )}
          </div>
          <div className={styles.headerControls}>
            <ScrumboardColumnOptionsBtn />
            <button type="button" className={styles.addCardBtn}>
              <IconCirclePlus />
            </button>
          </div>
        </div>
        {pipeline && <span className={styles.pipelineTotal}>${pipeline?.pipelineColumnTotal}</span>}
      </div>
      <div className={styles.column__cards}>
        <ScrumboardCard pipelineStage={pipelineStage} />
        <ScrumboardCard />
        <ScrumboardCard />
      </div>
    </div>
  );
}

export default ScrumboardColumn;
