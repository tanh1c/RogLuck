import { describe, it, expect } from 'vitest';
import { generateFloor, getRoomIcon, getRoomColorClass, getRoomDisplayName } from '../../utils/floor-generator';

describe('floor-generator', () => {
  describe('generateFloor', () => {
    it('should generate floor 1 with correct structure', () => {
      const floor = generateFloor(1);

      expect(floor).toBeDefined();
      expect(floor.length).toBeGreaterThanOrEqual(3);
      expect(floor.every(room => room.id && room.type)).toBe(true);
    });

    it('should generate floor 10 with boss room', () => {
      const floor = generateFloor(10);

      expect(floor).toBeDefined();
      const bossRoom = floor.find(room => room.type === 'boss');
      expect(bossRoom).toBeDefined();
      expect(bossRoom?.enemy).toBeDefined();
      expect(bossRoom?.enemy?.maxHp).toBeGreaterThan(100);
    });

    it('should generate gambling rooms with enemies', () => {
      const floor = generateFloor(3);
      const gamblingRooms = floor.filter(room => room.type === 'gambling');

      expect(gamblingRooms.length).toBeGreaterThan(0);
      gamblingRooms.forEach(room => {
        expect(room.enemy).toBeDefined();
        expect(room.enemy?.hp).toBeGreaterThan(0);
        expect(room.enemy?.maxHp).toBeGreaterThan(0);
      });
    });

    it('should have increasing difficulty with floor number', () => {
      const floor1 = generateFloor(1);
      const floor5 = generateFloor(5);
      const floor10 = generateFloor(10);

      const floor1Enemy = floor1.find(r => r.enemy)?.enemy;
      const floor5Enemy = floor5.find(r => r.enemy)?.enemy;
      const floor10Enemy = floor10.find(r => r.enemy)?.enemy;

      if (floor1Enemy && floor5Enemy && floor10Enemy) {
        expect(floor5Enemy.maxHp).toBeGreaterThan(floor1Enemy.maxHp);
        expect(floor10Enemy.maxHp).toBeGreaterThan(floor5Enemy.maxHp);
      }
    });
  });

  describe('getRoomIcon', () => {
    it('should return correct icons for each room type', () => {
      expect(getRoomIcon('gambling')).toBe('🎰');
      expect(getRoomIcon('shop')).toBe('🏪');
      expect(getRoomIcon('rest')).toBe('💤');
      expect(getRoomIcon('treasure')).toBe('💰');
      expect(getRoomIcon('elite')).toBe('⚔️');
      expect(getRoomIcon('boss')).toBe('👹');
    });
  });

  describe('getRoomColorClass', () => {
    it('should return color classes for each room type', () => {
      expect(getRoomColorClass('gambling')).toContain('border-purple');
      expect(getRoomColorClass('shop')).toContain('border-yellow');
      expect(getRoomColorClass('rest')).toContain('border-green');
      expect(getRoomColorClass('treasure')).toContain('border-amber');
      expect(getRoomColorClass('elite')).toContain('border-red');
      expect(getRoomColorClass('boss')).toContain('border-rose');
    });
  });

  describe('getRoomDisplayName', () => {
    it('should return correct display names', () => {
      expect(getRoomDisplayName('gambling')).toBe('Gambling Combat');
      expect(getRoomDisplayName('shop')).toBe('Shop');
      expect(getRoomDisplayName('rest')).toBe('Rest Site');
      expect(getRoomDisplayName('treasure')).toBe('Treasure Room');
      expect(getRoomDisplayName('elite')).toBe('Elite Fight');
      expect(getRoomDisplayName('boss')).toBe('Boss Room');
    });
  });
});
