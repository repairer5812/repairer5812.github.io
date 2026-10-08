import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// repairer5812.github.io is a GitHub *user* pages site → served at domain root, base '/'.
export default defineConfig({
  site: 'https://repairer5812.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  markdown: {
    // 수업 노트의 수식은 빌드 시점에 KaTeX로 렌더한다(클라이언트 JS 불필요).
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
  },
});
