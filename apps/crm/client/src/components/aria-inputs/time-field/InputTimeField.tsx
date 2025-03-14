import {
  DateInput,
  DateSegment,
  FieldError,
  Label,
  Text,
  TimeField,
  TimeFieldProps,
  TimeValue,
  ValidationResult,
} from 'react-aria-components';

import styles from './InputTimeField.module.scss';

interface MyTimeFieldProps<T extends TimeValue> extends TimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function InputTimeField<T extends TimeValue>({
  description,
  errorMessage,
  label,
  ...props
}: MyTimeFieldProps<T>): React.JSX.Element {
  return (
    <TimeField {...props} className={styles.timeField}>
      <Label className={styles.label}>
        {label && <span>{label}</span>}
        {/* // NOTE:  Hidden input linked to external Label by Id */}
        <input id={props.id} hidden />
      </Label>
      <DateInput className={styles.dateInput}>
        {(segment) => <DateSegment segment={segment} className={styles.dateSegment} />}
      </DateInput>
      {description && (
        <Text slot="description" className={styles.text}>
          {description}
        </Text>
      )}
      <FieldError className={styles.fieldError}>{errorMessage}</FieldError>
    </TimeField>
  );
}

export default InputTimeField;
