import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type {IncomingMessage} from 'http';
import {defineConfig, loadEnv} from 'vite';

/** Origin only, for `server.proxy.target` (path `/api/v1` is preserved on the request). */
function apiProxyTarget(viteApiUrl: string | undefined): string {
  const raw = viteApiUrl?.trim() || 'https://finask.onrender.com/api/v1';
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    return new URL(withScheme).origin;
  } catch {
    return 'https://finask.onrender.com';
  }
}

function rewriteSetCookieForLocalhost(proxyRes: IncomingMessage) {
  const raw = proxyRes.headers['set-cookie'];
  if (!raw) return;
  const list = Array.isArray(raw) ? raw : [raw];
  proxyRes.headers['set-cookie'] = list.map((cookie) =>
    cookie
      .replace(/; Domain=[^;]*/gi, '')
      .replace(/; Secure/gi, '')
      .replace(/; SameSite=None/gi, '; SameSite=Lax')
  );
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const proxyTarget = apiProxyTarget(env.VITE_API_URL);

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/v1': {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
          cookieDomainRewrite: '',
          configure(proxy) {
            proxy.on('proxyRes', (proxyRes: IncomingMessage) => {
              rewriteSetCookieForLocalhost(proxyRes);
            });
          },
        },
      },
    },
  };
});
