import { lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { TInputPasswordStrength } from '#Components/react-hook-form/input-password/InputPasswordStrength';
import InputPasswordSkeleton from '#Components/react-hook-form/input-password/InputPasswordSkeleton';
import styles from './_RegisterPage.module.scss';

// Contains 'zxcvbn' package; heavy weight
const InputPasswordStrength = lazy(
  () => import('#Components/react-hook-form/input-password/InputPasswordStrength')
) as TInputPasswordStrength;

export interface IInputs {
  email: string;
  password: string;
}

function RegisterPage(): JSX.Element {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IInputs>();
  const navigate = useNavigate();

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
        {errors.email && <span role="alert">{errors.email.message}</span>}
        <input
          type="email"
          aria-label="email"
          aria-invalid={errors.email ? true : false}
          {...register('email', {
            required: {
              value: true,
              message: 'Please enter a valid email',
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Entered value does not match email format',
            },
          })}
        />
        {errors.password && <span role="alert">{errors.password.message}</span>}
        <Suspense fallback={<InputPasswordSkeleton />}>
          <InputPasswordStrength
            register={register}
            inputName="password"
            placeholder="Enter a strong password"
            error={errors.password}
            reveal={false}
          />
        </Suspense>
        <button type="submit">Register Account</button>
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
