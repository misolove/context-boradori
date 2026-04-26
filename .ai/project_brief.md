# Project Brief

## Name

context-boradori

## Korean name

맥락 보라돌이

## English codename

Context Boradori / Context Bori

## One-liner

맥락 보라돌이는 ChatGPT, Claude, Codex, Gemini 등 여러 AI 도구의 작업 맥락을 붙여넣으면 자동으로 정리, 압축, 연결해서 다음 AI가 이어받을 수 있게 해주는 개인 AI 컨텍스트 허브다.

## Target user

AI 도구를 여러 개 쓰면서 하나의 프로젝트를 계속 고도화하고 싶은 개인 개발자, 기획자, 투자자, 솔로프리너.

## Problem

여러 AI 도구를 함께 쓰면 각 도구마다 대화 맥락과 작업 이력이 흩어진다. 그래서 다음 AI에게 같은 설명을 반복해야 하고, 결정사항과 다음 액션이 쉽게 유실된다.

## Solution

사용자가 각 AI 도구의 작업 맥락을 붙여넣으면, 맥락 보라돌이가 이를 정리, 압축, 구조화한다. 여러 도구에서 나온 맥락 조각은 하나의 공통 프로젝트 기억으로 병합한 뒤, 다음 AI 도구가 바로 이어받을 수 있는 handoff와 agent instruction 파일로 변환한다.

## MVP

- Paste raw context
- Select source AI tool
- Compress context locally with mock logic
- Add multiple compressed context pieces to a common context tray
- Select target AI tool
- Merge multiple tool sessions into one common handoff
- Show a visual common-context map with a north star so future tool work stays aligned
- Extract decisions, open questions, next actions
- Generate handoff.md
- Generate AGENTS.md / CLAUDE.md / GEMINI.md exports
- Copy or download results

## Non-goals for MVP

- No login
- No paid database
- No automatic GitHub commit
- No vector DB
- No full autonomous agent loop
- No real LLM API dependency in the first version
