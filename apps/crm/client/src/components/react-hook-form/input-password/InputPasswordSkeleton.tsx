import { useId } from 'react';
import { IconInfoCircle, IconEye } from '#Svg/icons';
import skeleton from './_InputPasswordSkeleton.module.scss';
import styles from './_InputPasswordStrength.module.scss';

interface IProps {
  label: string;
}

function InputPasswordSkeleton(props: IProps): JSX.Element {
  const { label } = props;
  const id = useId();

  return (
    <div className={`${styles.container} ${skeleton.container}`}>
      <div className={`${styles.wrapper} ${skeleton.wrapper}`}>
        <input
          type="password"
          id={`passwordInput-skeleton-${id}`}
          className={`${styles.wrapper__input} ${skeleton.wrapper__input}`}
          placeholder=""
          autoComplete="new-password"
        />
        <label
          htmlFor={`passwordInput-skeleton-${id}`}
          className={`${styles.wrapper__label} ${skeleton.wrapper__label}`}>
          {label}
        </label>
        <div className={`${styles.wrapper__icons} ${skeleton.wrapper__icons}`}>
          <button type="button" className={styles.wrapper__icons__btn}>
            <img src={IconEye} alt="Reveal password toggle" />
          </button>
          <button className={styles.wrapper__icons__btn}>
            <img src={IconInfoCircle} alt="Password criteria information" />
          </button>
        </div>
      </div>
      <div className={`${styles.result} ${skeleton.result}`} />
    </div>
  );
}

export default InputPasswordSkeleton;
