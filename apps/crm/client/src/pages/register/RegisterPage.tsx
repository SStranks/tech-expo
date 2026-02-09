import type { InputPasswordStrength } from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { lazy, Suspense, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import InputPasswordSkeleton from '@Components/react-hook-form/input-password/InputPasswordSkeleton';
import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';
import { useServicesContext } from '@Context/servicesContext';

import styles from './RegisterPage.module.scss';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('@Components/react-hook-form/input-password/InputPasswordStrength')
) as InputPasswordStrength;

export interface DefaultValues {
  email: string;
  password: string;
}

const defaultValues: DefaultValues = {
  email: '',
  password: '',
};

function RegisterPage(): React.JSX.Element {
  const methods = useForm<DefaultValues>({ defaultValues, mode: 'onChange' });
  const navigate = useNavigate();
  const emailId = useId();
  const { serviceHttp } = useServicesContext();

  const onSubmit = methods.handleSubmit(async (data) => {
    await serviceHttp.account.login({ ...data });
    void navigate('/login');
  });

  return (
    <FormProvider {...methods}>
      <div className={styles.formContainer}>
        <form
          name="register form"
          onSubmit={(e) => void onSubmit(e)}
          aria-labelledby="heading"
          className={styles.registerForm}
          noValidate>
          <h1 id="heading">Register Account</h1>
          <InputUx
            name="email"
            id={emailId}
            label="Email address"
            defaultValue={defaultValues.email}
            rules={EMAIL_RULES}
            disabled={false}>
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
