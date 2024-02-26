import { lazy, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import type { TInputPasswordStrength } from '#Components/react-hook-form/input-password/InputPasswordStrength';
import { RulesEmail, Input, InputPasswordSkeleton } from '#Components/react-hook-form';
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
    control,
    trigger,
    handleSubmit,
    formState: { isValid, errors, dirtyFields },
  } = useForm<IInputs>({ mode: 'onChange', defaultValues: { email: '', password: '' } });
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
        <Input
          type="email"
          register={{ ...register('email', RulesEmail) }}
          error={errors.email}
          isDirty={dirtyFields.email}
          label="Email address"
        />
        <Suspense fallback={<InputPasswordSkeleton label="Password" />}>
          <InputPasswordStrength
            register={register}
            control={control}
            trigger={trigger}
            inputName="password"
            error={errors.password}
            isDirty={dirtyFields.password}
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
            <span className={styles.registerForm__loginLink}>Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
