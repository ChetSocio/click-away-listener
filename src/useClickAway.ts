import { useEffect, useRef, useCallback } from 'react';
import { ClickAwayEvent, EventConfig } from './types';
import {
  isMouseEvent,
  isTouchEvent,
  isFocusEvent,
  isKeyboardEvent,
  isInExcluded,
  getEventGroup
} from './utils';

export const useClickAway = (
  ref: React.RefObject<HTMLElement>,
  onClickAway: (event: ClickAwayEvent) => void,
  options: {
    disabled?: boolean;
    eventConfig?: EventConfig;
    excludeRefs?: React.RefObject<HTMLElement>[];
    debounceTimeout?: number;
    clickTolerance?: number;
    testMode?: boolean;
  } = {}
) => {
  const {
    disabled = false,
    eventConfig = { mouseEvents: ['mousedown'], touchEvents: ['touchstart'] },
    excludeRefs = [],
    debounceTimeout = 0,
    clickTolerance = 5,
    testMode = false
  } = options;

  const mountedRef = useRef(false);
  const timerRef = useRef<number>();
  const coordsRef = useRef<{ x: number; y: number } | null>(null);

  const handleEvent = useCallback(
    (event: Event) => {
      if (!mountedRef.current || disabled) return;

      const target = event.target as Node;
      const eventGroup = getEventGroup(event);

      if (!target || !document.contains(target)) return;
      if (ref.current?.contains(target) || isInExcluded(target, excludeRefs)) {
        return;
      }

      if (isMouseEvent(event) && clickTolerance > 0) {
        const { clientX, clientY } = event;
        if (coordsRef.current) {
          const distance = Math.sqrt(
            Math.pow(clientX - coordsRef.current.x, 2) +
            Math.pow(clientY - coordsRef.current.y, 2)
          );
          if (distance > clickTolerance) return;
        }
        coordsRef.current = { x: clientX, y: clientY };
      }

      const handler = () => {
        if (eventGroup === 'mouse' && isMouseEvent(event)) {
          onClickAway(event);
        } else if (eventGroup === 'touch' && isTouchEvent(event)) {
          onClickAway(event);
        } else if (eventGroup === 'focus' && isFocusEvent(event)) {
          onClickAway(event);
        } else if (eventGroup === 'keyboard' && isKeyboardEvent(event)) {
          onClickAway(event);
        }
      };

      if (debounceTimeout > 0) {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(handler, debounceTimeout);
      } else {
        handler();
      }
    },
    [ref, disabled, excludeRefs, onClickAway, clickTolerance, debounceTimeout]
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (testMode || disabled) return;

    const events = [
      ...(eventConfig.mouseEvents || []),
      ...(eventConfig.touchEvents || []),
      ...(eventConfig.focusEvents || []),
      ...(eventConfig.keyboardEvents || [])
    ];

    const options = { capture: true };
    events.forEach((event) => {
      document.addEventListener(event, handleEvent, options);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleEvent, options);
      });
    };
  }, [eventConfig, handleEvent, disabled, testMode]);
};