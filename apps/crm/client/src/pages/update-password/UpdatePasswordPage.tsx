import type { TInputPasswordStrength } from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { lazy, Suspense, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Input } from '@Components/react-hook-form';
import InputPasswordSkeleton from '@Components/react-hook-form/input-password/InputPasswordSkeleton';
import InputUx from '@Components/react-hook-form/InputUx';
import { PASSWORDCONFIRM_RULES } from '@Components/react-hook-form/validationRules';
import serviceHttp from '@Services/serviceHttp';

import styles from './UpdatePasswordPage.module.scss';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('@Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

export interface IInputs {
  'confirm-password': string;
  'new-password': string;
}

const defaultValues: IInputs = {
  'confirm-password': '',
  'new-password': '',
};

function UpdatePasswordPage(): React.JSX.Element {
  const methods = useForm<IInputs>({ defaultValues });
  const navigate = useNavigate();
  const confirmPasswordId = useId();

  const onSubmit = methods.handleSubmit(async (data) => {
    serviceHttp.accountUpdatePassword({ ...data });
    navigate('/login');
  });

  return (
    <FormProvider {...methods}>
      <div className={styles.formContainer}>
        <form
          name="password-update-form"
          onSubmit={onSubmit}
          aria-labelledby="heading"
          className={styles.updatePasswordForm}
          noValidate>
          <h1 id="heading">Set New Password</h1>
          <Suspense fallback={<InputPasswordSkeleton label="Password" />}>
            <InputPasswordStrength
              name="new-password"
              defaultValue={defaultValues?.['new-password']}
              reveal={false}
              label="Password"
            />
          </Suspense>
          <InputUx
            id={confirmPasswordId}
            label="Confirm Password"
            name="confirm-password"
            rules={PASSWORDCONFIRM_RULES('new-password')}
            defaultValue={defaultValues?.['confirm-password']}>
            <Input
              id={confirmPasswordId}
              type="password"
              name="confirm-password"
              rules={PASSWORDCONFIRM_RULES('new-password')}
              autoComplete="new-password"
            />
          </InputUx>
          <button type="submit" className={styles.updatePasswordForm__submitBtn}>
            Update Password
          </button>
        </form>
      </div>{' '}
    </FormProvider>
  );
}

export default UpdatePasswordPage;
