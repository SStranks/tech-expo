import { useId } from 'react';

import { IconCircleInfo, IconEye } from '@Components/svg';

import InputUx from '../InputUx';

import skeleton from './InputPasswordSkeleton.module.scss';
import styles from './InputPasswordStrength.module.scss';

interface IProps {
  label: string;
}

function InputPasswordSkeleton(props: IProps): React.JSX.Element {
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
              <IconCircleInfo svgClass={styles.icons__btn__svg} />
            </button>
          </div>
        </InputUx>
      </div>
      <div className={`${styles.result} ${skeleton.result}`} />
    </div>
  );
}

export default InputPasswordSkeleton;
