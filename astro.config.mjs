import { defineConfig } from 'astro/config';

// Hosted on GitHub Pages from the "static" repository:
//   https://chanuth412-pixel.github.io/static/
// If you rename the repository to "chanuth412-pixel.github.io", the site moves to
// https://chanuth412-pixel.github.io/ — then delete the `base` line below.
export default defineConfig({
  site: 'https://chanuth412-pixel.github.io',
  base: '/static/',
});
