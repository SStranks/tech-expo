import type { TScrumboardPage } from './Scrumboard';
import { ScrumboardAddStage, ScrumboardColumn } from './index';
import styles from './_ScrumboardColumns.module.scss';

interface IProps {
  page: TScrumboardPage;
}

function ScrumboardColumns({ page }: IProps): JSX.Element {
  return (
    <div className={styles.columns}>
      <ScrumboardColumn pipeline={{ pipelineColumnTotal: '27,000' }} />
      <ScrumboardColumn pipeline={{ pipelineColumnTotal: '27,000' }} />
      <ScrumboardAddStage />
      {page === 'pipeline' && <ScrumboardColumn pipeline={{ pipelineColumnTotal: '33,000', pipelineStage: 'won' }} />}
      {page === 'pipeline' && <ScrumboardColumn pipeline={{ pipelineColumnTotal: '33,000', pipelineStage: 'lost' }} />}
    </div>
  );
}

export default ScrumboardColumns;
