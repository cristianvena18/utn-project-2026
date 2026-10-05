# Hospital Information System — API

API REST NestJS 11 (monolito modular, hexagonal light) + TypeORM + SQLite.

## Arranque

```bash
npm install
cp .env.example .env
npm run start:dev
```

| Recurso | URL |
| --- | --- |
| API | http://localhost:3002/api |
| Health | http://localhost:3002/api/health |
| Swagger | http://localhost:3002/api/docs |

## Docker

```bash
docker compose up --build -d   # construye la imagen y levanta la API en :3002
docker compose down            # apaga; los datos quedan en el volumen
docker compose down -v         # apaga y borra la base de datos
```

- `--build` reconstruye la imagen antes de arrancar. Usarlo la primera vez y cada vez que cambie el código o las dependencias; sin él se ejecuta la versión anterior.
- `-d` corre en segundo plano. Ver logs con `docker compose logs -f api`.
- La base SQLite vive en el volumen `sqlite-data` (`/app/data/app.sqlite` dentro del contenedor), separada de la carpeta local `data/`.
- `PORT`, `JWT_SECRET` y `JWT_EXPIRES_SECONDS` se toman del shell o de `.env`. Fuera de desarrollo local, definir un `JWT_SECRET` propio.
- No correr `npm run start:dev` y Docker a la vez: ambos usan el puerto 3002.

## Usuarios demo

| Email | Password | Role |
| --- | --- | --- |
| admin@hospital.local | Admin123! | ADMINISTRATOR |
| doctor@hospital.local | Doctor123! | DOCTOR |
| nurse@hospital.local | Nurse123! | NURSE |
| reception@hospital.local | Reception123! | RECEPTIONIST |
| patient@hospital.local | Patient123! | PATIENT |

Login: `POST /api/auth/login` → `{ accessToken }`. El resto de rutas (salvo health y ping) llevan `Authorization: Bearer <token>`.

Seed: paciente Laura Gómez (national id 30111222, cobertura PRIVATE OSDE), cama 101 AVAILABLE, insumos Gauze / Syringes / Saline.

## Módulos

1. **IAM** — JWT, RBAC, auditoría de mutaciones
2. **Admisión y turnos** — pacientes, agenda, State de turno, unique de slot
3. **EHR** — eventos clínicos append-only, alergias; Observer si SEVERE
4. **Enfermería** — signos, indicaciones, medicación, notas, Builder de protocolos
5. **Recursos** — camas (State + optimistic lock), stock atómico, alertas de farmacia
6. **Facturación** — Strategy (PRIVATE 20% copay / PUBLIC 0 / UNINSURED 100%)

Specs: [`docs/contenido.md`](docs/contenido.md), [`docs/schema.sql`](docs/schema.sql).

## Tests

```bash
npm run test
npm run test:e2e
```
