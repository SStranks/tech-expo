import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input, RulesEmail } from '#Components/react-hook-form';
import { PASSWORD_RULES } from '#Components/react-hook-form/validationRules';
import styles from './_LoginPage.module.scss';

interface IInputs {
  email: string;
  password: string;
}

// TODO:  Think about security; remembering credentials?
function LoginPage(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<IInputs>({ mode: 'onChange', defaultValues: { email: '', password: '' } });
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
        <Input
          type="email"
          register={{ ...register('email', RulesEmail) }}
          error={errors.email}
          isDirty={dirtyFields.email}
          label="Email address"
        />
        <Input
          type="password"
          register={{ ...register('password', PASSWORD_RULES) }}
          error={errors.password}
          isDirty={dirtyFields.password}
          label="Password"
        />
        <div className={styles.options}>
          <label>
            <input type="checkbox" />
            Remember Credentials?
          </label>
          <Link to={'/forgot-password'}>
            <span className={styles.loginForm__link}>Forgot Password</span>
          </Link>
        </div>
        <button type="submit" className={styles.loginForm__submitBtn} disabled={!isValid}>
          Sign In
        </button>
        <p>
          Don&#39;t have an account?
          <Link to={'/register'}>
            <span className={styles.loginForm__link}>Sign up here</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
