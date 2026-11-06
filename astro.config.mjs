import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jesslyn-ctrl.github.io',
  // Matches the GitHub repo name: Pages serves the site at /<repo>/.
  base: '/portfolio',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
