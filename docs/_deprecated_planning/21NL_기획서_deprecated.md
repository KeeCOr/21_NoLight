# InkWarrior 기획서

문제 정의: 액션 플레이어가 타격감뿐 아니라 수묵풍 연출과 명확한 위험 신호를 함께 원한다.

## 게임 소개
먹과 검의 리듬을 살린 액션 전투 게임.

InkWarrior의 핵심 매력은 한 번의 선택이 다음 장면의 위험도, 보상, 성장 방향으로 이어지는 구조다. 이 문서는 처음 보는 사람에게 게임의 재미와 현재 방향을 빠르게 소개하기 위한 단일 기획서이며, 세부 변경 이력은 별도 업데이트 내역서에서 관리한다.

## 한 줄 소개
먹과 검의 리듬을 살린 액션 전투 게임.

## 핵심 루프
유저가 현재 전장의 정보를 읽고 선택을 하면 전투/운영 결과가 갱신되고, 그 보상과 손실 때문에 다시 다음 선택을 준비한다.

## 게임 플레이 예시
- 1단계: 플레이어가 InkWarrior의 현재 목표, 보유 자원, 즉시 대응해야 할 위험을 확인한다.
- 2단계: 카드, 유닛, 배치, 명령, 이동 중 현재 상황에 맞는 핵심 행동을 선택한다.
- 3단계: 선택 결과가 전투, 운영, 보상, 손실로 즉시 갱신되고 다음 판단의 근거가 된다.
- 4단계: 획득한 보상이나 변화한 상태를 바탕으로 다음 선택을 준비하며 핵심 루프를 반복한다.
- 플레이 감각: 짧은 세션 안에서 상황 파악, 의미 있는 선택, 즉각적인 피드백, 다음 목표 제시가 끊기지 않는 흐름을 지향한다.

## 핵심 재미
- 읽기 쉬운 상황 판단: 지금 위험한 요소와 얻을 수 있는 보상이 한눈에 들어온다.
- 직접적인 선택 피드백: 선택 직후 전투, 점수, 자원, 성장 상태가 변해 손맛을 만든다.
- 누적되는 성장감: 반복 플레이가 단순 재시작이 아니라 다음 전략의 재료로 이어진다.

## 주요 시스템
- 핵심 선택 시스템: 현재 국면에서 가능한 행동을 5개 이하의 명확한 선택지로 제시한다.
- 위험/보상 피드백: 행동 전후의 이득, 손실, 위협 변화를 빠르게 보여준다.
- 성장과 해금: 세션 결과가 능력, 카드, 유닛, 건물, 장비, 스테이지 등 다음 플레이의 선택지를 넓힌다.
- 상태별 UX: 로딩, 빈 상태, 오류, 많은 데이터, 긴 텍스트 상황에서도 레이아웃이 무너지지 않도록 관리한다.
- 실행 안정성: 테스트와 빌드 산출물을 기준으로 현재 플레이 가능한 범위를 계속 확인한다.

## 게임 구성과 규칙 (GDD 통합)
- 통합 기준 문서: `superpowers/specs/2026-05-14-action-platformer-design.md`, `superpowers/specs/2026-05-18-shark-scale-combat-design.md`
- 작성 기준: 16_PokerStrike_GDD처럼 화면 구조, 핵심 시스템, 진행/승패 규칙, UI/HUD, 미결 항목을 한 문서에서 바로 읽을 수 있게 정리한다.

### 화면/플레이 구조
- **1. 게임 개요** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - 동양 수묵화 배경에 메카닉 요소가 혼합된 캐릭터가 등장하는 2D 액션 플랫포머.
  - 플레이어는 2명(이후 확장 가능)의 캐릭터를 실시간으로 교체하며 전투하고, 강력한 추격자를 피해 무한 생성 맵을 이동한다.
  - 명확한 엔딩 없이 최대한 오래 생존하며 점수를 쌓는 방식이다.
- **2-2. 캐릭터 교체** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - `Tab` 또는 `Shift`로 즉시 교체
  - 교체 순간 `onSwapIn()` 특수 효과 발동
  - HP 공유, 스태미나 공유
  - 캐릭터 풀 구조로 3번째 캐릭터 추가 시 코드 변경 최소화
- **3. 전체 아키텍처** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - └── BrowserWindow
  - └── Phaser.js Game
  - │ ├── BootScene — 에셋 로딩
  - │ ├── MainMenuScene — 타이틀 화면
  - │ ├── GameScene — 메인 게임플레이
  - │ └── GameOverScene — 점수 표시
  - │ ├── MapGenerator — 무한 청크 생성/제거

### 핵심 시스템
- **2-1. 저체력 강화 (Risk & Reward)** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - 적을 처치하지 않으면 HP가 지속적으로 감소한다
  - HP가 낮을수록 공격력/스킬 위력이 증가한다
  - HP가 낮을수록 스태미나 자동 충전 속도가 빨라진다
  - HP는 두 캐릭터가 공유한다
- **2-3. 스태미나** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - 시간당 자동 충전 (저체력 시 충전 속도 가속)
  - 메카 팔 캐릭터 가드 피격 시 추가 충전
  - 가드 유지 중 소모
  - 스킬 발동 시 소모
- **공통 베이스** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - BaseCharacter
  - ├── stats: { hp(공유), atk, speed, stamina(공유) }
  - ├── attack() — 기본 공격
  - ├── skill() — 고유 스킬 (스태미나 소모)
  - ├── guard() — 가드 (캐릭터별 효과, 스태미나 소모)
  - ├── parry() — 피격 직전 가드 시 공통 발동
  - │ → 투사체 반사 + 적 공격 캔슬
  - └── onSwapIn() — 교체 진입 시 특수 효과
- **7. 스탯 시스템** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - │ ├── 적 미처치 시 지속 감소
  - │ ├── 낮을수록 공격력/스킬 강화
  - │ └── 낮을수록 스태미나 충전 속도 증가
  - ├── 시간당 자동 충전 (저체력 시 가속)
  - ├── 메카 팔 가드 피격 시 추가 충전
  - ├── 가드 유지 중 소모
  - └── 스킬 발동 시 소모
  - 점수 = 생존 시간 + 처치 적 수 기반

### 진행/승패 규칙
- **패링** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - 가드 입력 후 약 6~10프레임(100ms 내외, 구현 시 조정) 이내 피격 시 패링 판정
  - 투사체 반사, 적 공격 캔슬
  - 두 캐릭터 공통 적용
- **수묵화 스타일** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - **배경**: 먹물 번짐 느낌의 레이어드 배경 (원경/근경 패럴랙스)
  - **캐릭터/적**: 수묵화 풍 스프라이트 + 메카 부품은 금속 질감 대비
  - **이펙트**: 전기 공격은 먹물이 튀는 느낌, 메카 팔은 충격파 선화
  - **UI**: 붓글씨 느낌의 폰트, 한지 질감 HUD
- **HUD 구성** (superpowers/specs/2026-05-14-action-platformer-design.md)
  - HP 바 (좌측 상단)
  - 스태미나 바 (HP 바 하단)
  - 현재/대기 캐릭터 아이콘 (우측 하단)
  - 생존 시간 + 점수 (상단 중앙)

### UI/HUD/피드백
- **9. 기술 스택** (superpowers/specs/2026-05-14-action-platformer-design.md)
| 구분 | 기술 |
|------|------|
| 런타임 | Electron |
| 게임 엔진 | Phaser.js |
| 언어 | JavaScript / TypeScript |
| 빌드 | electron-builder |

### 구현 메모/미결
- **보강 필요** (기획서)
  - 별도 GDD 또는 디자인 스펙이 없으므로, 다음 문서 갱신 시 세부 규칙과 수치표를 추가해야 한다.

## MVP 가설
| 기능 | 검증할 가설 | 검증 방법 |
|------|-------------|-----------|
| 핵심 전투/운영 루프 | 플레이어는 한 판 안에서 선택 결과를 이해하면 다음 판을 자발적으로 시작한다. | 1회 플레이 후 재시작률 60% 이상 |
| 위험/보상 표시 | 위험과 보상이 동시에 보이면 선택 시간이 줄고 납득도가 오른다. | 주요 선택 평균 8초 이내, 결과 불만 피드백 20% 이하 |
| 성장 보상 | 보상이 다음 전략을 바꾸면 반복 플레이 피로가 낮아진다. | 3판 내 서로 다른 빌드 선택률 50% 이상 |

## 레퍼런스 분석
- 장르 기준 레퍼런스는 한 판 시작까지 3단계 이내, 첫 의미 있는 선택까지 30초 이내가 목표다.
- 적용 교훈: 규칙 설명보다 먼저 선택 가능한 상황을 보여주고, 결과 화면에서 다음 판의 개선 포인트를 바로 제안한다.

## 현재 개발 상태 예상 수치
- 완성 목표 대비 구현 체감도: 약 50%
- 첫 세션에서 핵심 루프가 전달될 가능성: 약 56%
- UI/리소스 일관성 체감: 약 60%
- 콘텐츠와 반복 플레이 분량 충족도: 약 46%
- 빌드/실행 안정성 기대치: 약 60%
- 해석 기준: 현재 문서, 최근 산출물 기록, 연결된 예시 이미지 유무를 기준으로 한 사전 추정치이며 실제 플레이 테스트 후 ±15%p 정도 보정이 필요하다.

- 첫 세션 평균 플레이 시간 8분 이상
- 첫 세션 내 2회차 진입률 55% 이상
- 핵심 선택 화면에서 무응답/이탈률 15% 이하

## 현재 구현 상태
- 이 문서는 2026-06-24 기준으로 현재 플레이 방향과 구현 체감 상태를 요약한다.
- 핵심 루프, 조작 원칙, 리소스 적용 현황, 빌드 기준은 프로젝트별 실제 구현과 산출물 기록을 기준으로 계속 보정한다.
- 세부 변경 이력은 별도 업데이트 내역서에서 관리하고, 본 기획서는 처음 보는 사람이 현재 방향을 빠르게 이해하는 공유 문서로 유지한다.
- 새 기능, 밸런스 변경, 리소스 교체, UX 개선이 들어가면 본문과 HTML 문서를 함께 갱신한다.

## 조작과 UX 원칙
- 주요 버튼은 44px 이상으로 유지하고, 화면당 CTA 강조색은 하나만 사용한다.
- 버튼/선택지는 한 번에 5개 이하로 노출해 판단 부담을 줄인다.
- 로딩, 빈 상태, 에러, 많은 데이터, 긴 텍스트 상태를 각각 별도 화면/컴포넌트로 확인한다.
- HUD 동일 레이어 요소는 겹치지 않게 배치하고, 겹침이 필요한 효과는 별도 depth/z-order를 쓴다.

## 적용 리소스
- 런타임에 쓰이는 대표 이미지와 UI 리소스는 프로젝트별 asset/public/Resources 경로를 기준으로 관리한다.
- 새 이미지가 필요할 때는 프로젝트 접두어를 포함한 lowercase kebab-case 파일명을 사용한다.
- 최종 런타임 비주얼은 PNG/WebP 등 비트맵 자산을 우선 사용하고, SVG 또는 코드 드로잉은 문서/임시 참조로만 남긴다.

## 공유용 이미지 미리보기
![InkWarrior 공유용 예시 1](21NL_gameplay_preview.png)

![InkWarrior 공유용 예시 2](InkWarrior_01_플레이예시.png)

**캐릭터**
- assets/generated/electric-char.png
- assets/generated/absorber-char.png
- assets/generated/mecha-char.png
- assets/generated/enemy.png
- assets/generated/pursuer.png

**배경/지형**
- assets/generated/platform.png
- assets/generated/bg-mountain.png
- assets/generated/bg_far.png
- assets/generated/bg_mid.png
- assets/generated/bg_fog.png
- assets/generated/bg_scanline.png
- assets/generated/ink-wall.png
- assets/generated/projectile.png

**전투 FX**
- assets/generated/brush-slash.png
- assets/generated/ink-splatter.png
- assets/generated/blood-ink.png
- assets/generated/impact-ink-burst.png
- assets/generated/impact-brush-ring.png
- assets/generated/combo-brush-smear.png
- assets/generated/heavy-hit-flash.png
- assets/generated/spark.png

**상태 FX**
- assets/generated/light-shard-top.png
- assets/generated/light-shard-bottom.png
- assets/generated/absorb-trail.png
- assets/generated/absorb-aura.png
- assets/generated/life-orb.png
- assets/generated/smoke-wisp.png

**UI/HUD**
- assets/generated/ui-hp-frame.png
- assets/generated/ui-stamina-frame.png
- assets/generated/ui-score-frame.png
- assets/generated/ui-portrait-frame.png
- assets/generated/ui-button-frame.png
- assets/generated/ui-skill-frame.png
- assets/generated/ui-gold-corner-large.png
- assets/generated/ui-gold-corner.png
- assets/generated/ui-medallion.png

**HUD 패널**
- assets/generated/hud_logo_panel.png
- assets/generated/hud_brush_bar.png
- assets/generated/hud_score_box.png
- assets/generated/hud_joystick_ring.png
- assets/generated/hud_skill_button.png
- assets/generated/hud_item_slot.png

**초상화**
- assets/generated/portrait_electric.png
- assets/generated/portrait_mecha.png

## 빌드, 테스트, 릴리스
- npm test
- npm run build
- 현재 문서 기준 버전: 0.2.0

## 남은 리스크와 다음 우선순위
- 첫 화면에서 게임의 목표와 다음 행동이 5초 안에 보이는지 확인한다.
- 주요 선택의 결과 예측과 실제 결과가 어긋나는 지점을 플레이 테스트로 수집한다.
- 기획서에 남아 있던 변경 이력성 내용은 업데이트 내역서로 계속 이동해 소개 문서의 밀도를 유지한다.


## v0.2.0 카메라 타격 연출

- CameraImpactProfile 순수 규칙을 추가해 기본 히트, 콤보, 처치, 스킬, 추격자 러시의 카메라 흔들림/줌/플래시/방향 넛지를 분리했다.
- 참격 방향을 카메라 follow offset에 반영해 붓 획이 밀고 나가는 방향으로 짧게 눌렸다가 복귀하도록 했다.
- UI 디자이너 후속 작업 목록을 `docs/ui-designer-camera-impact-tasks.md`에 정리했다.
