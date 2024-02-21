import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './_UpdatePasswordPage.module.scss';

interface IInputs {
  newPassword: string;
  confirmPassword: string;
}

function ForgotPasswordPage(): JSX.Element {
  const {
    register,
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
        <input
          type="password"
          autoComplete="new-password"
          aria-label="new password"
          aria-invalid={errors.newPassword ? true : false}
          {...register('newPassword', {
            required: {
              value: true,
              message: 'Please enter a valid password',
            },
            minLength: {
              value: 5,
              message: 'Minimum length; 5 characters',
            },
          })}
        />
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

export default ForgotPasswordPage;
