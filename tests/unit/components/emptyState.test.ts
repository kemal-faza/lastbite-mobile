import { EmptyState } from '@/components/EmptyState';

describe('EmptyState', () => {
  it('should export EmptyState as a function component', () => {
    expect(typeof EmptyState).toBe('function');
  });
});

describe('SkeletonCard', () => {
  it('should export SkeletonList as a function component', () => {
    const { SkeletonList } = require('@/components/SkeletonCard');
    expect(typeof SkeletonList).toBe('function');
  });
});
