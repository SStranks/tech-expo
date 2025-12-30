import { useId } from 'react';

import IconCircleInfo from '@Components/svg/IconCircleInfo';
import IconEye from '@Components/svg/IconEye';

import InputUx from '../InputUx';

import skeleton from './InputPasswordSkeleton.module.scss';
import styles from './InputPasswordStrength.module.scss';

type Props = {
  label: string;
};

function InputPasswordSkeleton(props: Props): React.JSX.Element {
  const { label } = props;
  const passwordId = useId();

  return (
    <div className={`${styles.container} ${skeleton.container}`}>
      <div className={skeleton.wrapper}>
        <InputUx name="password" label={label} id={passwordId} defaultValue={undefined} rules={{}} disabled={false}>
          <input
            type="password"
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
