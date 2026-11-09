import { forwardRef } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { useControllableState } from '@pixelmist/core';
import { useTheme } from '../theme/ThemeProvider';
import { space } from '../theme/helpers';
import { Button } from './Button';

export interface ComposerProps extends Omit<TextInputProps, 'value' | 'defaultValue' | 'onChangeText'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onSend?: () => void;
  /** While the agent runs, Send turns into Stop. */
  running?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  onAttach?: () => void;
  attachLabel?: string;
  sendLabel?: string;
  stopLabel?: string;
}

/** Native composer: multi-line input; send/stop + attach actions. Enter sends via returnKeyType. */
export const Composer = forwardRef<TextInput, ComposerProps>(function Composer(
  {
    value,
    defaultValue,
    onValueChange,
    onSend,
    running = false,
    onStop,
    disabled = false,
    placeholder = 'Message the agent…',
    onAttach,
    attachLabel = 'Attach file',
    sendLabel = 'Send',
    stopLabel = 'Stop',
    style,
    onSubmitEditing,
    ...rest
  },
  ref,
) {
  const { resolved: t } = useTheme();
  const [text, setText] = useControllableState<string>(value, defaultValue ?? '', onValueChange);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: space(t, 'xs'),
        padding: space(t, 'xs'),
        borderWidth: 1,
        borderColor: t.color.border.strong,
        borderRadius: t.radius.lg,
        backgroundColor: t.color.bg.raised,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <TextInput
        ref={ref}
        multiline
        accessibilityLabel={placeholder}
        value={text}
        placeholder={placeholder}
        editable={!disabled}
        returnKeyType="send"
        onChangeText={setText}
        onSubmitEditing={(e) => {
          if (!disabled && !running && text.trim()) onSend?.();
          onSubmitEditing?.(e);
        }}
        style={[{ flex: 1, minHeight: 40, maxHeight: 200, color: t.color.fg.default, paddingHorizontal: space(t, 'xs') }, style]}
        placeholderTextColor={t.color.fg.disabled}
        {...rest}
      />
      {onAttach ? <Button variant="ghost" size="sm" icon="plus" label={attachLabel} onPress={onAttach} disabled={disabled} /> : null}
      {running ? (
        <Button variant="secondary" size="sm" icon="stop-filled" label={stopLabel} onPress={onStop} disabled={disabled} />
      ) : (
        <Button variant="primary" size="sm" icon="arrow-up" label={sendLabel} onPress={() => !disabled && text.trim() && onSend?.()} disabled={disabled || !text.trim()} />
      )}
    </View>
  );
});
