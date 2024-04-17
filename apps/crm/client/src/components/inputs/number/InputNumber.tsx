import { DeepRequired, FieldErrorsImpl, FieldValues, Merge, FieldError as TFieldError } from 'react-hook-form';
import { NumberField, Group, Input, Button, FieldError } from 'react-aria-components';
import IconOperatorMinus from '#Components/svg/IconOperatorMinus';
import IconOperatorPlus from '#Components/svg/IconOperatorPlus';
import styles from './_InputNumber.module.scss';

interface MyNumberFieldProps<T extends FieldValues = FieldValues> {
  appendClass?: string;
  description?: string;
  error: TFieldError | Merge<TFieldError, FieldErrorsImpl<DeepRequired<T>>> | undefined;
  label?: string;
  defaultValue: number;
  onChange: (...event: unknown[]) => void;
}

function InputNumber({ appendClass, error, ...props }: MyNumberFieldProps) {
  return (
    <NumberField className={`${styles.numberField} ${appendClass}`} {...props}>
      <Group className={styles.group}>
        <Button slot="decrement" className={styles.buttonDecrement}>
          <IconOperatorMinus svgClass={styles.buttonIncrement__svg} />
        </Button>
        <Input className={styles.input} />
        <Button slot="increment" className={styles.buttonIncrement}>
          <IconOperatorPlus svgClass={styles.buttonIncrement__svg} />
        </Button>
      </Group>
      {props.description && (
        <span slot="description" className={styles.description}>
          {props.description}
        </span>
      )}
      <FieldError className={styles.fieldError}>
        <span>{error?.message as string}</span>
      </FieldError>
    </NumberField>
  );
}

export default InputNumber;
