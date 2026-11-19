import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health status ok', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.version).toBe('0.1.0');
    });

    it('should resolve PrismaService from PrismaModule', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [PrismaModule],
      }).compile();
      const prismaService = module.get<PrismaService>(PrismaService);
      expect(prismaService).toBeDefined();
    });
  });
});
