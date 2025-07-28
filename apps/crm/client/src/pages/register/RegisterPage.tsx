import type { TInputPasswordStrength } from '@Components/react-hook-form/input-password/InputPasswordStrength';

import { lazy, Suspense, useId } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Input, InputPasswordSkeleton } from '@Components/react-hook-form';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';

import styles from './RegisterPage.module.scss';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('@Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

export interface IInputs {
  email: string;
  password: string;
}

function RegisterPage(): React.JSX.Element {
  const {
    control,
    formState,
    formState: { dirtyFields, errors, isSubmitted },
    getFieldState,
    handleSubmit,
    register,
    trigger,
  } = useForm<IInputs>({ defaultValues: { email: '', password: '' }, mode: 'onChange' });
  const { invalid: emailInvalid } = getFieldState('email', formState);
  const { invalid: passwordInvalid } = getFieldState('password', formState);
  const navigate = useNavigate();
  const emailId = useId();

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
            isRequired={EMAIL_RULES?.required}
          />
        </InputUx>
        <Suspense fallback={<InputPasswordSkeleton label="Password" />}>
          <InputPasswordStrength
            register={register}
            control={control}
            trigger={trigger}
            inputName="password"
            error={errors.password}
            isRequired
            isDirty={dirtyFields.password}
            invalid={passwordInvalid}
            isSubmitted={isSubmitted}
            reveal={false}
            label="Password"
          />
        </Suspense>
        {/* <button type="submit" className={styles.registerForm__submitBtn} disabled={!isValid}> */}
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
  );
}

export default RegisterPage;
