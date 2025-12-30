import { useId } from 'react';
import { FormProvider, useForm, useFormState } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES, PASSWORD_RULES } from '@Components/react-hook-form/validationRules';
import { useReduxDispatch } from '@Redux/hooks';
import { login } from '@Redux/reducers/authSlice';

import styles from './LoginPage.module.scss';

type DefaultValues = {
  email: string;
  password: string;
};

// TODO:  Think about security; remembering credentials?
function LoginPage(): React.JSX.Element {
  const { control, ...methods } = useForm<DefaultValues>({ defaultValues: { email: '', password: '' } });
  const { isSubmitting } = useFormState({ control });
  // } = useForm<DefaultValues>({ defaultValues: { email: 'user@email.com', password: 'crmuser' }, mode: 'onChange' });
  // DANGER: // TEMP DEV:  Remove email and password default values
  const navigate = useNavigate();
  const location = useLocation();
  const emailId = useId();
  const passwordId = useId();
  const reduxDispatch = useReduxDispatch();

  const fromURL = location.state?.from?.pathname || '/';

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      // TODO:  Get back user details and store in redux
      await reduxDispatch(login({ email: data.email, password: data.password }));
      // Send user to requested protected route, or default to homepage
      navigate(fromURL, { replace: true });
    } catch (error) {
      // TODO:  Toast Notification
      console.log('ERROR*******', error);
    }
  });

  return (
    <FormProvider {...{ ...methods, control }}>
      <div className={styles.formContainer}>
        <form name="sign-in form" onSubmit={onSubmit} aria-labelledby="heading" className={styles.loginForm} noValidate>
          <h1 id="heading">Sign In</h1>
          <InputUx id={emailId} name="email" label="Email address" rules={EMAIL_RULES} disabled={false}>
            <Input id={emailId} type="email" name="email" rules={EMAIL_RULES} autoComplete="email" />
          </InputUx>
          <InputUx id={passwordId} name="password" label="Password" rules={PASSWORD_RULES} disabled={false}>
            <Input
              id={passwordId}
              type="password"
              name="password"
              rules={PASSWORD_RULES}
              autoComplete="password"
              data-testid="password-input"
            />
          </InputUx>
          <div className={styles.options}>
            <label>
              <input type="checkbox" />
              Remember Credentials?
            </label>
            <Link to="/forgot-password">
              <span className={styles.loginForm__link}>Forgot Password</span>
            </Link>
          </div>
          {/* <button type="submit" className={styles.loginForm__submitBtn} disabled={!isValid}> */}
          <button type="submit" className={styles.loginForm__submitBtn}>
            {isSubmitting ? 'Loading' : 'Sign In'}
          </button>
          <p>
            Don&#39;t have an account?
            <Link to="/register">
              <span className={styles.loginForm__link}>Sign up here</span>
            </Link>
          </p>
        </form>
      </div>
    </FormProvider>
  );
}

export default LoginPage;
