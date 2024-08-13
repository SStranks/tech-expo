import { DragDropContext } from 'react-beautiful-dnd';
import { ScrumboardColumns } from './index';
import styles from './_Scrumboard.module.scss';

const onDragStart = () => {
  console.log('start');
};
const onDragEnd = () => {
  console.log('start');
};

export type TScrumboardPage = 'kanban' | 'pipeline';

interface IProps {
  page: TScrumboardPage;
}

function ScrumBoard({ page }: IProps): JSX.Element {
  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className={styles.scrumboard}>
        <ScrumboardColumns page={page} />
      </div>
    </DragDropContext>
  );
}

export default ScrumBoard;
