import { formatDuration, formatExerciseDuration } from '@/components/routines/builder/utils/formatters';

describe('formatters', () => {
  describe('formatDuration', () => {
    it('should format seconds to minutes when less than an hour', () => {
      expect(formatDuration(0)).toBe('0min');
      expect(formatDuration(30)).toBe('0min');
      expect(formatDuration(60)).toBe('1min');
      expect(formatDuration(90)).toBe('1min');
      expect(formatDuration(120)).toBe('2min');
      expect(formatDuration(3540)).toBe('59min');
    });

    it('should format seconds to hours and minutes when an hour or more', () => {
      expect(formatDuration(3600)).toBe('1h 0min');
      expect(formatDuration(3660)).toBe('1h 1min');
      expect(formatDuration(5400)).toBe('1h 30min');
      expect(formatDuration(7200)).toBe('2h 0min');
      expect(formatDuration(7260)).toBe('2h 1min');
      expect(formatDuration(7320)).toBe('2h 2min');
      expect(formatDuration(10800)).toBe('3h 0min');
    });
  });

  describe('formatExerciseDuration', () => {
    it('should format seconds to mm:ss format', () => {
      expect(formatExerciseDuration(0)).toBe('00:00');
      expect(formatExerciseDuration(30)).toBe('00:30');
      expect(formatExerciseDuration(60)).toBe('01:00');
      expect(formatExerciseDuration(90)).toBe('01:30');
      expect(formatExerciseDuration(120)).toBe('02:00');
      expect(formatExerciseDuration(3599)).toBe('59:59');
      expect(formatExerciseDuration(3600)).toBe('60:00');
    });
  });
});
