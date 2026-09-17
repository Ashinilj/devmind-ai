import app from "./app.js";
import { env } from './config/env.js';
import { checkDatabaseConnection } from './db/database.js';
import { runMigrations } from './db/migrations.js';

const startServer = async (): Promise<void> => {
	try {
		await checkDatabaseConnection();

		await runMigrations();

		app.listen(env.port, () => {
			console.log(`DevMind backend running on port ${env.port}`);
			console.log("PostgreSQL connection established");
			console.log("Database migrations completed");
		});
	} catch (error) {
		console.error("Failed to start DevMind backend:", error);
		process.exit(1);
	}
};

void startServer();
