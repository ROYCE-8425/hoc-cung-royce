import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SubscriptionService } from './subscription.service';
import { DatabaseService } from '../database/database.service';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let db: DatabaseService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string, defaultValue?: any) => {
      if (key === 'STRIPE_SECRET_KEY') return 'sk_test_mock_stripe_key_longer_than_normal';
      if (key === 'STRIPE_PRICE_ID_MONTHLY') return 'price_monthly_id_123456';
      if (key === 'STRIPE_PRICE_ID_YEARLY') return 'price_yearly_id_123456';
      return defaultValue;
    }),
  };

  const mockDatabaseService = {
    query: jest.fn().mockResolvedValue({ rowCount: 1, rows: [] }),
    queryOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    db = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upgradeToPro', () => {
    it('should run UPDATE SQL query with correct parameters setting plan, status, and 10 year end date', async () => {
      const userId = 'user-uuid-1234';

      // Mock db.query to return rowCount = 1 (successful update)
      mockDatabaseService.query.mockResolvedValueOnce({ rowCount: 1, rows: [] });

      await service.upgradeToPro(userId);

      // Verify the first query executed was the update query
      expect(db.query).toHaveBeenCalled();
      const firstCall = mockDatabaseService.query.mock.calls[0];
      const sql = firstCall[0];
      const params = firstCall[1];

      expect(sql).toContain('UPDATE subscriptions SET');
      expect(sql).toContain("plan = 'yearly'");
      expect(sql).toContain("status = 'active'");
      expect(sql).toContain('cancel_at_period_end = false');

      // Params should be [now, periodEnd, now, userId]
      expect(params).toHaveLength(4);
      expect(params[3]).toBe(userId);

      // current_period_end should be ~10 years in the future
      const periodEnd = params[1] as Date;
      const expectedEndYear = new Date().getFullYear() + 10;
      expect(periodEnd.getFullYear()).toBe(expectedEndYear);
    });

    it('should log a warning and execute a fallback insert if update rowCount is 0 (no subscription row exists)', async () => {
      const userId = 'user-uuid-5678';

      // Mock db.query to return rowCount = 0 for the update (simulating no subscription row)
      mockDatabaseService.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      // Mock the second query (fallback insert) to be successful
      mockDatabaseService.query.mockResolvedValueOnce({ rowCount: 1, rows: [] });

      await service.upgradeToPro(userId);

      // Verify that db.query was called twice
      expect(db.query).toHaveBeenCalledTimes(2);

      // Verify the first call was the UPDATE
      const firstCall = mockDatabaseService.query.mock.calls[0];
      expect(firstCall[0]).toContain('UPDATE subscriptions SET');
      expect(firstCall[1][3]).toBe(userId);

      // Verify the second call was the fallback INSERT with ON CONFLICT DO UPDATE
      const secondCall = mockDatabaseService.query.mock.calls[1];
      expect(secondCall[0]).toContain('INSERT INTO subscriptions');
      expect(secondCall[1][0]).toBe(userId);
      expect(secondCall[1][1]).toBe(`local_${userId}`);
    });
  });
});
