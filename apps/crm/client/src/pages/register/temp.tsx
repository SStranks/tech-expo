import { useForm } from 'react-hook-form';

import InputPasswordStrength from '@Components/react-hook-form/input-password/InputPasswordStrength';
import Input from '@Components/react-hook-form/input/Input';

interface IInputs {
  email: string;
  password: string;
  password33: string;
}

function ASD(): JSX.Element {
  const { register, setFocus, trigger } = useForm<IInputs>({
    defaultValues: { email: '', password: '', password33: '' },
    mode: 'onSubmit',
  });

  return (
    <div className="">
      {/* <Input
        register={register}
        rules={{}}
        inputName={'password'}
        inputType={'number'}
        errors={undefined}
        ariaLabel={''}
      /> */}
      <Input
        register={register}
        rules={{}}
        inputName={'password'}
        inputType={'number'}
        error={undefined}
        ariaLabel={''}
      />
      <InputPasswordStrength
        register={register}
        trigger={trigger}
        setFocus={setFocus}
        inputName={'email'}
        placeholder={''}
        error={undefined}
        reveal={false}
      />
      <InputPasswordStrength
        register={register}
        trigger={trigger}
        setFocus={setFocus}
        inputName={'password'}
        placeholder={''}
        error={undefined}
        reveal={false}
      />
    </div>
  );
}

export default ASD;
