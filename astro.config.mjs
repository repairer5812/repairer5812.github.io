import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// repairer5812.github.io is a GitHub *user* pages site → served at domain root, base '/'.
export default defineConfig({
  site: 'https://repairer5812.github.io',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // 메뉴 이름을 '수업'에서 '공부'로 바꿨다(2026-10-14). 이미 퍼진 /수업 주소는 새 주소로 넘긴다.
  redirects: {
    '/수업': '/공부',
    '/수업/[course]': '/공부/[course]',
    '/수업/[course]/[note]': '/공부/[course]/[note]',
  },
  markdown: {
    // 수업 노트의 수식은 빌드 시점에 KaTeX로 렌더한다(클라이언트 JS 불필요).
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { strict: false, throwOnError: false }]],
  },
});
