import type { TInputPasswordStrength } from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { lazy, Suspense, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { EMAIL_RULES, Input, InputPasswordSkeleton, InputUx } from '@Components/react-hook-form';
import serviceHttp from '@Services/serviceHttp';

import styles from './RegisterPage.module.scss';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('@Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

export interface IInputs {
  email: string;
  password: string;
}

const defaultValues: IInputs = {
  email: '',
  password: '',
};

function RegisterPage(): React.JSX.Element {
  const methods = useForm<IInputs>({ defaultValues, mode: 'onChange' });
  const navigate = useNavigate();
  const emailId = useId();

  const onSubmit = methods.handleSubmit(async (data: IInputs) => {
    serviceHttp.accountLogin({ ...data });
    navigate('/login');
  });

  return (
    <FormProvider {...methods}>
      <div className={styles.formContainer}>
        <form
          name="register form"
          onSubmit={onSubmit}
          aria-labelledby="heading"
          className={styles.registerForm}
          noValidate>
          <h1 id="heading">Register Account</h1>
          <InputUx
            name="email"
            id={emailId}
            label="Email address"
            defaultValue={defaultValues.email}
            rules={EMAIL_RULES}>
            <Input id={emailId} type="email" rules={EMAIL_RULES} name="email" autoComplete="email" />
          </InputUx>
          <Suspense fallback={<InputPasswordSkeleton label="Password" />}>
            <InputPasswordStrength
              name="password"
              defaultValue={defaultValues.password}
              reveal={false}
              label="Password"
            />
          </Suspense>
          <button type="submit" className={styles.registerForm__submitBtn}>
            Register Account
          </button>
          <p>
            Already have an account?
            <Link to="/login">
              <span className={styles.registerForm__loginLink}>Login</span>
            </Link>
          </p>
        </form>
      </div>
    </FormProvider>
  );
}

export default RegisterPage;
