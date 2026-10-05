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

// TEST END-TO-END
// Levanta el AppModule completo (todos los módulos, guards, pipes, filtros y
// una SQLite en memoria con datos de demo) y le habla por HTTP con supertest,
// igual que un cliente real. Es el tipo de test más lento, pero el único que
// prueba que todas las piezas funcionan juntas, del request a la response.
describe('API (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let nurseToken: string;
  let patientToken: string;

  const login = async (email: string, password: string) => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);
    return (res.body as { accessToken: string }).accessToken;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();

    token = await login('admin@hospital.local', 'Admin123!');
    nurseToken = await login('nurse@hospital.local', 'Nurse123!');
    patientToken = await login('patient@hospital.local', 'Patient123!');
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

  it('rejects login with a wrong password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@hospital.local', password: 'WrongPass123!' })
      .expect(401);
  });

  it('forbids a PATIENT from deducting supplies (RBAC)', () => {
    return request(app.getHttpServer())
      .post('/api/supplies/1/deduct')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ quantity: 1 })
      .expect(403);
  });

  it('rejects an invalid body with 400 (ValidationPipe)', () => {
    return request(app.getHttpServer())
      .post('/api/supplies/1/deduct')
      .set('Authorization', `Bearer ${nurseToken}`)
      .send({ quantity: 0 })
      .expect(400);
  });

  it('maps InsufficientStockException to 409 Conflict', () => {
    return request(app.getHttpServer())
      .post('/api/supplies/1/deduct')
      .set('Authorization', `Bearer ${nurseToken}`)
      .send({ quantity: 1_000_000 })
      .expect(409);
  });
});
