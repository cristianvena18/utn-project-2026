PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  path TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  national_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  insurance_type TEXT NOT NULL,
  insurance_name TEXT,
  user_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  scheduled_at TEXT NOT NULL,
  status TEXT NOT NULL,
  triage_level TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id),
  UNIQUE (doctor_id, scheduled_at)
);

CREATE TABLE IF NOT EXISTS clinical_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS allergies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  substance TEXT NOT NULL,
  severity TEXT NOT NULL,
  clinical_event_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (clinical_event_id) REFERENCES clinical_events(id)
);

CREATE TABLE IF NOT EXISTS vital_signs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  recorded_by INTEGER NOT NULL,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  heart_rate INTEGER NOT NULL,
  temperature REAL NOT NULL,
  spo2 INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (recorded_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS indications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  prescribed_by INTEGER NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (prescribed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS medication_administrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  indication_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL,
  nurse_id INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (indication_id) REFERENCES indications(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (nurse_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS nursing_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  nurse_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (nurse_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS care_protocols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  admission_type TEXT NOT NULL,
  steps TEXT NOT NULL,
  created_by INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS beds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  patient_id INTEGER,
  block_reason TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS supplies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  stock INTEGER NOT NULL,
  unit TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS supply_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supply_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  patient_id INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (supply_id) REFERENCES supplies(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS pharmacy_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  substance TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS charges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  concept TEXT NOT NULL,
  base_amount REAL NOT NULL,
  billed_amount REAL NOT NULL,
  insurance_type TEXT NOT NULL,
  strategy TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_events_patient ON clinical_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_charges_patient ON charges(patient_id);
