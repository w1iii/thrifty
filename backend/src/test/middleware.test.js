import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'test-jwt-secret';

const authenticateToken = (await import('../../middleware/authenticateToken.js')).default;

function mockReqRes(overrides = {}) {
  const req = {
    headers: {},
    ...overrides,
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('authenticateToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without token', () => {
    const { req, res, next } = mockReqRes({ headers: {} });
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 with invalid token', () => {
    const { req, res, next } = mockReqRes({
      headers: { authorization: 'Bearer invalid-token' },
    });
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with valid token', () => {
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET);
    const { req, res, next } = mockReqRes({
      headers: { authorization: `Bearer ${token}` },
    });
    authenticateToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(expect.objectContaining({ id: 1 }));
  });
});
