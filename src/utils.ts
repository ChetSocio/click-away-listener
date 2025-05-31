import { EventGroup } from './types';

export const isMouseEvent = (event: Event): event is MouseEvent =>
  event.type.includes('mouse');

export const isTouchEvent = (event: Event): event is TouchEvent =>
  event.type.includes('touch');

export const isFocusEvent = (event: Event): event is FocusEvent =>
  event.type.includes('focus');

export const isKeyboardEvent = (event: Event): event is KeyboardEvent =>
  event.type === 'keydown';

export const getEventGroup = (event: Event): EventGroup | null => {
  if (isMouseEvent(event)) return 'mouse';
  if (isTouchEvent(event)) return 'touch';
  if (isFocusEvent(event)) return 'focus';
  if (isKeyboardEvent(event)) return 'keyboard';
  return null;
};

export const mergeRefs = <T extends HTMLElement>(
  ...refs: Array<React.Ref<T> | undefined | null>
): React.RefCallback<T> => (value) => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref != null) {
      (ref as React.MutableRefObject<T | null>).current = value;
    }
  });
};

export const isInExcluded = (
  target: Node,
  excludeRefs: React.RefObject<HTMLElement>[] = []
): boolean => {
  return excludeRefs.some(
    (ref) => ref.current && ref.current.contains(target)
  );
};