import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, validateDatabaseTarget } from '@careeros/database';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('[PrismaService] DATABASE_URL is not configured.');
    }

    const env = (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development';
    validateDatabaseTarget(dbUrl, env);

    this.logger.log(`Connecting to PostgreSQL database (${env} mode)...`);
    await this.$connect();
    this.logger.log('PostgreSQL database connection established.');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from PostgreSQL database...');
    await this.$disconnect();
    this.logger.log('PostgreSQL database connection closed.');
  }
}
