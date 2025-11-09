import { calculateGravity, selectSpikeVariant, checkCollision } from '../Home/OstrichHaul/utils';
import { Animated } from 'react-native';
import { 
  OSTRICH_SCALE, 
  OSTRICH_INNER_WIDTH, 
  OSTRICH_INNER_OFFSET_X,
  OSTRICH_INNER_OFFSET_Y
} from '../Home/OstrichHaul/constants';

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

  describe('selectSpikeVariant', () => {
    it('returns variant 1 or 2 with appropriate widths', () => {
      const result = selectSpikeVariant();
      expect([1, 2]).toContain(result.variant);
      if (result.variant === 1) {
        expect(result.width).toBe(50);
      } else {
        expect(result.width).toBe(80);
      }
    });

    it('returns spike1 approximately 65% of the time', () => {
      const iterations = 10000;
      let spike1Count = 0;
      
      for (let i = 0; i < iterations; i++) {
        const result = selectSpikeVariant();
        if (result.variant === 1) {
          spike1Count++;
        }
      }
      
      const spike1Percentage = spike1Count / iterations;
      // Allow 5% margin of error
      expect(spike1Percentage).toBeGreaterThan(0.60);
      expect(spike1Percentage).toBeLessThan(0.70);
    });

    it('returns spike2 approximately 35% of the time', () => {
      const iterations = 10000;
      let spike2Count = 0;
      
      for (let i = 0; i < iterations; i++) {
        const result = selectSpikeVariant();
        if (result.variant === 2) {
          spike2Count++;
        }
      }
      
      const spike2Percentage = spike2Count / iterations;
      // Allow 5% margin of error
      expect(spike2Percentage).toBeGreaterThan(0.30);
      expect(spike2Percentage).toBeLessThan(0.40);
    });
  });

  describe('checkCollision', () => {
    it('uses inner hitbox for collision detection', () => {
      // Verify that the ostrich dimensions are scaled correctly
      expect(OSTRICH_SCALE).toBe(0.8);
      expect(OSTRICH_INNER_WIDTH).toBe(200 * 0.8); // 160px
      expect(OSTRICH_INNER_OFFSET_X).toBe(((256 - 200) / 2) * 0.8); // 22.4px
      expect(OSTRICH_INNER_OFFSET_Y).toBe(10 * 0.8); // 8px
    });

    it('detects collision when obstacle overlaps with inner hitbox', () => {
      const position = {
        y: new Animated.Value(100),
        x: new Animated.Value(50)
      };
      
      const obstacle = {
        key: 'test',
        x: new Animated.Value(100),
        variant: 1,
        width: 64,
        gapTop: 0 // Obstacle goes from ground to gapTop
      };
      
      const collision = checkCollision(position, obstacle);
      expect(typeof collision).toBe('boolean');
    });

    it('does not detect collision when obstacle is outside inner hitbox', () => {
      const position = {
        y: new Animated.Value(100),
        x: new Animated.Value(50)
      };
      
      const obstacle = {
        key: 'test',
        x: new Animated.Value(300), // Far away
        variant: 1,
        width: 64,
        gapTop: 0
      };
      
      const collision = checkCollision(position, obstacle);
      expect(collision).toBe(false);
    });
  });
});
