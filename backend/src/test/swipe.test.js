import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/pool.js', () => ({
  default: {
    query: vi.fn(),
  },
}));

const { default: pool } = await import('../../db/pool.js');
const { getItems, swipeItem, getSavedItems } = await import('../../controllers/swipeController.js');

function mockReqRes(overrides = {}) {
  const req = {
    body: {},
    query: {},
    user: { id: 1 },
    ...overrides,
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return { req, res };
}

describe('getItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paginated items', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ count: '1' }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test Item' }] });

    const { req, res } = mockReqRes({ query: { page: '1', limit: '10' } });

    await getItems(req, res);

    expect(res.json).toHaveBeenCalledWith({
      items: [{ id: 1, title: 'Test Item' }],
      pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
    });
  });

  it('uses default pagination when not provided', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ count: '0' }] })
      .mockResolvedValueOnce({ rows: [] });

    const { req, res } = mockReqRes({ query: {} });

    await getItems(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    }));
  });

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValue(new Error('DB down'));

    const { req, res } = mockReqRes();

    await getItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('swipeItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records a liked swipe', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const { req, res } = mockReqRes({ body: { itemId: 1, action: 'liked' } });

    await swipeItem(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO swipes'),
      [1, 1, 'liked'],
    );
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('records a passed swipe', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    const { req, res } = mockReqRes({ body: { itemId: 2, action: 'passed' } });

    await swipeItem(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValue(new Error('DB down'));
    const { req, res } = mockReqRes({ body: { itemId: 1, action: 'liked' } });

    await swipeItem(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('getSavedItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns paginated saved items', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [{ count: '2' }] })
      .mockResolvedValueOnce({ rows: [{ id: 1, title: 'Saved Item' }] });

    const { req, res } = mockReqRes({ query: { page: '1', limit: '10' } });

    await getSavedItems(req, res);

    expect(res.json).toHaveBeenCalledWith({
      items: [{ id: 1, title: 'Saved Item' }],
      pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
    });
  });

  it('returns 500 on db error', async () => {
    pool.query.mockRejectedValue(new Error('DB down'));
    const { req, res } = mockReqRes();

    await getSavedItems(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
