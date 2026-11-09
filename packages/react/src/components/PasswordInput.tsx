import { forwardRef } from 'react';
import type { Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';
import { TextField } from './TextField';
import type { TextFieldProps } from './TextField';
import { Icon } from './Icon';

export interface PasswordInputProps extends Omit<TextFieldProps, 'type' | 'rightIcon' | 'leftIcon'> {
  leftIcon?: TextFieldProps['leftIcon'];
  /** Controlled visibility of the password. */
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
}

/**
 * Password input with a show/hide toggle. The toggle is a labelled button
 * (aria-pressed), never an icon without a name.
 */
export const PasswordInput = forwardRef(function PasswordInput(
  { revealed, defaultRevealed = false, onRevealedChange, leftIcon = 'lock', className, ...rest }: PasswordInputProps,
  ref: Ref<HTMLInputElement>,
) {
  const [show, setShow] = useControllableState<boolean>(revealed, defaultRevealed, onRevealedChange);
  return (
    <div className={cx('pm-password', className)}>
      <TextField
        ref={ref}
        type={show ? 'text' : 'password'}
        leftIcon={leftIcon}
        autoComplete="current-password"
        {...rest}
      />
      <button
        type="button"
        className="pm-password__toggle"
        aria-pressed={show}
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow(!show)}
      >
        <Icon name={show ? 'eye-off' : 'eye'} size={16} />
      </button>
    </div>
  );
});
