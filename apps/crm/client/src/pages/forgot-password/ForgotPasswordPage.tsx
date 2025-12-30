import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';
import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';
import { useServicesContext } from '@Context/servicesContext';

import styles from './ForgotPasswordPage.module.scss';

type DefaultValues = {
  email: string;
};

function ForgotPasswordPage(): React.JSX.Element {
  const methods = useForm<DefaultValues>({ defaultValues: { email: '' } });
  const navigate = useNavigate();
  const id = useId();
  const { serviceHttp } = useServicesContext();

  const onSubmit = methods.handleSubmit(async (data) => {
    serviceHttp.account.forgotpassword({ ...data });
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
          <InputUx
            id={id}
            name="email"
            label="Email address"
            defaultValue={undefined}
            rules={EMAIL_RULES}
            disabled={false}>
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
