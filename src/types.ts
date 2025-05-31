import React from 'react';

export type ClickAwayEvent = MouseEvent | TouchEvent | FocusEvent | KeyboardEvent;
export type EventGroup = 'mouse' | 'touch' | 'focus' | 'keyboard';

export type EventConfig = {
  mouseEvents?: Array<'click' | 'mousedown' | 'mouseup'>;
  touchEvents?: Array<'touchstart' | 'touchend'>;
  focusEvents?: Array<'focusin' | 'focusout'>;
  keyboardEvents?: Array<'keydown'>;
};

export interface ClickAwayListenerProps {
  /**
   * The child element to monitor clicks outside of
   */
  children: React.ReactElement;
  /**
   * Callback when click away is detected
   */
  onClickAway: (event: ClickAwayEvent) => void;
  /**
   * Disable the listener
   * @default false
   */
  disabled?: boolean;
  /**
   * Event configuration
   * @default { mouseEvents: ['mousedown'], touchEvents: ['touchstart'] }
   */
  eventConfig?: EventConfig;
  /**
   * Elements to exclude from triggering click away
   */
  excludeRefs?: React.RefObject<HTMLElement>[];
  /**
   * Debounce timeout in milliseconds
   */
  debounceTimeout?: number;
  /**
   * Click tolerance in pixels (movement allowed before considering it a click away)
   * @default 5
   */
  clickTolerance?: number;
  /**
   * Disable event listeners during testing
   * @default false
   */
  testMode?: boolean;
}