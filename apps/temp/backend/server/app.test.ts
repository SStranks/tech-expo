import { describe, test } from 'node:test';
import assert from 'node:assert';
import app from './app';
import request from 'supertest';

function Multiply(a: number, b: number) {
  return a * b;
}

describe('Test Node App', () => {
  test('First test', () => {
    return assert.equal(Multiply(2, 3), 6);
  });

  test('Main App', async () => {
    const res = await request(app).get('/test');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { message: 'test complete' });
  });
});
