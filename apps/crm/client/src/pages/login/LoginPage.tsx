import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Input } from '@Components/react-hook-form';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES, PASSWORD_RULES } from '@Components/react-hook-form/validationRules';
import { useReduxDispatch } from '@Redux/hooks';
import { authenticateUser } from '@Redux/reducers/authSlice';
import { serviceAuth, serviceHttp } from '@Services/index';

import styles from './LoginPage.module.scss';

interface IInputs {
  email: string;
  password: string;
}

// TODO:  Think about security; remembering credentials?
function LoginPage(): JSX.Element {
  const {
    formState,
    formState: { defaultValues, dirtyFields, errors, isSubmitted, isSubmitting },
    getFieldState,
    handleSubmit,
    register,
  } = useForm<IInputs>({ defaultValues: { email: 'user@email.com', password: 'password' }, mode: 'onChange' });
  // DANGER: // TEMP DEV:  Remove email and password default values
  const { invalid: emailInvalid } = getFieldState('email', formState);
  const { invalid: passwordInvalid } = getFieldState('password', formState);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const emailId = useId();
  const passwordId = useId();
  const reduxDispatch = useReduxDispatch();

  const fromURL = location.state?.from?.pathname || '/';

  const onSubmit = handleSubmit(async (data) => {
    try {
      // setIsLoading(true);
      // TODO:  Get back user details and store in redux
      await serviceHttp.login({ email: data.email, password: data.password });
      // Successful login; returns Auth and Refresh http-cookie JWTs
      serviceAuth.activateRefreshToken();
      // Send user to requested protected route, or default to homepage
      navigate(fromURL, { replace: true });
    } catch (error) {
      // TODO:  Toast Notification
      console.log('ERROR*******', error);
    } finally {
      // setIsLoading(false);
      reduxDispatch(authenticateUser(true));
    }
  });

  return (
    <div className={styles.formContainer}>
      <form name="sign-in form" onSubmit={onSubmit} aria-labelledby="heading" className={styles.loginForm} noValidate>
        <h1 id="heading">Sign In</h1>
        <InputUx
          id={emailId}
          label="Email address"
          defaultValue={defaultValues?.email}
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
          defaultValue={defaultValues?.password}
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
          {isSubmitting ? 'Loading' : 'Sign In'}
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
