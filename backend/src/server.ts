import { app } from './app.js';
import { env } from './config/env.js';
import { runMigrations } from './db/migrations.js';

runMigrations()
	.then(() => {
		app.listen(env.port, () => {
			console.log(`DevMind backend running on port ${env.port}`);
		});
	})
	.catch((error) => {
		console.error("Failed to run database migrations", error);
		process.exitCode = 1;
	});
