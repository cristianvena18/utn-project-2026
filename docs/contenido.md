# Hospital Information System

API de gestión hospitalaria. Monolito modular NestJS (hexagonal light).

## 1. Contexto

- Nombre del producto: Hospital Information System (HIS)
- Problema que resuelve: unificar admisión, historia clínica, enfermería, camas, inventario y facturación con control de accesos.
- Usuarios / actores: Administrator, Doctor, Nurse, Receptionist, Patient.

## 2. Alcance

### En alcance (MVP)

1. IAM: login JWT, RBAC, auditoría de mutaciones.
2. Admisión y turnos: alta de pacientes, agenda, reserva/cancelación, triaje, State de turno, concurrencia de slot.
3. EHR: eventos clínicos inmutables, alergias, antecedentes, evoluciones, estudios; Observer ante alergia SEVERE.
4. Enfermería: signos vitales, indicaciones, administración de medicación, notas, Builder de protocolos.
5. Recursos: mapa de camas (State + optimistic locking), inventario atómico.
6. Facturación: cargos automáticos y Strategy según cobertura (PRIVATE / PUBLIC / UNINSURED).

### Fuera de alcance

- Microservicios, pasarela de pago real, PACS de imágenes, receta electrónica firmada, FHIR completo.

## 3. Reglas de negocio

1. Un slot médico (`doctorId` + `scheduledAt`) no puede tener dos turnos activos.
2. Un turno sigue: SCHEDULED → CONFIRMED → WAITING_ROOM → ATTENDED; CANCELLED desde SCHEDULED o CONFIRMED.
3. Una cama sigue: AVAILABLE → OCCUPIED → CLEANING → AVAILABLE. Desde AVAILABLE también puede pasar a BLOCKED y volver a AVAILABLE.
4. La HCE no se edita: solo se agregan eventos.
5. Alergia SEVERE notifica enfermería y farmacia.
6. El stock no puede quedar negativo.
7. El importe a cargo del paciente depende de la estrategia de cobertura.

### Máquina de estados — Turno

| Estado | Transiciones permitidas | Quién / cuándo |
| --- | --- | --- |
| SCHEDULED | CONFIRMED, CANCELLED | Paciente/recepción confirma o cancela |
| CONFIRMED | WAITING_ROOM, CANCELLED | Recepcionista/enfermería |
| WAITING_ROOM | ATTENDED | Médico |
| ATTENDED | — | Terminal |
| CANCELLED | — | Terminal |

### Máquina de estados — Cama

| Estado | Transiciones permitidas | Quién / cuándo |
| --- | --- | --- |
| AVAILABLE | OCCUPIED, BLOCKED | Asignación o mantenimiento |
| OCCUPIED | CLEANING | Alta / egreso |
| CLEANING | AVAILABLE | Maestranza confirma |
| BLOCKED | AVAILABLE | Fin de mantenimiento |

## 4. Casos de uso (resumen)

- Login y gestión de usuarios (admin).
- Register patient y reservar turno sin doble booking.
- Clasificar urgencia (triaje) y avanzar el State del turno.
- Append de evolución / alergia en HCE.
- Registrar signos, ejecutar indicación, armar protocolo.
- Asignar cama con locking optimista y descontar stock.
- Generar cargo al atender / internar / medicar.

## 5. Endpoints

Prefijo `/api`. Autenticados con Bearer, salvo login y health.

Ver Swagger en `/api/docs`.

## 6. Concurrencia e integridad

- Turnos: unique `(doctor_id, scheduled_at)` + `version`.
- Camas: columna `version` (optimistic locking).
- Stock: `UPDATE stock = stock - n WHERE stock >= n`.

## 7. Seed

Usuarios demo (password en README): admin, doctor, nurse, reception, patient. Paciente Laura Gómez, cama 101 AVAILABLE, insumos Gauze/Syringes/Saline.

## 8. Patrones

- IAM: Guard + RBAC.
- Turnos y camas: State.
- EHR: Event Sourcing (append-only) + Observer (`EventEmitter`).
- Enfermería: Builder de protocolos.
- Facturación: Strategy por tipo de cobertura.
- Camas/turnos: optimistic locking.
