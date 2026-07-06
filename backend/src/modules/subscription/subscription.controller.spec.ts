import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { JwtPayload } from '../../common';

describe('SubscriptionController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  const mockSubscriptionService = {
    upgradeToPro: jest.fn().mockResolvedValue(undefined),
  };

  const mockUser: JwtPayload = {
    sub: 'user-uuid-1234',
    email: 'test@example.com',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionController],
      providers: [
        {
          provide: SubscriptionService,
          useValue: mockSubscriptionService,
        },
      ],
    }).compile();

    controller = module.get<SubscriptionController>(SubscriptionController);
    service = module.get<SubscriptionService>(SubscriptionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('applyPromoCode', () => {
    it('should successfully upgrade to PRO when code is exactly ILOVEENGLISH', async () => {
      const result = await controller.applyPromoCode(mockUser, { code: 'ILOVEENGLISH' });

      expect(service.upgradeToPro).toHaveBeenCalledWith('user-uuid-1234');
      expect(result).toEqual({
        success: true,
        message: 'Chuc mung! Ban da nang cap thanh cong goi PRO (10 nam)!',
      });
    });

    it('should successfully upgrade to PRO when code has spaces and lowercase', async () => {
      const result = await controller.applyPromoCode(mockUser, { code: '  iloveenglish  ' });

      expect(service.upgradeToPro).toHaveBeenCalledWith('user-uuid-1234');
      expect(result).toEqual({
        success: true,
        message: 'Chuc mung! Ban da nang cap thanh cong goi PRO (10 nam)!',
      });
    });

    it('should throw BadRequestException when code is invalid', async () => {
      await expect(controller.applyPromoCode(mockUser, { code: 'INVALIDCODE' })).rejects.toThrow(
        BadRequestException,
      );

      expect(service.upgradeToPro).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when code is empty or missing', async () => {
      await expect(controller.applyPromoCode(mockUser, { code: '' })).rejects.toThrow(
        BadRequestException,
      );

      expect(service.upgradeToPro).not.toHaveBeenCalled();
    });
  });
});
