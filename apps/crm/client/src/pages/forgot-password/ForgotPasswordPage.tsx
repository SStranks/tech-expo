import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '#Components/react-hook-form';
import InputUx from '#Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '#Components/react-hook-form/validationRules';
import styles from './_ForgotPasswordPage.module.scss';

interface IInputs {
  email: string;
}

function ForgotPasswordPage(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<IInputs>({ mode: 'onChange', defaultValues: { email: '' } });
  const navigate = useNavigate();
  const id = useId();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    navigate('/login');
  });

  return (
    <div className={styles.formContainer}>
      <form
        name="password reset form"
        onSubmit={onSubmit}
        aria-labelledby="heading"
        className={styles.resetPasswordForm}
        noValidate>
        <h1 id="heading">Password Reset</h1>
        <InputUx
          id={id}
          label="Email address"
          errorMessage={errors['email']?.message}
          isDirty={dirtyFields['email']}
          isRequired={EMAIL_RULES?.required}>
          <Input id={id} type="email" register={{ ...register('email', EMAIL_RULES) }} error={errors.email} />
        </InputUx>
        <button type="submit" className={styles.resetPasswordForm__submitBtn} disabled={!isValid}>
          Email Reset Instructions
        </button>
        <p>
          Already have an account?
          <Link to={'/login'} className={styles.resetPasswordForm__link}>
            <span>Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
