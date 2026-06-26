import { describe, it, expect } from 'vitest';
import API_BASE_URL from './config.js';

describe('config', () => {
  it('exports API_BASE_URL as a string', () => {
    expect(typeof API_BASE_URL).toBe('string');
    expect(API_BASE_URL).toMatch(/^https?:\/\//);
  });
});
