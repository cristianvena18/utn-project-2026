# Módulos de dominio

```
src/modules/<feature>/
  <feature>.module.ts
  domain/
  application/
  infrastructure/
  api/
```

Los subscribers de eventos viven en `api/` y exponen un solo método `handle`. Cada controller y cada use case tiene un único método público.

| Módulo | Patrones |
| --- | --- |
| iam | Guard, RBAC |
| admissions | State (turno), unique de concurrencia |
| ehr | Event sourcing append-only, Observer |
| nursing | Builder de protocolos |
| resources | State (cama), optimistic locking |
| billing | Strategy de cobertura |
