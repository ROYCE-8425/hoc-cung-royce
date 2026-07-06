import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { DatabaseService } from './modules/database/database.service';
import { RedisService } from './modules/redis/redis.service';
import { QdrantService } from './modules/qdrant/qdrant.service';

describe('HealthController', () => {
  let controller: HealthController;

  const mockDatabaseService = {
    healthCheck: jest.fn().mockResolvedValue(true),
  };

  const mockRedisService = {
    healthCheck: jest.fn().mockResolvedValue(true),
  };

  const mockQdrantService = {
    healthCheck: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: DatabaseService, useValue: mockDatabaseService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: QdrantService, useValue: mockQdrantService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('root', () => {
    it('should return API name, version and documentation path', () => {
      const result = controller.root();
      expect(result).toBeDefined();
      expect(result.name).toBe('Học cùng Royce API');
      expect(result.documentation).toBe('/api/v1/docs');
      expect(result.version).toBeDefined();
    });
  });

  describe('health', () => {
    it('should return healthy when all services are healthy', async () => {
      mockDatabaseService.healthCheck.mockResolvedValueOnce(true);
      mockRedisService.healthCheck.mockResolvedValueOnce(true);
      mockQdrantService.healthCheck.mockResolvedValueOnce(true);

      const result = await controller.health();

      expect(result.status).toBe('healthy');
      expect(result.services).toEqual({
        database: true,
        redis: true,
        qdrant: true,
      });
    });

    it('should return degraded when database is down but other services are healthy', async () => {
      mockDatabaseService.healthCheck.mockRejectedValueOnce(new Error('DB down'));
      mockRedisService.healthCheck.mockResolvedValueOnce(true);
      mockQdrantService.healthCheck.mockResolvedValueOnce(true);

      const result = await controller.health();

      expect(result.status).toBe('degraded');
      expect(result.services).toEqual({
        database: false,
        redis: true,
        qdrant: true,
      });
    });

    it('should return degraded when only one service is healthy', async () => {
      mockDatabaseService.healthCheck.mockRejectedValueOnce(new Error('DB down'));
      mockRedisService.healthCheck.mockRejectedValueOnce(new Error('Redis down'));
      mockQdrantService.healthCheck.mockResolvedValueOnce(true);

      const result = await controller.health();

      expect(result.status).toBe('degraded');
      expect(result.services).toEqual({
        database: false,
        redis: false,
        qdrant: true,
      });
    });

    it('should return unhealthy when all services are down', async () => {
      mockDatabaseService.healthCheck.mockRejectedValueOnce(new Error('DB down'));
      mockRedisService.healthCheck.mockRejectedValueOnce(new Error('Redis down'));
      mockQdrantService.healthCheck.mockRejectedValueOnce(new Error('Qdrant down'));

      const result = await controller.health();

      expect(result.status).toBe('unhealthy');
      expect(result.services).toEqual({
        database: false,
        redis: false,
        qdrant: false,
      });
    });
  });
});
