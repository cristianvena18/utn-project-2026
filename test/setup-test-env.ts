// Se ejecuta antes de cada suite (ver "setupFiles" en la config de Jest).
// Fuerza NODE_ENV=test para que DatabaseModule use SQLite ':memory:' y los
// tests nunca lean ni escriban la base real (data/app.sqlite), aunque la
// terminal o el .env tengan otro NODE_ENV.
process.env.NODE_ENV = 'test';
