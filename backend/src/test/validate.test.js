import { describe, it, expect, vi } from 'vitest';
import { validate, signupSchema, loginSchema, changePasswordSchema, swipeSchema, addItemSchema } from '../../middleware/validate.js';

function mockReqRes(overrides = {}) {
  const req = { body: {}, ...overrides };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('validate', () => {
  it('calls next on valid data', () => {
    const { req, res, next } = mockReqRes({
      body: { email: 'a@b.com', password: 'password123' },
    });
    validate(loginSchema)(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('returns 400 on invalid data', () => {
    const { req, res, next } = mockReqRes({
      body: { email: 'not-an-email', password: '' },
    });
    validate(loginSchema)(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });
});

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse({
      email: 'a@b.com',
      password: 'password123',
      first_name: 'Test',
    });
    expect(result.success).toBe(true);
  });

  it('accepts null optional fields', () => {
    const result = signupSchema.safeParse({
      email: 'a@b.com',
      password: 'password123',
      phone_number: null,
      city: null,
      state: null,
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = signupSchema.safeParse({ email: 'a@b.com', password: '123' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({ email: 'bad', password: 'password123' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid login', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' });
    expect(result.success).toBe(true);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('changePasswordSchema', () => {
  it('accepts matching passwords', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'newpassword1',
      confirmPassword: 'newpassword1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects non-matching passwords', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old',
      newPassword: 'newpassword1',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });
});

describe('swipeSchema', () => {
  it('accepts liked action', () => {
    const result = swipeSchema.safeParse({ itemId: 1, action: 'liked' });
    expect(result.success).toBe(true);
  });

  it('accepts passed action', () => {
    const result = swipeSchema.safeParse({ itemId: 1, action: 'passed' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid action', () => {
    const result = swipeSchema.safeParse({ itemId: 1, action: 'maybe' });
    expect(result.success).toBe(false);
  });

  it('rejects non-numeric itemId', () => {
    const result = swipeSchema.safeParse({ itemId: 'abc', action: 'liked' });
    expect(result.success).toBe(false);
  });
});

describe('addItemSchema', () => {
  it('accepts valid item', () => {
    const result = addItemSchema.safeParse({ title: 'Shirt', price: '25.00' });
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = addItemSchema.safeParse({ price: '25.00' });
    expect(result.success).toBe(false);
  });

  it('rejects zero price', () => {
    const result = addItemSchema.safeParse({ title: 'Shirt', price: '0' });
    expect(result.success).toBe(false);
  });
});
