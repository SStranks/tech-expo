import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './_RegisterPage.module.scss';

interface IInputs {
  email: string;
  password: string;
}

function RegisterPage(): JSX.Element {
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
        name="register form"
        onSubmit={onSubmit}
        aria-labelledby="heading"
        className={styles.registerForm}
        noValidate>
        <h1 id="heading">Register Account</h1>
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
        {errors.password && <span role="alert">{errors.password.message}</span>}
        <input
          type="password"
          autoComplete="new-password"
          aria-label="password"
          aria-invalid={errors.password ? true : false}
          {...register('password', {
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
        <button type="submit">Register Account</button>
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

export default RegisterPage;
