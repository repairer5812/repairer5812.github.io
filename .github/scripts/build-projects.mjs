#!/usr/bin/env node
// projects.json 빌드 스크립트 (update-projects.yml 에서 호출)
//
// 입력: gh api 가 수집한 repairer5812 공개 저장소 배열 (JSON 파일)
// 출력: src/data/projects.json (index.astro 호환 스키마)
//
// 스키마: { name, url, desc, tags, featured, updated?, stars? }
//   - url 은 GitHub Pages 절대 주소: https://repairer5812.github.io/{repo}/
//   - desc / tags / name / featured 는 쇼케이스 저장소에 대해 큐레이션 메타로 덮어쓴다
//     (GitHub description 은 짧고 영어라 랜딩 톤과 맞지 않으므로 보조로만 사용)
//   - updated(pushed_at) / stars 는 항상 GitHub 실데이터에서 가져온다
//
// 공개 배포 정책: 회사(테크빌) 비노출, 학업 소속만. 본문에 소속을 쓰지 않으므로 영향 없음.

import { readFileSync, writeFileSync } from 'node:fs';

const [, , reposPath, outPath] = process.argv;
if (!reposPath || !outPath) {
  console.error('usage: build-projects.mjs <repos.json> <out.json>');
  process.exit(1);
}

const repos = JSON.parse(readFileSync(reposPath, 'utf8'));

// ─── 쇼케이스 큐레이션 메타 ──────────────────────────────────────────────
// 키 = GitHub 저장소 이름(repo). order 로 표시 순서를 고정한다.
// featured: true 인 항목은 index.astro 가 대형 카드로 렌더한다(정확히 1개 권장).
const CURATED = {
  'thesis-research': {
    order: 1,
    name: 'Thesis Research Intelligence',
    desc: '국내 <b>16개 AI 대학원</b> 석사논문 <b>2,906건</b>을 통합 분석. 학회 게재(NeurIPS, ICML, ICLR, ACL, CVPR), 인용수, 코드 공개를 검증해 <b>192편</b>에 객관 점수를 부여하고, 학교별·일반/특수대학원·분야별 필터로 졸업논문 주제 결정에 활용합니다.',
    tags: ['Vanilla JS', 'Chart.js', 'GitHub Pages'],
    featured: true,
  },
  'ai-study-hub': {
    order: 2,
    name: 'AI Study Hub',
    desc: 'AI 대학원 과목별 복습 노트와 모의고사를 한곳에 모은 학습 허브. <b>기계학습, 딥러닝, 자료구조, 인공지능 보안기술</b> 4과목, 총 <b>270문항 이상</b>. 객관식·서술형이 섞이며, 서술형은 LLM(Upstage Solar) 채점 백엔드(Cloudflare Worker)로 자동 평가하고 실시간 랭킹을 제공합니다.',
    tags: ['4과목 ml·dl·ds·sec', 'LLM 자동채점', '실시간 랭킹', 'Cloudflare Worker', 'Upstage Solar'],
    featured: false,
  },
  'linear-algebra-for-ai': {
    order: 3,
    name: '인공지능 전공자를 위한 선형대수학',
    desc: 'AI 대학원생 대상 <b>25회차(Part 1, Part 2)</b> 선형대수 강좌의 안내·진단 사이트. Strang 교재 기준 <b>순수 LA 6축 진단 테스트(객관식 20문항)</b>를 본 뒤 육각형 레이더 차트로 본인 역량을 확인합니다.',
    tags: ['25회차', '6축 진단', '20문항', '레이더 차트'],
    featured: false,
  },
};

// 토픽/큐레이션 외 자동 편입 기준: 아래 토픽이 달린 공개 저장소도 쇼케이스로 포함한다.
const SHOWCASE_TOPICS = new Set(['showcase', 'portfolio', 'site-showcase']);

// HTML 메타 텍스트 이스케이프(큐레이션 desc 는 의도된 <b> 를 쓰므로 그대로,
// GitHub description 폴백만 이스케이프해 set:html 주입 안전성 확보).
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function repoToProject(repo) {
  const curated = CURATED[repo.name];
  const base = {
    url: `https://repairer5812.github.io/${repo.name}/`,
    updated: repo.pushedAt || null,
    stars: typeof repo.stargazers === 'number' ? repo.stargazers : 0,
  };

  if (curated) {
    return {
      _order: curated.order,
      name: curated.name,
      url: base.url,
      desc: curated.desc,
      tags: curated.tags,
      featured: !!curated.featured,
      updated: base.updated,
      stars: base.stars,
    };
  }

  // 토픽 기반 자동 편입 저장소 — GitHub 메타로 최소 카드 구성.
  return {
    _order: 100, // 큐레이션 뒤로
    name: repo.name,
    url: base.url,
    desc: repo.description ? escapeHtml(repo.description) : '',
    tags: (repo.topics || []).slice(0, 5),
    featured: false,
    updated: base.updated,
    stars: base.stars,
  };
}

const selected = repos.filter((r) => {
  if (CURATED[r.name]) return true;
  const topics = new Set(r.topics || []);
  for (const t of SHOWCASE_TOPICS) if (topics.has(t)) return true;
  return false;
});

const projects = selected
  .map(repoToProject)
  .sort((a, b) => (a._order - b._order) || a.name.localeCompare(b.name))
  .map(({ _order, ...p }) => p);

// featured 가 정확히 1개가 되도록 보정(없으면 첫 항목을 featured 로).
if (projects.length && !projects.some((p) => p.featured)) {
  projects[0].featured = true;
}

writeFileSync(outPath, JSON.stringify(projects, null, 2) + '\n', 'utf8');
console.log(`Wrote ${projects.length} projects to ${outPath}`);
