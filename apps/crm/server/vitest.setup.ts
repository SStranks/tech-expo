import { vi } from 'vitest';

vi.mock('#Config/dbPostgres', () => ({
  connectPostgresDB: vi.fn(),
  postgresClient: vi.fn(),
  postgresDB: vi.fn(),
}));

vi.mock('#Config/dbRedis', () => ({
  connectRedisDB: vi.fn(),
  redisClient: vi.fn(),
}));

vi.mock('#Config/dbMongo', () => ({
  connectMongoDB: vi.fn(),
  mongoClient: vi.fn(),
  mongoDB: vi.fn(),
}));
