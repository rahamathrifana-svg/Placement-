import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser, getUserState, saveUserState } from './src/db/users.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  // API endpoints
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const email = req.user!.email || `${uid}@user.local`;
      const name = req.user!.name || '';
      const picture = req.user!.picture || '';

      const user = await getOrCreateUser(uid, email, name, picture);
      const userStateRecord = await getUserState(uid);

      res.json({
        user,
        state: userStateRecord ? JSON.parse(userStateRecord.stateJson) : null,
        xp: userStateRecord?.xp || 0,
      });
    } catch (error: any) {
      console.error('Failed to sync auth user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync auth user' });
    }
  });

  app.get('/api/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const userStateRecord = await getUserState(uid);
      res.json({
        state: userStateRecord ? JSON.parse(userStateRecord.stateJson) : null,
        xp: userStateRecord?.xp || 0,
        updatedAt: userStateRecord?.updatedAt,
      });
    } catch (error: any) {
      console.error('Failed to fetch progress:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch progress' });
    }
  });

  app.post('/api/progress', requireAuth, async (req: AuthRequest, res) => {
    try {
      const uid = req.user!.uid;
      const { xp, state } = req.body;
      if (!state) {
        return res.status(400).json({ error: 'Missing state payload' });
      }

      const saved = await saveUserState(uid, Number(xp) || 0, JSON.stringify(state));
      res.json({ success: true, updatedAt: saved.updatedAt });
    } catch (error: any) {
      console.error('Failed to save progress:', error);
      res.status(500).json({ error: error.message || 'Failed to save progress' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Placement Quest server running on http://localhost:${PORT}`);
  });
}

startServer();
