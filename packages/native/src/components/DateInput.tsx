import { forwardRef } from 'react';
import type { TextInput } from 'react-native';
import type { TextFieldProps } from './TextField';
import { TextField } from './TextField';

export interface DateInputProps extends Omit<TextFieldProps, 'keyboardType'> {
  /** ISO YYYY-MM-DD. */
  value?: string;
}

/**
 * Native date input: a text field constrained to ISO YYYY-MM-DD
 * (RN has no native date picker in core; apps can swap in a platform picker behind this API).
 */
export const DateInput = forwardRef<TextInput, DateInputProps>(function DateInput(props, ref) {
  return (
    <TextField
      ref={ref}
      keyboardType="numbers-and-punctuation"
      placeholder="YYYY-MM-DD"
      maxLength={10}
      {...props}
    />
  );
});
