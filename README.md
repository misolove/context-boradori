# 맥락 보라돌이

[한국어](./README.md) | [English](./README.en.md)

**맥락 보라돌이**는 ChatGPT, Claude, Codex, Gemini처럼 여러 AI 도구를 오가며 일하는 사람을 위한 개인 AI 컨텍스트 허브입니다.

흩어진 AI 작업 맥락을 붙여넣으면, 다음 AI가 바로 이어받을 수 있도록 세션 요약, 결정사항, 열린 질문, 다음 액션, handoff markdown, agent instruction 파일로 정리합니다.

## 데모

- Live demo: [https://context-boradori.vercel.app](https://context-boradori.vercel.app)
- English view: [https://context-boradori.vercel.app/?lang=en](https://context-boradori.vercel.app/?lang=en)

## 문제

여러 AI 도구를 함께 쓰면 각 도구마다 대화 맥락과 작업 이력이 흩어집니다. 그래서 다음 AI에게 같은 설명을 반복해야 하고, 결정사항과 다음 액션이 쉽게 유실됩니다.

맥락 보라돌이는 이 흩어진 작업 맥락을 하나의 공통 프로젝트 기억으로 모으고, 다음 AI 도구가 같은 방향으로 이어받도록 돕습니다.

## 해결 방식

사용자는 ChatGPT, Claude, Codex, Gemini 등의 작업 맥락을 붙여넣습니다. 앱은 브라우저 안에서 로컬 mock compression을 실행해 맥락을 정리하고, 여러 도구의 결과를 공통맥락으로 병합합니다.

핵심은 단순 요약이 아니라 **북극성**입니다. 확정된 결정, 열린 질문, 다음 액션을 하나의 공통 방향으로 묶어 어떤 AI 도구에서 이어서 진행하더라도 같은 목표를 향하도록 합니다.

## MVP 기능

- 프로젝트 이름 입력
- 출처 AI 도구 선택
- 대상 AI 도구 선택
- Raw context 붙여넣기
- 외부 AI API 없는 로컬 mock compression
- 여러 AI 도구 맥락을 담는 공통맥락 수집함
- 여러 맥락 조각을 하나의 공통 handoff로 병합
- 북극성 기반 공통맥락 지도
- 편집 가능한 프로젝트 북극성
- 한국어/영어 UI 토글
- 브라우저 `localStorage` 기반 데모 지속성
- 세션 요약, 결정사항, 제안, 열린 질문, 다음 액션 추출
- `handoff.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` export
- 복사 버튼과 markdown 다운로드
- 공개 repo 안전 경고
- 기본 API key/token 패턴 redaction

## 사용 흐름

1. 프로젝트 이름과 출처 AI 도구를 선택합니다.
2. 해당 도구에서 진행한 raw context를 붙여넣습니다.
3. `공통맥락에 추가`로 여러 AI 도구의 맥락을 수집합니다.
4. 프로젝트 북극성을 확인하거나 수정합니다.
5. 대상 AI 도구를 선택하고 `공통맥락 병합`을 누릅니다.
6. 공통맥락 지도와 handoff export를 확인합니다.
7. 다음 AI 도구에 맞게 복사하거나 markdown 파일로 다운로드합니다.

## 브랜드

맥락 보라돌이는 귀엽지만 똑똑한 AI context librarian입니다. 브랜드 키워드는 **모은다, 이해한다, 압축한다, 연결한다**입니다.

![맥락 보라돌이 brand identity](./public/brand/boradori-brand-identity.png)

![맥락 보라돌이 concept board](./public/brand/boradori-concept-board.png)

## 보안 메모

API 키, 비밀번호, 토큰, private URL, 개인 금융정보는 붙여넣지 마세요.

현재 MVP는 외부 AI API를 호출하지 않고, raw context를 서버로 보내지 않습니다. 공통맥락 수집함은 데모 연속성을 위해 현재 브라우저에만 저장됩니다. 향후 실제 AI API를 붙일 경우 더 강한 redaction과 명시적 사용자 동의가 필요합니다.

## 로컬 개발

```bash
npm install
npm run dev
```

Open:

[http://localhost:3000](http://localhost:3000)

Useful checks:

```bash
npm run lint
npm run build
npm audit --omit=dev
```

## 프로젝트 메모리

공식 프로젝트 메모리는 `.ai/` 디렉터리에 둡니다.

- `.ai/project_brief.md`
- `.ai/current_state.md`
- `.ai/next_actions.md`
- `.ai/decisions/`
- `.ai/handoffs/`

## 로드맵

- 샘플 맥락, 병합, 복사, 다운로드에 대한 브라우저 클릭 QA
- README용 product-flow 스크린샷 추가
- AI 도구 간 제안 충돌 감지
- IndexedDB 기반 로컬 저장
- 더 강한 secret redaction
- Vercel AI SDK 기반 실제 압축 route
- Streaming result UI
- GitHub PR/export workflow
- MCP 또는 CLI 기반 agent handoff 연동

## 라이선스

MIT License. See [`LICENSE`](./LICENSE).
