import { lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { TInputPasswordStrength } from '#Components/react-hook-form/input-password/InputPasswordStrength';
import InputPasswordSkeleton from '#Components/react-hook-form/input-password/InputPasswordSkeleton';
import styles from './_RegisterPage.module.scss';
import Input from '#Components/react-hook-form/input/Input';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('#Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

const EMAILRULES = {
  required: {
    value: true,
    message: 'Please enter a valid email',
  },
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: 'Entered value does not match email format',
  },
};

export interface IInputs {
  email: string;
  password: string;
}

function RegisterPage(): JSX.Element {
  const {
    register,
    trigger,
    setValue,
    getFieldState,
    formState: { isValid, errors },
    handleSubmit,
  } = useForm<IInputs>({ mode: 'onChange', defaultValues: { email: '', password: '' } });
  const navigate = useNavigate();
  const emailFieldState = getFieldState('email');
  const passwordFieldState = getFieldState('password');

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
        {/* {errors.email && <span role="alert">{errors.email.message}</span>} */}
        <Input
          type="email"
          register={{ ...register('email', EMAILRULES) }}
          invalid={emailFieldState.invalid}
          error={emailFieldState.error}
          isDirty={emailFieldState.isDirty}
          label="Email address"
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
        <Suspense fallback={<InputPasswordSkeleton />}>
          <InputPasswordStrength
            register={register}
            trigger={trigger}
            setValue={setValue}
            invalid={passwordFieldState.invalid}
            error={passwordFieldState.error}
            isDirty={passwordFieldState.isDirty}
            inputName="password"
            reveal={false}
            label="Password"
          />
        </Suspense>
        <button type="submit" className={styles.registerForm__submitBtn} disabled={!isValid}>
          Register Account
        </button>
        <p>
          Already have an account?
          <Link to={'/login'}>
            <span>Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
