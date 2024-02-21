import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './_LoginPage.module.scss';

interface IInputs {
  email: string;
  password: string;
}

// TODO:  Think about security; remembering credentials?
function LoginPage(): JSX.Element {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IInputs>();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    if (data.email === 'admin@admin.com' && data.password === '12345') {
      window.localStorage.setItem('CRM Login Token', 'Valid');
      navigate('/');
    }
  });

  return (
    <div className={styles.formContainer}>
      <form name="sign-in form" onSubmit={onSubmit} aria-labelledby="heading" className={styles.loginForm} noValidate>
        <h1 id="heading">Sign In</h1>
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
        <div className={styles.options}>
          <label>
            <input type="checkbox" />
            Remember Credentials?
          </label>
          <Link to={'/forgot-password'}>
            <span>Forgot Password</span>
          </Link>
        </div>
        <button type="submit">Sign In</button>
        <p>
          Don&#39;t have an account?
          <Link to={'/register'}>
            <span>Sign up here</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
