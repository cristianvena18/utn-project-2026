import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { setupApp } from './../src/setup/app.setup';

type HealthResponse = {
  status: string;
  info: { database: { status: string } };
};

describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@hospital.local', password: 'Admin123!' })
      .expect(201);
    token = (login.body as { accessToken: string }).accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api', () => {
    return request(app.getHttpServer()).get('/api').expect(200).expect({
      status: 'ok',
      service: 'proyecto-integrador-extendido',
    });
  });

  it('GET /api/health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res: { body: HealthResponse }) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.info.database.status).toBe('up');
      });
  });

  it('GET /api/docs', () => {
    return request(app.getHttpServer()).get('/api/docs').expect(200);
  });

  it('rejects beds without token', () => {
    return request(app.getHttpServer()).get('/api/beds').expect(401);
  });

  it('lists beds with admin token', () => {
    return request(app.getHttpServer())
      .get('/api/beds')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res: { body: Array<{ code: string }> }) => {
        expect(res.body.some((bed) => bed.code === '101')).toBe(true);
      });
  });
});
