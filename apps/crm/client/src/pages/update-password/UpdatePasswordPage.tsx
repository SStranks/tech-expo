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
    setFocus,
    getValues,
    formState: { errors },
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
            trigger={trigger}
            setFocus={setFocus}
            inputName="newPassword"
            placeholder="Enter a strong password"
            error={errors.newPassword}
            reveal={false}
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
