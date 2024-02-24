import { lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import InputPasswordSkeleton from '#Components/react-hook-form/input-password/InputPasswordSkeleton';
import type { TInputPasswordStrength } from '#Components/react-hook-form/input-password/InputPasswordStrength';
import styles from './_UpdatePasswordPage.module.scss';

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
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm<IInputs>();
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
        className={styles.resetPasswordForm}
        noValidate>
        <h1 id="heading">Set New Password</h1>
        {errors.newPassword && <span role="alert">{errors.newPassword.message}</span>}
        <Suspense fallback={<InputPasswordSkeleton />}>
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
        {errors.confirmPassword && <span role="alert">{errors.confirmPassword.message}</span>}
        <input
          type="password"
          autoComplete="new-password"
          aria-label="confirm new password"
          aria-invalid={errors.confirmPassword ? true : false}
          {...register('confirmPassword', {
            required: {
              value: true,
              message: 'Please enter your new password again',
            },
            validate: {
              matchNewPassword: (v: string) => {
                return v === getValues('newPassword') || 'Passwords must be identical';
              },
            },
          })}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}

export default UpdatePasswordPage;
