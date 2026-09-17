import "dotenv/config";

const port = Number(process.env.PORT);
const databasePort = Number(process.env.DATABASE_PORT ?? 5432);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer");
}

if (!Number.isInteger(databasePort) || databasePort <= 0) {
  throw new Error("DATABASE_PORT must be a positive integer");
}

const requiredDatabaseValues = {
  host: process.env.DATABASE_HOST,
  name: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

for (const [key, value] of Object.entries(requiredDatabaseValues)) {
  if (!value) {
    throw new Error(`DATABASE_${key.toUpperCase()} is required`);
  }
}

export const env = {
  port,
  database: {
    host: requiredDatabaseValues.host,
    port: databasePort,
    name: requiredDatabaseValues.name,
    user: requiredDatabaseValues.user,
    password: requiredDatabaseValues.password,
  },
};