/**
 * CareerOS — Database Package
 * Exports Prisma Client, database model types, and target safety validators.
 * Adheres strictly to single-ownership lifecycle: consumers instantiate and close their own client.
 */

export * from '@prisma/client';
export { PrismaClient } from '@prisma/client';
export { validateDatabaseTarget } from './safety-guard';
