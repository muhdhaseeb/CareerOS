import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { INestApplication, Controller, Post, Body, Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { IsEmail, IsInt, IsNotEmpty, IsOptional, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { configureApp } from '../src/setup-app';
import { StructuredLogger } from '../src/common/logger/structured.logger';

// In-test-only DTOs and Controller — never exposed in production
class TestAddressDto {
  @IsNotEmpty()
  street!: string;

  @IsNotEmpty()
  zipCode!: string;
}

class CreateUserTestDto {
  @IsEmail()
  email!: string;

  @IsInt()
  @Min(18)
  age!: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => TestAddressDto)
  address?: TestAddressDto;
}

@Controller('test-validation')
class TestValidationController {
  @Post()
  createUser(@Body() dto: CreateUserTestDto) {
    return { created: true, user: dto };
  }
}

@Module({
  controllers: [TestValidationController],
  providers: [StructuredLogger],
})
class TestValidationModule {}

describe('Request Validation & Error Standards (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestValidationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should accept valid payload and return standardized success envelope', async () => {
    const validPayload = {
      email: 'candidate@careeros.com',
      age: 25,
      address: {
        street: 'Main Street 10',
        zipCode: '12345',
      },
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/test-validation')
      .send(validPayload)
      .expect(201);

    expect(res.body).toEqual({
      success: true,
      data: {
        created: true,
        user: validPayload,
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });
    expect(res.headers['x-correlation-id']).toBe(res.body.meta.correlationId);
  });

  it('should reject unwhitelisted properties (forbidNonWhitelisted: true)', async () => {
    const payloadWithExtra = {
      email: 'candidate@careeros.com',
      age: 25,
      maliciousField: 'exploit-attempt',
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/test-validation')
      .send(payloadWithExtra)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'property',
          message: expect.stringContaining('property maliciousField should not exist'),
        }),
      ]),
    );
    expect(res.body.meta.correlationId).toBeDefined();
  });

  it('should reject invalid data types (string instead of integer for age)', async () => {
    const invalidTypePayload = {
      email: 'candidate@careeros.com',
      age: 'not-a-number',
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/test-validation')
      .send(invalidTypePayload)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.details.length).toBeGreaterThanOrEqual(1);
  });

  it('should validate nested DTOs properly', async () => {
    const invalidNestedPayload = {
      email: 'candidate@careeros.com',
      age: 22,
      address: {
        street: 'Some Street',
        // missing zipCode
      },
    };

    const res = await request(app.getHttpServer())
      .post('/api/v1/test-validation')
      .send(invalidNestedPayload)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(
      res.body.error.details.some((d: { message: string }) =>
        d.message.includes('address.zipCode'),
      ),
    ).toBe(true);
  });

  it('should return 404 with standardized error envelope for non-existent route', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/non-existent-endpoint').expect(404);

    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: expect.stringContaining('Cannot GET /api/v1/non-existent-endpoint'),
      },
      meta: {
        timestamp: expect.any(String),
        correlationId: expect.any(String),
      },
    });
  });
});
