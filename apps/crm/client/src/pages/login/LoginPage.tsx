import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '#Components/react-hook-form';
import { PASSWORD_RULES, EMAIL_RULES } from '#Components/react-hook-form/validationRules';
import styles from './_LoginPage.module.scss';
import InputUx from '#Components/react-hook-form/InputUx';

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
        <InputUx
          errorMessage={errors['email']?.message}
          isDirty={dirtyFields['email']}
          isRequired={EMAIL_RULES?.required}>
          <Input
            type="email"
            register={{ ...register('email', EMAIL_RULES) }}
            error={errors.email}
            label="Email address"
          />
        </InputUx>
        <InputUx
          errorMessage={errors['password']?.message}
          isDirty={dirtyFields['password']}
          isRequired={PASSWORD_RULES?.required}>
          <Input
            type="password"
            register={{ ...register('password', PASSWORD_RULES) }}
            error={errors.password}
            label="Password"
          />
        </InputUx>
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
