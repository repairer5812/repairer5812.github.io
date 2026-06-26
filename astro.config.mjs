import { defineConfig } from 'astro/config';

// repairer5812.github.io is a GitHub *user* pages site → served at domain root, base '/'.
export default defineConfig({
  site: 'https://repairer5812.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
