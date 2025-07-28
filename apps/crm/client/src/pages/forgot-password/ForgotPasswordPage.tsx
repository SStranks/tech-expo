import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Input } from '@Components/react-hook-form';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';

import styles from './ForgotPasswordPage.module.scss';

interface IInputs {
  email: string;
}

function ForgotPasswordPage(): React.JSX.Element {
  const {
    formState,
    formState: { dirtyFields, errors, isSubmitted },
    getFieldState,
    handleSubmit,
    register,
  } = useForm<IInputs>({ defaultValues: { email: '' }, mode: 'onChange' });
  const { invalid: emailInvalid } = getFieldState('email', formState);
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
          error={errors['email']}
          isDirty={dirtyFields['email']}
          invalid={emailInvalid}
          isRequired={EMAIL_RULES?.required}
          isSubmitted={isSubmitted}>
          <Input
            id={id}
            type="email"
            register={{ ...register('email', EMAIL_RULES) }}
            error={errors.email}
            isRequired={EMAIL_RULES.required}
          />
        </InputUx>
        <button type="submit" className={styles.resetPasswordForm__submitBtn}>
          Email Reset Instructions
        </button>
        <p>
          Already have an account?
          <Link to="/login" className={styles.resetPasswordForm__link}>
            <span>Login</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
