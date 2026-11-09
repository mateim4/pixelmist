import { forwardRef } from 'react';
import { Pressable, View } from 'react-native';
import type { TextInput } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { TextField } from './TextField';
import type { TextFieldProps } from './TextField';
import { Icon } from './Icon';

export interface PasswordInputProps extends Omit<TextFieldProps, 'secureTextEntry'> {
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
}

/** Native password input with a show/hide toggle (labelled, aria-pressed). */
export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(function PasswordInput(
  { revealed, defaultRevealed = false, onRevealedChange, leftIcon = 'lock', ...rest },
  ref,
) {
  const { resolved: t } = useTheme();
  const [show, setShow] = useControllableState<boolean>(revealed, defaultRevealed, onRevealedChange);
  return (
    <View>
      <TextField ref={ref} secureTextEntry={!show} leftIcon={leftIcon} autoComplete="current-password" {...rest} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={show ? 'Hide password' : 'Show password'}
        accessibilityState={{ checked: show }}
        onPress={() => setShow(!show)}
        style={{ position: 'absolute', right: space(t, 'xs'), top: 30, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}
      >
        <Icon name={show ? 'eye-off' : 'eye'} size={16} color={t.color.fg.muted} />
      </Pressable>
    </View>
  );
});
