import styles from './_InputPasswordStrength.module.scss';

function InputPasswordSkeleton(): JSX.Element {
  return (
    <div className={styles.container}>
      <input type="text" />
    </div>
  );
}

export default InputPasswordSkeleton;
