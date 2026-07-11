import { addEventListener } from '../utils';
import { MetaState } from '.';

export const keyboard = new MetaState<Record<BindingCode, boolean | undefined>>();

const dummy = () => {};

export const shortcut = (key: BindingCode, handler: () => void | boolean) => {
  let unsubscribe = dummy;
  return keyboard.subscribe(key, pressing => {
    unsubscribe();
    if (pressing) {
      unsubscribe = keyboard.subscribe(key, pressing => {
        if (!pressing) {
          return handler();
        }
      });
    }
  });
};

const ONE_TWO = {
  Shift: ['ShiftLeft', 'ShiftRight'],
  Meta: ['MetaLeft', 'MetaRight'],
  Ctrl: ['ControlLeft', 'ControlRight'],
  Alt: ['AltLeft', 'AltRight'],
} as const;

if (typeof window !== 'undefined') {
  addEventListener(document, 'keydown', ({ code }) => {
    keyboard.dispatch(code as any, true);
    if (code in ONE_ONE) {
      keyboard.dispatch((ONE_ONE as any)[code], true);
    }
  });
  addEventListener(document, 'keyup', ({ code }) => {
    keyboard.dispatch(code as any, false);
    if (code in ONE_ONE) {
      keyboard.dispatch((ONE_ONE as any)[code], false);
    }
  });

  for (const [key, values] of Object.entries(ONE_TWO)) {
    keyboard.subscribe(([value]) => {
      if ((values as any).includes(value)) {
        const pressing = values.some(value => keyboard.get(value));
        if (keyboard.get(key as any) !== pressing) {
          keyboard.dispatch(key as any, pressing);
        }
      }
    });
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_code_values
export type BindingCode =
  | (typeof ONE_ONE)[keyof typeof ONE_ONE]
  | keyof typeof ONE_TWO
  | 'Abort'
  | 'Again'
  | 'AltLeft'
  | 'AltRight'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'AudioVolumeDown'
  | 'AudioVolumeMute'
  | 'AudioVolumeUp'
  | 'AudioVolumeUp'
  | 'Backquote'
  | 'Backslash'
  | 'Backspace'
  | 'BracketLeft'
  | 'BracketRight'
  | 'BrightnessUp'
  | 'BrowserBack'
  | 'BrowserFavorites'
  | 'BrowserForward'
  | 'BrowserHome'
  | 'BrowserRefresh'
  | 'BrowserSearch'
  | 'BrowserStop'
  | 'CapsLock'
  | 'Comma'
  | 'ContextMenu'
  | 'ControlLeft'
  | 'ControlRight'
  | 'Convert'
  | 'Copy'
  | 'Cut'
  | 'Delete'
  | 'Digit0'
  | 'Digit1'
  | 'Digit2'
  | 'Digit3'
  | 'Digit4'
  | 'Digit5'
  | 'Digit6'
  | 'Digit7'
  | 'Digit8'
  | 'Digit9'
  | 'Eject'
  | 'End'
  | 'Enter'
  | 'Equal'
  | 'Escape'
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'F7'
  | 'F8'
  | 'F9'
  | 'F10'
  | 'F11'
  | 'F12'
  | 'F13'
  | 'F14'
  | 'F15'
  | 'F16'
  | 'F17'
  | 'F18'
  | 'F19'
  | 'F20'
  | 'F21'
  | 'F22'
  | 'F23'
  | 'F24'
  | 'Find'
  | 'Fn'
  | 'Help'
  | 'Home'
  | 'Insert'
  | 'IntlBackslash'
  | 'IntlRo'
  | 'IntlYen'
  | 'KanaMode'
  | 'KeyA'
  | 'KeyB'
  | 'KeyC'
  | 'KeyD'
  | 'KeyE'
  | 'KeyF'
  | 'KeyG'
  | 'KeyH'
  | 'KeyI'
  | 'KeyJ'
  | 'KeyK'
  | 'KeyL'
  | 'KeyM'
  | 'KeyN'
  | 'KeyO'
  | 'KeyP'
  | 'KeyQ'
  | 'KeyR'
  | 'KeyS'
  | 'KeyT'
  | 'KeyU'
  | 'KeyV'
  | 'KeyW'
  | 'KeyX'
  | 'KeyY'
  | 'KeyZ'
  | 'Lang1'
  | 'Lang2'
  | 'Lang3'
  | 'Lang4'
  | 'Lang5'
  | 'LaunchApp1'
  | 'LaunchApp2'
  | 'LaunchMail'
  | 'MediaPlayPause'
  | 'MediaSelect'
  | 'MediaStop'
  | 'MediaTrackNext'
  | 'MediaTrackPrevious'
  | 'MetaLeft'
  | 'MetaRight'
  | 'Minus'
  | 'NonConvert'
  | 'NumLock'
  | 'Numpad0'
  | 'Numpad1'
  | 'Numpad2'
  | 'Numpad3'
  | 'Numpad4'
  | 'Numpad5'
  | 'Numpad6'
  | 'Numpad7'
  | 'Numpad8'
  | 'Numpad9'
  | 'NumpadAdd'
  | 'NumpadComma'
  | 'NumpadDecimal'
  | 'NumpadDivide'
  | 'NumpadEnter'
  | 'NumpadEqual'
  | 'NumpadMultiply'
  | 'NumpadParenLeft'
  | 'NumpadParenRight'
  | 'NumpadSubtract'
  | 'OSLeft'
  | 'OSRight'
  | 'Open'
  | 'PageDown'
  | 'PageUp'
  | 'Paste'
  | 'Pause'
  | 'Period'
  | 'Power'
  | 'PrintScreen'
  | 'Props'
  | 'Quote'
  | 'ScrollLock'
  | 'Select'
  | 'Semicolon'
  | 'ShiftLeft'
  | 'ShiftRight'
  | 'Slash'
  | 'Sleep'
  | 'Space'
  | 'Tab'
  | 'Undo'
  | 'VolumeDown'
  | 'VolumeMute'
  | 'VolumeUp'
  | 'WakeUp';

const ONE_ONE = {
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  KeyA: 'A',
  KeyB: 'B',
  KeyC: 'C',
  KeyD: 'D',
  KeyE: 'E',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyI: 'I',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  KeyM: 'M',
  KeyN: 'N',
  KeyO: 'O',
  KeyP: 'P',
  KeyQ: 'Q',
  KeyR: 'R',
  KeyS: 'S',
  KeyT: 'T',
  KeyU: 'U',
  KeyV: 'V',
  KeyW: 'W',
  KeyX: 'X',
  KeyY: 'Y',
  KeyZ: 'Z',
  Space: ' ',
  Quote: "'",
  Equal: '=',
  Comma: ',',
  Minus: '-',
  Period: '.',
  Slash: '/',
  Semicolon: ';',
  BracketLeft: '[',
  Backslash: '\\',
  BracketRight: ']',
  Backquote: '`',
} as const;
