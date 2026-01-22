import { describe, it, expect } from 'vitest';
import {
  getCreatedDays,
  getFundingTier,
  getFundingPercent,
  getFundingBarClass,
  formatUSD,
  getFundsAmount,
  getParticipants,
} from './memeUtils';
import { MemeToken } from '../../domain/meme';

describe('memeUtils', () => {
  describe('getCreatedDays', () => {
    it('should return the number of days from createdAt string', () => {
      expect(getCreatedDays('1d ago')).toBe(1);
      expect(getCreatedDays('2d ago')).toBe(2);
      expect(getCreatedDays('12h ago')).toBe(0);
      expect(getCreatedDays('3d ago')).toBe(3);
    });

    it('should return the provided createdDays if it exists', () => {
      expect(getCreatedDays('1d ago', 5)).toBe(5);
      expect(getCreatedDays('12h ago', 10)).toBe(10);
    });

    it('should return 0 for invalid createdAt string', () => {
      expect(getCreatedDays('invalid date')).toBe(0);
      expect(getCreatedDays('')).toBe(0);
    });
  });

  describe('getFundingTier', () => {
    it('should return cold for amounts less than 1000', () => {
      expect(getFundingTier(500)).toBe('cold');
      expect(getFundingTier(999)).toBe('cold');
      expect(getFundingTier(0)).toBe('cold');
    });

    it('should return takeoff for amounts between 1000 and 10000', () => {
      expect(getFundingTier(1000)).toBe('takeoff');
      expect(getFundingTier(5000)).toBe('takeoff');
      expect(getFundingTier(9999)).toBe('takeoff');
    });

    it('should return hot for amounts 10000 and above', () => {
      expect(getFundingTier(10000)).toBe('hot');
      expect(getFundingTier(50000)).toBe('hot');
      expect(getFundingTier(100000)).toBe('hot');
    });
  });

  describe('getFundingPercent', () => {
    it('should return correct percentage for cold tier', () => {
      expect(getFundingPercent(500)).toBe(0.5);
      expect(getFundingPercent(999)).toBe(0.999);
      expect(getFundingPercent(0)).toBe(0);
    });

    it('should return correct percentage for takeoff tier', () => {
      expect(getFundingPercent(5000)).toBe(0.5);
      expect(getFundingPercent(1000)).toBe(0.1);
      expect(getFundingPercent(9999)).toBe(0.9999);
    });

    it('should return correct percentage for hot tier', () => {
      expect(getFundingPercent(50000)).toBe(0.5);
      expect(getFundingPercent(10000)).toBe(0.1);
      expect(getFundingPercent(100000)).toBe(1);
      expect(getFundingPercent(200000)).toBe(1);
    });
  });

  describe('getFundingBarClass', () => {
    it('should return correct class for cold tier', () => {
      const barClass = getFundingBarClass('cold');
      expect(barClass).toContain('from-blue-500 to-cyan-400');
    });

    it('should return correct class for takeoff tier', () => {
      const barClass = getFundingBarClass('takeoff');
      expect(barClass).toContain('from-orange-400 to-amber-300');
    });

    it('should return correct class for hot tier', () => {
      const barClass = getFundingBarClass('hot');
      expect(barClass).toContain('from-emerald-400 to-green-300');
    });
  });

  describe('formatUSD', () => {
    it('should format small amounts correctly', () => {
      expect(formatUSD(500)).toBe('$500');
      expect(formatUSD(999)).toBe('$999');
      expect(formatUSD(0)).toBe('$0');
    });

    it('should format large amounts with K suffix', () => {
      expect(formatUSD(1000)).toBe('$1.0K');
      expect(formatUSD(5500)).toBe('$5.5K');
      expect(formatUSD(12345)).toBe('$12.3K');
      expect(formatUSD(999999)).toBe('$1000.0K');
    });
  });

  describe('getFundsAmount', () => {
    it('should return raisedUsd if it exists', () => {
      const token: MemeToken = {
        id: '1',
        name: 'Test Token',
        ticker: 'TEST',
        creator: 'test',
        creatorAvatar: 'test',
        createdAt: '1d ago',
        marketCap: '$10K',
        marketCapValue: 10000,
        description: 'Test token',
        image: 'test',
        replies: 0,
        progress: 0,
        raisedUsd: 5000,
      };

      expect(getFundsAmount(token)).toBe(5000);
    });

    it('should return marketCapValue if raisedUsd does not exist', () => {
      const token: MemeToken = {
        id: '1',
        name: 'Test Token',
        ticker: 'TEST',
        creator: 'test',
        creatorAvatar: 'test',
        createdAt: '1d ago',
        marketCap: '$10K',
        marketCapValue: 10000,
        description: 'Test token',
        image: 'test',
        replies: 0,
        progress: 0,
      };

      expect(getFundsAmount(token)).toBe(10000);
    });
  });

  describe('getParticipants', () => {
    it('should return participants if it exists', () => {
      const token: MemeToken = {
        id: '1',
        name: 'Test Token',
        ticker: 'TEST',
        creator: 'test',
        creatorAvatar: 'test',
        createdAt: '1d ago',
        marketCap: '$10K',
        marketCapValue: 10000,
        description: 'Test token',
        image: 'test',
        replies: 10,
        progress: 0,
        participants: 50,
      };

      expect(getParticipants(token)).toBe(50);
    });

    it('should return replies if participants does not exist', () => {
      const token: MemeToken = {
        id: '1',
        name: 'Test Token',
        ticker: 'TEST',
        creator: 'test',
        creatorAvatar: 'test',
        createdAt: '1d ago',
        marketCap: '$10K',
        marketCapValue: 10000,
        description: 'Test token',
        image: 'test',
        replies: 10,
        progress: 0,
      };

      expect(getParticipants(token)).toBe(10);
    });
  });
});
