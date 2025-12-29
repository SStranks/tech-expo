import type { TInputPasswordStrength } from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { lazy, Suspense, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import InputPasswordSkeleton from '@Components/react-hook-form/input-password/InputPasswordSkeleton';
import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';
import {
  PASSWORD_RULES,
  PASSWORDCONFIRM_RULES,
  VALIDATION_MESSAGES,
} from '@Components/react-hook-form/validationRules';
import { useServicesContext } from '@Context/servicesContext';

import styles from './UpdatePasswordPage.module.scss';

// import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';

// const { passwor} = validations

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('@Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

export interface DefaultValues {
  newPassword: string;
  newPasswordConfirm: string;
  oldPassword: string;
}

const defaultValues: DefaultValues = {
  newPassword: '',
  newPasswordConfirm: '',
  oldPassword: '',
};

function UpdatePasswordPage(): React.JSX.Element {
  const methods = useForm<DefaultValues>({ defaultValues });
  const navigate = useNavigate();
  const confirmPasswordId = useId();
  const oldPasswordId = useId();
  const { serviceHttp } = useServicesContext();

  const onSubmit = methods.handleSubmit(async (data) => {
    serviceHttp.account.updatepassword({ ...data });
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
              name="newPassword"
              defaultValue={defaultValues?.['newPassword']}
              reveal={false}
              label="Password"
            />
          </Suspense>
          <InputUx
            id={confirmPasswordId}
            label="Confirm Password"
            name="newPasswordConfirm"
            rules={PASSWORDCONFIRM_RULES}
            defaultValue={defaultValues?.['newPasswordConfirm']}
            disabled={false}>
            <Input
              id={confirmPasswordId}
              type="password"
              name="newPasswordConfirm"
              rules={{
                ...PASSWORDCONFIRM_RULES,
                validate: {
                  confirm: (confirmPassword) =>
                    confirmPassword === methods.getValues('newPassword') ||
                    VALIDATION_MESSAGES.PASSWORDCONFIRM_RULES.validate.confirm,
                },
              }}
              autoComplete="new-password"
            />
          </InputUx>
          <InputUx
            id={oldPasswordId}
            label="Old Password"
            name="oldPassword"
            rules={PASSWORD_RULES}
            defaultValue={defaultValues?.['oldPassword']}
            disabled={false}>
            <Input
              id={confirmPasswordId}
              type="password"
              name="oldPassword"
              rules={{ ...PASSWORD_RULES }}
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
