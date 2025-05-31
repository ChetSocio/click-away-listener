import React, {
  useEffect,
  useRef,
  useCallback,
  useState
} from 'react';
import {
  ClickAwayListenerProps,
  EventConfig
} from './types';
import {
  isMouseEvent,
  isTouchEvent,
  isFocusEvent,
  isKeyboardEvent,
  mergeRefs,
  isInExcluded,
  getEventGroup
} from './utils';

const DEFAULT_EVENTS: EventConfig = {
  mouseEvents: ['mousedown'],
  touchEvents: ['touchstart']
};

export const ClickAwayListener = ({
  children,
  onClickAway,
  disabled = false,
  eventConfig = DEFAULT_EVENTS,
  excludeRefs = [],
  debounceTimeout = 0,
  clickTolerance = 5,
  testMode = false
}: ClickAwayListenerProps) => {
  const nodeRef = useRef<HTMLElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const mountedRef = useRef(false);
  const timerRef = useRef<number>();

  // Handle React 18+ double mount in strict mode
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleEvent = useCallback(
    (event: Event) => {
      if (!mountedRef.current || disabled) return;

      const target = event.target as Node;
      const eventGroup = getEventGroup(event);

      // Skip if target is null or not in document
      if (!target || !document.contains(target)) return;

      // Skip if inside our element or excluded elements
      if (
        nodeRef.current?.contains(target) ||
        isInExcluded(target, excludeRefs)
      ) {
        return;
      }

      // For mouse events, check movement tolerance
      if (isMouseEvent(event) && clickTolerance > 0) {
        const { clientX, clientY } = event;
        if (coords) {
          const distance = Math.sqrt(
            Math.pow(clientX - coords.x, 2) +
            Math.pow(clientY - coords.y, 2)
          );
          if (distance > clickTolerance) return;
        }
        setCoords({ x: clientX, y: clientY });
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
    [disabled, excludeRefs, onClickAway, clickTolerance, coords, debounceTimeout]
  );

  // Register event listeners
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

  // Handle ref forwarding
  const childRef = (children as any).ref;
  const combinedRef = mergeRefs(nodeRef, childRef);

  return React.cloneElement(React.Children.only(children), {
    ref: combinedRef
  });
};

ClickAwayListener.displayName = 'ClickAwayListener';