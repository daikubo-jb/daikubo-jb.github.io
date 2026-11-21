import { defineConfig } from 'astro/config';

const path = (process.env.BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '');
if (path && !path.split('/').every(part => /^[a-zA-Z0-9._-]+$/.test(part) && part !== '.' && part !== '..')) {
  throw new Error('BASE_PATH must be a URL pathname such as /experiment-notes.');
}

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || undefined,
  base: path ? '/' + path : '/',
  trailingSlash: 'always',
});
