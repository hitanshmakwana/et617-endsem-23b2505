import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function apiDevMiddlewarePlugin() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url ? req.url.split('?')[0] : '';
        if (req.method === 'POST' && (urlPath === '/api/grade' || urlPath === '/api/generate')) {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              req.body = JSON.parse(body || '{}');
            } catch (e) {
              req.body = {};
            }

            const mockRes = {
              statusCode: 200,
              status(code) {
                this.statusCode = code;
                return this;
              },
              json(data) {
                res.statusCode = this.statusCode || 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              }
            };

            try {
              if (urlPath === '/api/grade') {
                const { default: handler } = await import('./api/grade.js');
                await handler(req, mockRes);
                return;
              } else if (urlPath === '/api/generate') {
                const { default: handler } = await import('./api/generate.js');
                await handler(req, mockRes);
                return;
              }
            } catch (err) {
              mockRes.status(200).json({ ok: false });
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }

  return {
    plugins: [react(), apiDevMiddlewarePlugin()],
  };
});
