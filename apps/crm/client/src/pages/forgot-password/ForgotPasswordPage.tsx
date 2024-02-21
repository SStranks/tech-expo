import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './_ForgotPasswordPage.module.scss';

interface IInputs {
  email: string;
}

function ForgotPasswordPage(): JSX.Element {
  const {
    register,
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
        name="password reset form"
        onSubmit={onSubmit}
        aria-labelledby="heading"
        className={styles.resetPasswordForm}
        noValidate>
        <h1 id="heading">Password Reset</h1>
        {errors.email && <span role="alert">{errors.email.message}</span>}
        <input
          type="email"
          aria-label="email"
          aria-invalid={errors.email ? true : false}
          {...register('email', {
            required: {
              value: true,
              message: 'Please enter a valid email',
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          })}
        />
        <button type="submit">Email Reset Instructions</button>
        <p>
          Already have an account?
          <Link to={'/login'}>
            <span>Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
