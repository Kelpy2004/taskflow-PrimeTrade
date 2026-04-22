import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { app } from './app.js';
import { bootstrapDemoData } from './utils/bootstrapDemoData.js';

async function startServer() {
  await connectDatabase();
  await bootstrapDemoData();

  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
