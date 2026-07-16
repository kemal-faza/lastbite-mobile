import { ApiError } from '../client';

describe('ApiError', () => {
  it('should have status, code, and message properties', () => {
    const err = new ApiError(404, 'NOT_FOUND', 'Resource not found');

    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('Resource not found');
  });

  it('should have name set to ApiError', () => {
    const err = new ApiError(401, 'UNAUTHORIZED', 'Invalid token');

    expect(err.name).toBe('ApiError');
  });

  it('should be an instance of Error and ApiError', () => {
    const err = new ApiError(500, 'SERVER_ERROR', 'Internal server error');

    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('should handle different status codes', () => {
    const statuses = [400, 401, 403, 404, 422, 500, 503];

    statuses.forEach((status) => {
      const err = new ApiError(status, 'ERROR', 'msg');
      expect(err.status).toBe(status);
    });
  });

  it('should handle empty code', () => {
    const err = new ApiError(400, '', 'Bad request');

    expect(err.code).toBe('');
    expect(err.message).toBe('Bad request');
  });

  it('should support stack trace', () => {
    const err = new ApiError(500, 'ERROR', 'Server error');

    expect(typeof err.stack).toBe('string');
  });
});
