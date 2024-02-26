import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styles from './_ForgotPasswordPage.module.scss';
import { Input, RulesEmail } from '#Components/react-hook-form';

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
        <Input
          type="email"
          register={{ ...register('email', RulesEmail) }}
          error={errors.email}
          isDirty={dirtyFields.email}
          label="Email address"
        />
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
