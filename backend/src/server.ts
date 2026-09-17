import { app } from './app.js';
import { env } from './config/env.js';
import { runMigrations } from './db/migrations.js';

import { checkDatabaseConnection } from './db/database.js';

const startServer = async (): Promise<void> => {
	try {
		await checkDatabaseConnection();
		await runMigrations();

		app.listen(env.port, () => {
			console.log(`DevMind backend running on port ${env.port}`);
			console.log("PostgreSQL connection established");
		});
	} catch (error) {
		console.error("Failed to connect to PostgreSQL:", error);
		process.exit(1);
	}
};

void startServer();
