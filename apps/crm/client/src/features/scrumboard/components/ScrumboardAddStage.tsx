import styles from './_ScrumboardAddStage.module.scss';

const addStageClickHandler = () => {
  console.log('Clicked');
};

function ScrumboardAddStage(): JSX.Element {
  return (
    <button type="button" onClick={addStageClickHandler} className={styles.addStage}>
      <span>Add Stage</span>
    </button>
  );
}

export default ScrumboardAddStage;
