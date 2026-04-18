# 온종일 (OnJongIl) — 랜딩페이지

> 사장님의 온라인을 온종일 챙겨드립니다 🌙

## 📁 파일 구조

```
onjongil/
├── index.html          ← 메인 HTML (마크업 전용)
├── css/
│   └── style.css       ← 전체 스타일 (테마 변수, 레이아웃, 애니메이션)
├── js/
│   ├── portfolio.js    ← 포트폴리오 CRUD + 렌더링
│   ├── admin.js        ← 관리자 모드 + 비밀번호 관리
│   └── main.js         ← 별/구름 생성, 테마, 스크롤, 카운트업 등
└── README.md
```

## ✨ 주요 기능

- **낮/밤 테마 토글** — CSS 변수 기반, localStorage 저장
- **포트폴리오 관리** — 관리자 모드에서 추가 / 수정 / 삭제 (최대 20개)
- **관리자 인증** — 비밀번호 모달, 변경 기능 (localStorage 저장)
- **애니메이션 캐릭터** — SVG 인라인 애니메이션 (깜빡임, 타이핑, 커피 김)
- **반응형** — 모바일 900px 이하 대응

## 🚀 GitHub Pages 배포

1. 이 저장소를 GitHub에 push
2. Settings → Pages → Source: `main` 브랜치 `/` (root)
3. `https://<username>.github.io/<repo>/` 로 접속

## ⚙️ 커스터마이징

| 항목 | 위치 |
|------|------|
| 이메일 주소 | `index.html` → contact 섹션 href |
| 기본 관리자 비번 | `js/admin.js` → `DEFAULT_PW` |
| 기본 포트폴리오 | `js/portfolio.js` → `defaultPortfolio` 배열 |
| 브랜드 색상 | `css/style.css` → `:root[data-theme]` 변수 |

## 📝 라이선스

© 2026 OnJongIl Studio. All rights reserved.
