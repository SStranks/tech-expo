import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Input } from '@Components/react-hook-form';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';
import serviceHttp from '@Services/serviceHttp';

import styles from './ForgotPasswordPage.module.scss';

interface IInputs {
  email: string;
}

function ForgotPasswordPage(): React.JSX.Element {
  const methods = useForm<IInputs>({ defaultValues: { email: '' } });
  const navigate = useNavigate();
  const id = useId();

  const onSubmit = methods.handleSubmit(async (data) => {
    serviceHttp.accountForgotPassword({ ...data });
    navigate('/login');
  });

  return (
    <FormProvider {...methods}>
      <div className={styles.formContainer}>
        <form
          name="password reset form"
          onSubmit={onSubmit}
          aria-labelledby="heading"
          className={styles.resetPasswordForm}
          noValidate>
          <h1 id="heading">Password Reset</h1>
          <InputUx id={id} name="email" label="Email address" defaultValue={undefined} rules={EMAIL_RULES}>
            <Input id={id} name="email" type="email" rules={EMAIL_RULES} autoComplete="email" />
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
    </FormProvider>
  );
}

export default ForgotPasswordPage;
