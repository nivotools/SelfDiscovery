import { defineConfig, loadEnv } from 'vite';

// Serves /api/generate-blueprints during `npm run dev` using the same
// handler that Vercel deploys as a serverless function — no second server.
export default defineConfig(({ mode }) => {
  // Make GEMINI_API_KEY and RESEND_API_KEY from .env available to the API handler in dev.
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  if (env.RESEND_API_KEY && !process.env.RESEND_API_KEY) process.env.RESEND_API_KEY = env.RESEND_API_KEY;

  return {
    plugins: [
      {
        name: 'blueprint-api-dev',
        configureServer(server) {
          server.middlewares.use('/api/generate-blueprints', async (req, res) => {
            const { default: handler } = await import('./api/generate-blueprints.js');
            await handler(req, res);
          });
        },
      },
    ],
  };
});
