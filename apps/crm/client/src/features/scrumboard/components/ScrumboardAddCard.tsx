import styles from './_ScrumboardAddCard.module.scss';

function ScrumboardAddCard(): JSX.Element {
  return (
    <button type="button" onClick={() => console.log('click')} className={styles.addCard}>
      <span>Add New Card</span>
    </button>
  );
}

export default ScrumboardAddCard;
