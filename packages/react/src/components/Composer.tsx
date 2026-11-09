import { forwardRef, useEffect, useRef } from 'react';
import type { KeyboardEvent, TextareaHTMLAttributes, Ref } from 'react';
import { cx, useControllableState } from '@pixelmist/core';
import { Button } from './Button';

export interface ComposerProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  /** Called on Enter (without Shift). */
  onSend?: () => void;
  /** While the agent runs, Send turns into Stop. */
  running?: boolean;
  onStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  /** Attachment slot: renders an attach button. */
  onAttach?: () => void;
  attachLabel?: string;
  sendLabel?: string;
  stopLabel?: string;
}

/**
 * Chat composer: multi-line; Enter sends, Shift+Enter adds a line; Send becomes Stop
 * while the agent runs; disabled state; attachment slot.
 */
export const Composer = forwardRef(function Composer(
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
    className,
    onKeyDown,
    ...rest
  }: ComposerProps,
  ref: Ref<HTMLTextAreaElement>,
) {
  const [text, setText] = useControllableState<string>(value, defaultValue ?? '', onValueChange);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const setRefs = (el: HTMLTextAreaElement | null) => {
    taRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
  };

  // auto-grow up to ~8 rows, then scroll (layout only — nothing animates)
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 176)}px`;
  }, [text]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !running && text.trim()) onSend?.();
    }
  };

  return (
    <div className={cx('pm-composer', disabled && 'is-disabled', className)} data-running={running || undefined}>
      <textarea
        ref={setRefs}
        className="pm-composer__input"
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        aria-label={placeholder}
        {...rest}
      />
      <div className="pm-composer__actions">
        {onAttach ? (
          <Button variant="ghost" size="sm" icon="plus" label={attachLabel} onClick={onAttach} disabled={disabled} />
        ) : null}
        {running ? (
          <Button variant="secondary" size="sm" icon="stop-filled" label={stopLabel} onClick={onStop} disabled={disabled} />
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon="arrow-up"
            label={sendLabel}
            onClick={() => {
              if (!disabled && text.trim()) onSend?.();
            }}
            disabled={disabled || !text.trim()}
          />
        )}
      </div>
    </div>
  );
});
