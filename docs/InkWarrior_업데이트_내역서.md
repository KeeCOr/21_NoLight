# InkWarrior 업데이트 내역서

## 2026-06-24 v0.3.0 전투 피드백 규칙 통합
- 공격, 회피, 피격, 경직, 패배 피드백을 `strike / evade / wound / finish` 규칙으로 정리했다.
- `ActionFeedback`에 `attack`, `dodge`, `stagger`, `defeat` 타입과 전투 스모크 시퀀스 함수를 추가했다.
- GameScene의 처치/회피/피해/공격 피드백 호출을 새 규칙 이름에 맞췄다.
- 먹 참격의 코드 타원 연출을 `impact_brush_ring` bitmap VFX로 교체했다.
- 기획서를 페르소나 없이 게임 소개, 주요 시스템, 플레이 예시 중심으로 다시 정리했다.
- 검증 예정: `npm test`, `npm run build`, `npm run build` 기반 portable 패키징.

## 2026-06-24 문서 구조 정리
- 기획서와 업데이트 내역서를 분리했다.
- 변경 이력, 구현 로그, 검증 기록은 이 문서에서 관리한다.

## v0.2.0 카메라 타격 연출
- `CameraImpactProfile` 순수 규칙 추가.
- 참격 방향 기반 카메라 follow offset 넛지 추가.
- UI 디자이너 작업 목록 문서 추가: `docs/ui-designer-camera-impact-tasks.md`.

## 기존 이력 후보
- 2026-05-18 상어 전투 시스템 조정.
- v0.1.3 전체 게임 루프, 캐릭터 교체, 무한 청크 맵, HUD, 생성 아트 에셋, Windows portable 빌드 반영.
