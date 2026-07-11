import { classes } from './classnames';

describe('classes function', () => {
  describe('should return "" className', () => {
    test('when no arguments', () => {
      expect(classes()).toBe('');
    });
    test('when boolean arguments', () => {
      expect(classes(false, true)).toBe('');
    });

    test('when undefined/null arguments', () => {
      expect(classes(null, undefined)).toBe('');
    });

    test('when number arguments', () => {
      expect(classes(0, 1, 2, 3, 4)).toBe('');
    });

    test('when "" arguments', () => {
      expect(classes('')).toBe('');
    });
  });

  describe('should return " " joined className', () => {
    test('when one string arguments', () => {
      expect(classes('className')).toBe('className');
      expect(classes('className className')).toBe('className className');
    });
    test('when two string arguments', () => {
      expect(classes('className', 'className')).toBe('className className');
    });
    test('when object with loading key', () => {
      expect(typeof classes({ loading: false })).toBe('string');
      expect(typeof classes({ loading: true })).toBe('string');
    });
  });
});
