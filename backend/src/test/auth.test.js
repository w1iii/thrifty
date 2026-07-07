import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('../../db/pool.js', () => ({
  default: {
    query: vi.fn(),
  },
}));

const { default: pool } = await import('../../db/pool.js');

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';

const { signup, login, refresh, getData, changePassword } = await import('../../controllers/authController.js');

function mockReqRes(overrides = {}) {
  const req = {
    body: {},
    cookies: {},
    user: null,
    ...overrides,
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    cookie: vi.fn().mockReturnThis(),
    clearCookie: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
  };
  return { req, res };
}

describe('signup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 201 on successful signup', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 1, email: 'a@b.com', first_name: 'A', last_name: 'B' }] });

    const { req, res } = mockReqRes({
      body: { email: 'a@b.com', password: 'password123', first_name: 'A' },
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'User created successfully',
    }));
  });

  it('returns 409 if email already exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const { req, res } = mockReqRes({
      body: { email: 'a@b.com', password: 'password123' },
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already registered' });
  });
});

describe('login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 for invalid email', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const { req, res } = mockReqRes({
      body: { email: 'none@b.com', password: 'password123' },
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 200 with token on successful login', async () => {
    const hashedPassword = await import('bcrypt').then(m => m.hashSync('password123', 10));
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, email: 'a@b.com', password_hash: hashedPassword, first_name: 'A', city: 'NYC' }],
    });

    const { req, res } = mockReqRes({
      body: { email: 'a@b.com', password: 'password123' },
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: expect.any(String),
    }));
  });
});

describe('refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without refresh token', async () => {
    const { req, res } = mockReqRes({ cookies: {} });
    await refresh(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns new access token with valid refresh token', async () => {
    const refreshToken = jwt.sign({ id: 1 }, process.env.REFRESH_TOKEN_SECRET);
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'a@b.com' }] });

    const { req, res } = mockReqRes({
      cookies: { refreshToken },
    });

    await refresh(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      accessToken: expect.any(String),
    }));
  });
});

describe('getData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, first_name: 'A', email: 'a@b.com', phone_number: null, city: 'NYC', state: 'NY' }],
    });

    const { req, res } = mockReqRes({ user: { id: 1 } });

    await getData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({ email: 'a@b.com' }),
    }));
  });
});

describe('changePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without user id', async () => {
    const { req, res } = mockReqRes({ user: {} });
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('returns 404 for nonexistent user', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const { req, res } = mockReqRes({ user: { id: 999 }, body: { currentPassword: 'old', newPassword: 'new', confirmPassword: 'new' } });
    await changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
