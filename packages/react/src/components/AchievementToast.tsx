import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type { IconName } from '@pixelmist/icons';
import { cx } from '@pixelmist/core';
import { Icon } from './Icon';

export interface AchievementToastAction {
  label: string;
  onClick: () => void;
}

export interface AchievementToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Pixel icon, default `trophy`. */
  icon?: IconName;
  action?: AchievementToastAction;
  onClose?: () => void;
  closeLabel?: string;
  /**
   * ms until auto-dismiss (default 6000); 0 = sticky. Auto-dismiss pauses while the
   * pointer is over the toast or focus is inside it (WCAG 2.2.1), and never runs under
   * prefers-reduced-motion.
   */
  duration?: number;
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const EXIT_MS = 180;

/**
 * Achievement toast — gamification primitive. A settled (done) toast card: icon, title,
 * optional description, optional action, close button. role="status". Enter/exit animate
 * with opacity + transform only; the countdown bar is a scaleX animation that collapses
 * under reduced motion (where the toast is also sticky). forwardRef + prop pass-through.
 */
export const AchievementToast = forwardRef(function AchievementToast(
  {
    title,
    description,
    icon = 'trophy',
    action,
    onClose,
    closeLabel = 'Dismiss',
    duration = 6000,
    className,
    ...rest
  }: AchievementToastProps,
  ref: Ref<HTMLDivElement>,
) {
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducedRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    timerRef.current = undefined;
  };

  const close = useCallback(() => {
    clearTimer();
    setLeaving(true);
    setTimeout(() => {
      setGone(true);
      onClose?.();
    }, EXIT_MS);
  }, [onClose]);

  const pause = useCallback(() => {
    if (timerRef.current === undefined) return;
    clearTimer();
    remainingRef.current -= Date.now() - startedAtRef.current;
  }, []);

  const resume = useCallback(() => {
    if (reducedRef.current || duration <= 0 || remainingRef.current <= 0) return;
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(close, remainingRef.current);
  }, [close, duration]);

  useEffect(() => {
    reducedRef.current =
      typeof matchMedia === 'function' && matchMedia(REDUCED_MOTION).matches;
    remainingRef.current = duration;
    if (!reducedRef.current && duration > 0) {
      startedAtRef.current = Date.now();
      timerRef.current = setTimeout(close, duration);
    }
    return clearTimer;
  }, [close, duration]);

  if (gone) return null;
  return (
    <div
      ref={ref}
      className={cx('pm-achtoast', leaving && 'is-leaving', className)}
      role="status"
      data-tone="settled"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      {...rest}
    >
      <span className="pm-achtoast__icon" aria-hidden>
        <Icon name={icon} size={18} />
      </span>
      <span className="pm-achtoast__content">
        <span className="pm-achtoast__title">{title}</span>
        {description ? <span className="pm-achtoast__description">{description}</span> : null}
        {action ? (
          <button type="button" className="pm-achtoast__action" onClick={action.onClick}>
            {action.label}
          </button>
        ) : null}
      </span>
      <button type="button" className="pm-achtoast__close" aria-label={closeLabel} onClick={close}>
        <Icon name="x" size={14} />
      </button>
      {duration > 0 ? (
        <span
          className="pm-achtoast__progress"
          style={{ animationDuration: `${duration}ms` }}
          aria-hidden
        />
      ) : null}
    </div>
  );
});
