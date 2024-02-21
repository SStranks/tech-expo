import { useForm } from 'react-hook-form';
import styles from './_LoginPage.module.scss';
import { useNavigate } from 'react-router-dom';

interface IInputs {
  email: string;
  password: string;
}

function LoginPage(): JSX.Element {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IInputs>();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    console.log('Login form submission:', data);
    if (data.email === 'admin@admin.com' && data.password === '123') {
      window.localStorage.setItem('CRM Login Token', 'Valid');
      navigate('/');
    }
  });

  return (
    <div className={styles.formContainer}>
      <form onSubmit={onSubmit} className={styles.loginForm}>
        <h1>Sign In</h1>
        <input
          type="email"
          aria-label="email"
          aria-invalid={errors.email ? true : false}
          {...register('email', { required: true })}
        />
        <input
          type="password"
          aria-label="password"
          aria-invalid={errors.password ? true : false}
          {...register('password', { required: true })}
        />
        <div className={styles.options}>
          <label>
            <input type="checkbox" />
            Remember Credentials?
          </label>
          <span>Forgot Password</span>
        </div>
        <button type="submit">Sign In</button>
        <p>
          Don&#39;t have an account?<span>Sign up here</span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
