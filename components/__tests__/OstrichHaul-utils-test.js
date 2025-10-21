import { calculateGravity } from '../Home/OstrichHaul/utils';

describe('OstrichHaul Utils', () => {
  describe('calculateGravity', () => {
    it('returns normal gravity when not jumping and not holding', () => {
      const gravity = calculateGravity(false, 0, 'Easy', false);
      expect(gravity).toBe(1);
    });

    it('returns glide gravity when holding and velocity is positive (falling)', () => {
      const gravity = calculateGravity(true, 5, 'Easy', true);
      expect(gravity).toBe(0.3);
    });

    it('returns normal reduced gravity when jumping near peak (velocity between -5 and 5) on Easy', () => {
      const gravity = calculateGravity(true, 0, 'Easy', false);
      expect(gravity).toBe(0.2);
    });

    it('returns higher reduced gravity when jumping near peak on Hard', () => {
      const gravity = calculateGravity(true, 0, 'Hard', false);
      expect(gravity).toBe(0.6);
    });

    it('prioritizes glide gravity over peak gravity when holding and falling', () => {
      const gravity = calculateGravity(true, 3, 'Easy', true);
      expect(gravity).toBe(0.3); // Should return glide gravity, not peak gravity
    });

    it('returns normal gravity when holding but velocity is negative (still rising)', () => {
      const gravity = calculateGravity(true, -10, 'Easy', true);
      expect(gravity).toBe(1); // Should use normal gravity since velocity is negative
    });

    it('applies glide gravity when holding and velocity is just above zero', () => {
      const gravity = calculateGravity(true, 1, 'Medium', true);
      expect(gravity).toBe(0.3);
    });
  });
});
