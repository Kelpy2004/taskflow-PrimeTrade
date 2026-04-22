import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { swaggerSpec } from './docs/swagger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

export const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistDir = path.resolve(__dirname, '../../dist');
const frontendIndexFile = path.join(frontendDistDir, 'index.html');
const hasFrontendBuild = fs.existsSync(frontendIndexFile);

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    // Lightweight request logging for local dev/recruiter review.
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

app.get('/api', (_req, res) => {
  res.json({
    message: 'TaskForge API is running.',
    health: '/health',
    docs: '/api-docs',
    version: '/api/v1',
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

if (hasFrontendBuild) {
  app.use(express.static(frontendDistDir));
  app.get(/^(?!\/api(?:\/|$)|\/api-docs(?:\/|$)|\/health$).*/, (_req, res) => {
    res.sendFile(frontendIndexFile);
  });
}

app.use(notFound);
app.use(errorHandler);
