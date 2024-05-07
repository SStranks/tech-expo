import { useId } from 'react';
import { IconEye, IconInfoCircle } from '#Components/svg';
import InputUx from '../InputUx';
import skeleton from './_InputPasswordSkeleton.module.scss';
import styles from './_InputPasswordStrength.module.scss';

interface IProps {
  label: string;
}

function InputPasswordSkeleton(props: IProps): JSX.Element {
  const { label } = props;
  const passwordId = useId();

  return (
    <div className={`${styles.container} ${skeleton.container}`}>
      <div className={skeleton.wrapper}>
        <InputUx label={label} id={passwordId} isDirty={false} invalid={false} error={undefined} isSubmitted={false}>
          <input
            type={'password'}
            id={passwordId}
            className={styles.inputPassword}
            placeholder=""
            aria-invalid={false}
            autoComplete="new-password"
          />
          <div className={styles.icons}>
            <button type="button" className={styles.icons__btn}>
              <IconEye svgClass={styles.icons__btn__svg} />
            </button>
            <button className={styles.icons__btn}>
              <IconInfoCircle svgClass={styles.icons__btn__svg} />
            </button>
          </div>
        </InputUx>
      </div>
      <div className={`${styles.result} ${skeleton.result}`} />
    </div>
  );
}

export default InputPasswordSkeleton;
