import type { TInputPasswordStrength } from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { lazy, Suspense, useId } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Input } from '@Components/react-hook-form';
import InputPasswordSkeleton from '@Components/react-hook-form/input-password/InputPasswordSkeleton';
import InputUx from '@Components/react-hook-form/InputUx';
import { PASSWORD_RULES } from '@Components/react-hook-form/validationRules';

import styles from './UpdatePasswordPage.module.scss';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('@Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

interface IInputs {
  newPassword: string;
  confirmPassword: string;
}

function UpdatePasswordPage(): JSX.Element {
  const {
    control,
    formState: { dirtyFields, errors, isSubmitted },
    formState,
    getFieldState,
    getValues,
    handleSubmit,
    register,
    trigger,
  } = useForm<IInputs>({ defaultValues: { confirmPassword: '', newPassword: '' }, mode: 'onChange' });
  const { invalid: newPasswordInvalid } = getFieldState('newPassword', formState);
  const { invalid: confirmPasswordInvalid } = getFieldState('confirmPassword', formState);
  const navigate = useNavigate();
  const confirmPasswordId = useId();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    navigate('/login');
  });

  return (
    <div className={styles.formContainer}>
      <form
        name="password update form"
        onSubmit={onSubmit}
        aria-labelledby="heading"
        className={styles.updatePasswordForm}
        noValidate>
        <h1 id="heading">Set New Password</h1>
        <Suspense fallback={<InputPasswordSkeleton label="Password" />}>
          <InputPasswordStrength
            register={register}
            control={control}
            trigger={trigger}
            inputName="newPassword"
            error={errors.newPassword}
            isRequired
            isDirty={dirtyFields.newPassword}
            invalid={newPasswordInvalid}
            isSubmitted={isSubmitted}
            reveal={false}
            label="Password"
          />
        </Suspense>
        <InputUx
          id={confirmPasswordId}
          label="Confirm Password"
          error={errors['confirmPassword']}
          isDirty={dirtyFields['confirmPassword']}
          invalid={confirmPasswordInvalid}
          isRequired={PASSWORD_RULES?.required}
          isSubmitted={isSubmitted}>
          <Input
            id={confirmPasswordId}
            type="password"
            register={{
              ...register('confirmPassword', {
                required: {
                  message: 'Please enter your new password again',
                  value: true,
                },
                validate: {
                  matchNewPassword: (v: string) => {
                    return v === getValues('newPassword') || 'Passwords must be identical';
                  },
                },
              }),
            }}
            isRequired
            error={errors.confirmPassword}
          />
        </InputUx>
        <button type="submit" className={styles.updatePasswordForm__submitBtn}>
          Update Password
        </button>
      </form>
    </div>
  );
}

export default UpdatePasswordPage;
