import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputPasswordSkeleton from '#Components/react-hook-form/input-password/InputPasswordSkeleton';
import type { TInputPasswordStrength } from '#Components/react-hook-form/input-password/InputPasswordStrength';
import styles from './_UpdatePasswordPage.module.scss';
import { Input } from '#Components/react-hook-form';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('#Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

interface IInputs {
  newPassword: string;
  confirmPassword: string;
}

function UpdatePasswordPage(): JSX.Element {
  const {
    register,
    trigger,
    control,
    getValues,
    formState: { errors, isValid, dirtyFields },
    handleSubmit,
  } = useForm<IInputs>({ mode: 'onChange', defaultValues: { newPassword: '', confirmPassword: '' } });
  const navigate = useNavigate();

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
            isDirty={dirtyFields.newPassword}
            reveal={false}
            label="Password"
          />
        </Suspense>
        <Input
          type="password"
          register={{
            ...register('confirmPassword', {
              required: {
                value: true,
                message: 'Please enter your new password again',
              },
              validate: {
                matchNewPassword: (v: string) => {
                  return v === getValues('newPassword') || 'Passwords must be identical';
                },
              },
            }),
          }}
          error={errors.confirmPassword}
          isDirty={dirtyFields.confirmPassword}
          label="Confirm Password"
        />
        <button type="submit" className={styles.updatePasswordForm__submitBtn} disabled={!isValid}>
          Update Password
        </button>
      </form>
    </div>
  );
}

export default UpdatePasswordPage;
