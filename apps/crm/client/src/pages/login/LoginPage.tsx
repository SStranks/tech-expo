import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '#Components/react-hook-form';
import { PASSWORD_RULES, EMAIL_RULES } from '#Components/react-hook-form/validationRules';
import styles from './_LoginPage.module.scss';
import InputUx from '#Components/react-hook-form/InputUx';
import { useId } from 'react';

interface IInputs {
  email: string;
  password: string;
}

// TODO:  Think about security; remembering credentials?
function LoginPage(): JSX.Element {
  const {
    register,
    handleSubmit,
    getFieldState,
    formState,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm<IInputs>({ mode: 'onChange', defaultValues: { email: '', password: '' } });
  const { invalid: emailInvalid } = getFieldState('email', formState);
  const { invalid: passwordInvalid } = getFieldState('password', formState);
  const navigate = useNavigate();
  const emailId = useId();
  const passwordId = useId();

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
          id={emailId}
          label="Email address"
          error={errors['email']}
          isDirty={dirtyFields['email']}
          invalid={emailInvalid}
          isRequired={EMAIL_RULES?.required}
          isSubmitted={isSubmitted}>
          <Input
            id={emailId}
            type="email"
            register={{ ...register('email', EMAIL_RULES) }}
            error={errors.email}
            isRequired={EMAIL_RULES.required}
          />
        </InputUx>
        <InputUx
          id={passwordId}
          label="Password"
          error={errors['password']}
          isDirty={dirtyFields['password']}
          invalid={passwordInvalid}
          isRequired={PASSWORD_RULES?.required}
          isSubmitted={isSubmitted}>
          <Input
            id={passwordId}
            type="password"
            register={{ ...register('password', PASSWORD_RULES) }}
            error={errors.password}
            isRequired={PASSWORD_RULES.required}
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
        {/* <button type="submit" className={styles.loginForm__submitBtn} disabled={!isValid}> */}
        <button type="submit" className={styles.loginForm__submitBtn}>
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
