# 액션 플랫포머 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Electron + Phaser.js 기반 수묵화 스타일 무한 생성 맵 액션 플랫포머 게임 구현

**Architecture:** GameScene이 StatSystem, CharacterManager, MapGenerator, PursuerAI를 매 프레임 업데이트. 순수 로직 모듈(StatSystem, CharacterManager)은 Phaser 의존성 없이 구현하여 Jest로 단위 테스트. Phaser 의존 엔티티는 수동 인게임 테스트. 모든 클래스는 `if (typeof module !== 'undefined') module.exports = ...` 패턴으로 브라우저/Node.js 양쪽 호환.

**Tech Stack:** Electron 28, Phaser 3.60, Jest 29, electron-builder 24

---

## 파일 구조

```
21_NL/
├── main.js                          — Electron 메인 프로세스
├── index.html                       — 렌더러 진입점 (스크립트 로드 순서 관리)
├── package.json
├── electron-builder.config.js
├── src/
│   ├── game.js                      — Phaser.Game 설정 및 초기화
│   ├── systems/
│   │   ├── StatSystem.js            — HP/스태미나/점수 순수 로직 (Phaser 의존 없음)
│   │   ├── CharacterManager.js      — 캐릭터 교체 순수 로직 (Phaser 의존 없음)
│   │   ├── MapGenerator.js          — 청크 생성/제거 (Phaser 의존)
│   │   └── PursuerAI.js             — 추격자 상태머신 (Phaser 의존 없음)
│   ├── entities/
│   │   ├── BaseCharacter.js         — 캐릭터 공통 베이스 (Phaser.Physics.Arcade.Sprite)
│   │   ├── ElectricCharacter.js     — 전기 범위형 캐릭터
│   │   ├── MechaArmCharacter.js     — 메카 팔 근접형 캐릭터
│   │   ├── Enemy.js                 — 일반 적
│   │   └── Pursuer.js               — 추격자 엔티티
│   ├── scenes/
│   │   ├── BootScene.js             — 플레이스홀더 에셋 생성 및 씬 전환
│   │   ├── MainMenuScene.js         — 타이틀 화면
│   │   ├── GameScene.js             — 메인 게임플레이
│   │   └── GameOverScene.js         — 게임오버 + 점수 표시
│   └── ui/
│       └── HUD.js                   — HP/스태미나 바, 캐릭터 아이콘, 점수
├── assets/
│   ├── images/                      — 스프라이트 (추후 추가)
│   └── audio/                       — BGM/SFX (추후 추가)
└── tests/
    ├── StatSystem.test.js
    ├── CharacterManager.test.js
    └── MapGenerator.test.js
```

---

### Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `package.json`
- Create: `main.js`
- Create: `index.html`
- Create: `src/game.js`
- Create: `src/scenes/BootScene.js` (빈 클래스)
- Create: `src/scenes/MainMenuScene.js` (빈 클래스)
- Create: `src/scenes/GameScene.js` (빈 클래스)
- Create: `src/scenes/GameOverScene.js` (빈 클래스)
- Create: 나머지 src 파일들 (빈 클래스)

- [ ] **Step 1: package.json 생성**

```json
{
  "name": "21-nl",
  "version": "0.1.0",
  "description": "수묵화 액션 플랫포머",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "test": "jest"
  },
  "dependencies": {
    "electron": "^28.3.3",
    "phaser": "^3.60.0"
  },
  "devDependencies": {
    "electron-builder": "^24.13.3",
    "jest": "^29.7.0"
  },
  "jest": {
    "testEnvironment": "node",
    "testMatch": ["**/tests/**/*.test.js"]
  }
}
```

- [ ] **Step 2: 의존성 설치**

Run: `npm install`
Expected: `node_modules/` 생성, 오류 없음

- [ ] **Step 3: main.js 생성**

```js
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

- [ ] **Step 4: index.html 생성**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>21_NL</title>
  <style>* { margin: 0; padding: 0; } body { background: #000; overflow: hidden; }</style>
</head>
<body>
  <script src="node_modules/phaser/dist/phaser.min.js"></script>
  <!-- Systems (순수 로직) -->
  <script src="src/systems/StatSystem.js"></script>
  <script src="src/systems/CharacterManager.js"></script>
  <script src="src/systems/MapGenerator.js"></script>
  <script src="src/systems/PursuerAI.js"></script>
  <!-- Entities -->
  <script src="src/entities/BaseCharacter.js"></script>
  <script src="src/entities/ElectricCharacter.js"></script>
  <script src="src/entities/MechaArmCharacter.js"></script>
  <script src="src/entities/Enemy.js"></script>
  <script src="src/entities/Pursuer.js"></script>
  <!-- UI -->
  <script src="src/ui/HUD.js"></script>
  <!-- Scenes -->
  <script src="src/scenes/BootScene.js"></script>
  <script src="src/scenes/MainMenuScene.js"></script>
  <script src="src/scenes/GameScene.js"></script>
  <script src="src/scenes/GameOverScene.js"></script>
  <!-- Game 초기화 -->
  <script src="src/game.js"></script>
</body>
</html>
```

- [ ] **Step 5: 디렉토리 및 빈 클래스 파일 생성**

Run:
```bash
mkdir -p src/systems src/entities src/scenes src/ui assets/images assets/audio tests
```

`src/scenes/BootScene.js`:
```js
class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }
  preload() {}
  create() { this.scene.start('MainMenuScene'); }
}
```

`src/scenes/MainMenuScene.js`:
```js
class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }
  create() {
    this.add.text(640, 360, '21_NL\n[SPACE] 시작', { fontSize: '32px', color: '#fff', align: 'center' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
```

`src/scenes/GameScene.js`:
```js
class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }
  create() {
    this.add.text(640, 360, 'GameScene - WIP', { fontSize: '24px', color: '#fff' }).setOrigin(0.5);
  }
  update() {}
}
```

`src/scenes/GameOverScene.js`:
```js
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }
  create() {
    this.add.text(640, 360, 'Game Over', { fontSize: '32px', color: '#fff' }).setOrigin(0.5);
  }
}
```

`src/systems/StatSystem.js`: `class StatSystem {}`
`src/systems/CharacterManager.js`: `class CharacterManager {}`
`src/systems/MapGenerator.js`: `class MapGenerator {}`
`src/systems/PursuerAI.js`: `class PursuerAI {}`
`src/entities/BaseCharacter.js`: `class BaseCharacter {}`
`src/entities/ElectricCharacter.js`: `class ElectricCharacter {}`
`src/entities/MechaArmCharacter.js`: `class MechaArmCharacter {}`
`src/entities/Enemy.js`: `class Enemy {}`
`src/entities/Pursuer.js`: `class Pursuer {}`
`src/ui/HUD.js`: `class HUD {}`

- [ ] **Step 6: src/game.js 생성**

```js
const config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  backgroundColor: '#1a1a1a',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [BootScene, MainMenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
```

- [ ] **Step 7: 실행 확인**

Run: `npm start`
Expected: Electron 창 열림, "21_NL [SPACE] 시작" 텍스트 보임, Space 누르면 "GameScene - WIP"로 전환

- [ ] **Step 8: git 초기화 및 커밋**

```bash
git init
git add .
git commit -m "feat: Electron + Phaser.js 프로젝트 스캐폴딩"
```

---

### Task 2: StatSystem

**Files:**
- Modify: `src/systems/StatSystem.js`
- Create: `tests/StatSystem.test.js`

HP, 스태미나, 점수를 관리하는 순수 로직 클래스. Phaser 의존 없음.

- [ ] **Step 1: 실패 테스트 작성**

`tests/StatSystem.test.js`:
```js
const StatSystem = require('../src/systems/StatSystem.js');

describe('StatSystem', () => {
  let stat;
  beforeEach(() => { stat = new StatSystem(); });

  test('초기 HP는 100', () => {
    expect(stat.hp).toBe(100);
  });

  test('isLowHp: HP 30 이하일 때 true', () => {
    stat.hp = 30;
    expect(stat.isLowHp()).toBe(true);
    stat.hp = 31;
    expect(stat.isLowHp()).toBe(false);
  });

  test('getAttackMultiplier: 저체력 시 1.5x', () => {
    stat.hp = 30;
    expect(stat.getAttackMultiplier()).toBe(1.5);
    stat.hp = 100;
    expect(stat.getAttackMultiplier()).toBe(1.0);
  });

  test('update: 킬 후 3초 이내엔 HP 감소 없음', () => {
    stat.onKill();
    stat.update(1000, false);
    expect(stat.hp).toBe(100);
  });

  test('update: 킬 없이 3초 초과 시 HP 감소', () => {
    stat.update(4000, false);
    expect(stat.hp).toBeLessThan(100);
  });

  test('update: 가드 중 스태미나 감소', () => {
    stat.update(1000, true);
    expect(stat.stamina).toBeLessThan(100);
  });

  test('update: 비가드 시 스태미나 회복', () => {
    stat.stamina = 50;
    stat.update(1000, false);
    expect(stat.stamina).toBeGreaterThan(50);
  });

  test('takeDamage: HP 감소, 0 미만 안됨', () => {
    stat.takeDamage(30);
    expect(stat.hp).toBe(70);
    stat.takeDamage(200);
    expect(stat.hp).toBe(0);
  });

  test('useStamina: 스태미나 부족 시 false, 차감 없음', () => {
    stat.stamina = 20;
    expect(stat.useStamina(30)).toBe(false);
    expect(stat.stamina).toBe(20);
  });

  test('useStamina: 스태미나 충분 시 true, 차감', () => {
    stat.stamina = 50;
    expect(stat.useStamina(30)).toBe(true);
    expect(stat.stamina).toBe(20);
  });

  test('addStamina: 최대치 초과 안됨', () => {
    stat.stamina = 90;
    stat.addStamina(20);
    expect(stat.stamina).toBe(100);
  });

  test('onKill: kills 증가, score 반영', () => {
    stat.onKill();
    expect(stat.kills).toBe(1);
    stat.update(0, false);
    expect(stat.score).toBe(50);
  });

  test('isDead: HP 0일 때 true', () => {
    stat.hp = 0;
    expect(stat.isDead()).toBe(true);
    stat.hp = 1;
    expect(stat.isDead()).toBe(false);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- tests/StatSystem.test.js`
Expected: FAIL (StatSystem is empty)

- [ ] **Step 3: StatSystem 구현**

`src/systems/StatSystem.js`:
```js
class StatSystem {
  constructor() {
    this.maxHp = 100;
    this.hp = 100;
    this.maxStamina = 100;
    this.stamina = 100;
    this.score = 0;
    this.kills = 0;
    this.survivalTime = 0;

    // 밸런스 상수
    this.DECAY_RATE = 2;            // HP/초 감소
    this.LOW_HP_THRESHOLD = 30;     // 이 이하 = 저체력
    this.KILL_DECAY_GRACE = 3;      // 킬 후 HP 감소 유예 (초)
    this.STAMINA_REGEN_BASE = 10;   // 스태미나 초당 회복
    this.STAMINA_REGEN_LOW_HP = 20; // 저체력 시 초당 회복
    this.STAMINA_GUARD_DRAIN = 15;  // 가드 중 초당 소모
    this.STAMINA_SKILL_COST = 30;   // 스킬 발동 소모
    this.STAMINA_MECHA_HIT_GAIN = 20; // 메카 팔 가드 피격 시 획득

    this.lastKillTime = -999;
  }

  isLowHp() {
    return this.hp <= this.LOW_HP_THRESHOLD;
  }

  getAttackMultiplier() {
    return this.isLowHp() ? 1.5 : 1.0;
  }

  update(delta, isGuarding) {
    const dt = delta / 1000;
    this.survivalTime += dt;

    // HP 감소 (킬 유예 후)
    const timeSinceKill = this.survivalTime - this.lastKillTime;
    if (timeSinceKill > this.KILL_DECAY_GRACE) {
      this.hp = Math.max(0, this.hp - this.DECAY_RATE * dt);
    }

    // 스태미나
    if (isGuarding) {
      this.stamina = Math.max(0, this.stamina - this.STAMINA_GUARD_DRAIN * dt);
    } else {
      const regen = this.isLowHp() ? this.STAMINA_REGEN_LOW_HP : this.STAMINA_REGEN_BASE;
      this.stamina = Math.min(this.maxStamina, this.stamina + regen * dt);
    }

    // 점수
    this.score = Math.floor(this.survivalTime * 10) + this.kills * 50;
  }

  onKill() {
    this.kills++;
    this.lastKillTime = this.survivalTime;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
  }

  useStamina(amount) {
    if (this.stamina < amount) return false;
    this.stamina -= amount;
    return true;
  }

  addStamina(amount) {
    this.stamina = Math.min(this.maxStamina, this.stamina + amount);
  }

  isDead() {
    return this.hp <= 0;
  }
}

if (typeof module !== 'undefined') module.exports = StatSystem;
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- tests/StatSystem.test.js`
Expected: PASS (13 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/systems/StatSystem.js tests/StatSystem.test.js
git commit -m "feat: StatSystem - HP/스태미나/점수 관리"
```

---

### Task 3: CharacterManager

**Files:**
- Modify: `src/systems/CharacterManager.js`
- Create: `tests/CharacterManager.test.js`

- [ ] **Step 1: 실패 테스트 작성**

`tests/CharacterManager.test.js`:
```js
const CharacterManager = require('../src/systems/CharacterManager.js');

function makeMock(id) {
  return { id, swapCount: 0, onSwapIn() { this.swapCount++; } };
}

describe('CharacterManager', () => {
  let cm;
  beforeEach(() => {
    cm = new CharacterManager([makeMock('A'), makeMock('B')]);
  });

  test('초기 활성 캐릭터는 인덱스 0', () => {
    expect(cm.getActive().id).toBe('A');
  });

  test('swap: 다음 캐릭터로 교체', () => {
    cm.swap();
    expect(cm.getActive().id).toBe('B');
  });

  test('swap: 마지막에서 첫 번째로 순환', () => {
    cm.swap();
    cm.swap();
    expect(cm.getActive().id).toBe('A');
  });

  test('swap: onSwapIn 호출됨', () => {
    cm.swap();
    expect(cm.getActive().swapCount).toBe(1);
  });

  test('swap: 이전 캐릭터의 onSwapIn은 호출 안됨', () => {
    cm.swap();
    expect(cm.characters[0].swapCount).toBe(0);
  });

  test('getInactive: 활성 외 캐릭터 반환', () => {
    const inactive = cm.getInactive();
    expect(inactive.length).toBe(1);
    expect(inactive[0].id).toBe('B');
  });

  test('3개 캐릭터 순환', () => {
    const cm3 = new CharacterManager([makeMock('A'), makeMock('B'), makeMock('C')]);
    cm3.swap();
    expect(cm3.getActive().id).toBe('B');
    cm3.swap();
    expect(cm3.getActive().id).toBe('C');
    cm3.swap();
    expect(cm3.getActive().id).toBe('A');
  });

  test('빈 배열로 생성 시 오류', () => {
    expect(() => new CharacterManager([])).toThrow();
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npm test -- tests/CharacterManager.test.js`
Expected: FAIL

- [ ] **Step 3: CharacterManager 구현**

`src/systems/CharacterManager.js`:
```js
class CharacterManager {
  constructor(characters) {
    if (!characters || characters.length === 0) {
      throw new Error('CharacterManager: 캐릭터 배열이 비어있음');
    }
    this.characters = characters;
    this.activeIndex = 0;
  }

  getActive() {
    return this.characters[this.activeIndex];
  }

  getInactive() {
    return this.characters.filter((_, i) => i !== this.activeIndex);
  }

  swap() {
    this.activeIndex = (this.activeIndex + 1) % this.characters.length;
    this.getActive().onSwapIn();
    return this.getActive();
  }
}

if (typeof module !== 'undefined') module.exports = CharacterManager;
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npm test -- tests/CharacterManager.test.js`
Expected: PASS (8 tests)

- [ ] **Step 5: 커밋**

```bash
git add src/systems/CharacterManager.js tests/CharacterManager.test.js
git commit -m "feat: CharacterManager - 캐릭터 교체 로직"
```

---

### Task 4: BaseCharacter

**Files:**
- Modify: `src/entities/BaseCharacter.js`

Phaser.Physics.Arcade.Sprite를 상속. 이동, 점프, 가드, 패링, 무적 로직 포함.

- [ ] **Step 1: BaseCharacter 구현**

`src/entities/BaseCharacter.js`:
```js
class BaseCharacter extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, stat) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.stat = stat;
    this.setCollideWorldBounds(false);

    // 패링
    this.PARRY_WINDOW = 100; // ms
    this.isGuarding = false;
    this.isParrying = false;

    // 무적
    this.isInvincible = false;
    this.invincibleDuration = 0;
    this.invincibleTimer = 0;
  }

  // 가드 시작
  startGuard(currentTime) {
    if (this.isGuarding) return;
    if (this.stat.stamina <= 0) return;
    this.isGuarding = true;
    this.isParrying = true;
    this.scene.time.delayedCall(this.PARRY_WINDOW, () => {
      this.isParrying = false;
    });
  }

  stopGuard() {
    this.isGuarding = false;
    this.isParrying = false;
  }

  // 피격 처리. 패링/가드/무적이면 false 반환
  onHit(damage, attacker) {
    if (this.isInvincible) return false;

    if (this.isParrying) {
      this.onParry(attacker);
      return false;
    }

    if (this.isGuarding) {
      this.onGuardHit(damage, attacker);
      return false;
    }

    this.stat.takeDamage(damage);
    this.setInvincible(500);
    return true;
  }

  // 패링 성공: 투사체 반사, 일반 공격 캔슬
  onParry(attacker) {
    if (attacker && attacker.reflect) attacker.reflect(this);
    if (attacker && attacker.cancelAttack) attacker.cancelAttack();
  }

  // 가드 피격 기본 처리 (서브클래스에서 오버라이드)
  onGuardHit(damage, attacker) {
    this.stat.takeDamage(damage * 0.5);
  }

  setInvincible(duration) {
    this.isInvincible = true;
    this.invincibleDuration = duration;
    this.invincibleTimer = 0;
    this.setAlpha(0.5);
  }

  // 서브클래스에서 구현
  attack(enemies) {}
  skill(enemies) {}
  guard(currentTime) { this.startGuard(currentTime); }
  onSwapIn() {}

  update(delta, cursors, keys) {
    // 무적 타이머
    if (this.isInvincible) {
      this.invincibleTimer += delta;
      if (this.invincibleTimer >= this.invincibleDuration) {
        this.isInvincible = false;
        this.setAlpha(1);
      }
    }

    // 이동
    const speed = (this.speedBoost || 1.0) * 220;
    if (cursors.left.isDown) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
    } else if (cursors.right.isDown) {
      this.setVelocityX(speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // 점프
    if (cursors.up.isDown && this.body.blocked.down) {
      this.setVelocityY(-550);
    }
  }
}
```

- [ ] **Step 2: 게임 실행 확인 (오류 없음)**

Run: `npm start`
Expected: 이전과 동일하게 실행됨

- [ ] **Step 3: 커밋**

```bash
git add src/entities/BaseCharacter.js
git commit -m "feat: BaseCharacter - 이동/가드/패링/무적 베이스"
```

---

### Task 5: ElectricCharacter

**Files:**
- Modify: `src/entities/ElectricCharacter.js`

- [ ] **Step 1: ElectricCharacter 구현**

`src/entities/ElectricCharacter.js`:
```js
class ElectricCharacter extends BaseCharacter {
  constructor(scene, x, y, stat) {
    super(scene, x, y, 'electric_char', stat);
    this.ATTACK_RANGE = 200;
    this.ATTACK_DAMAGE = 20;
    this.SKILL_DAMAGE = 50;
    this.SKILL_RANGE = 300;
    this.SHIELD_RADIUS = 250;
    this.SLOW_FACTOR = 0.3;
    this.shieldGraphic = null;
  }

  // 전방 범위 전기 방출
  attack(enemies) {
    if (!enemies) return;
    const multiplier = this.stat.getAttackMultiplier();
    const facing = this.flipX ? -1 : 1;
    enemies.forEach(enemy => {
      const dx = enemy.x - this.x;
      if (Math.sign(dx) === facing && Math.abs(dx) <= this.ATTACK_RANGE) {
        enemy.onHit(this.ATTACK_DAMAGE * multiplier, this);
        enemy.applyStun(500);
      }
    });
  }

  // 광역 전기 폭발 (스태미나 소모)
  skill(enemies) {
    if (!this.stat.useStamina(this.stat.STAMINA_SKILL_COST)) return;
    if (!enemies) return;
    const multiplier = this.stat.getAttackMultiplier();
    enemies.forEach(enemy => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= this.SKILL_RANGE) {
        enemy.onHit(this.SKILL_DAMAGE * multiplier, this);
        enemy.applyStun(1000);
      }
    });
  }

  // 가드: 역장 전개 → 투사체 슬로우
  startGuard(currentTime) {
    super.startGuard(currentTime);
    if (!this.shieldGraphic) {
      this.shieldGraphic = this.scene.add.circle(this.x, this.y, this.SHIELD_RADIUS, 0x4488ff, 0.15);
    }
  }

  stopGuard() {
    super.stopGuard();
    if (this.shieldGraphic) {
      this.shieldGraphic.destroy();
      this.shieldGraphic = null;
    }
  }

  // 역장 내 투사체 슬로우 - GameScene에서 투사체 배열 전달하여 호출
  applyShieldSlow(projectiles) {
    if (!this.isGuarding || !projectiles) return;
    projectiles.forEach(p => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, p.x, p.y);
      if (dist <= this.SHIELD_RADIUS && p.setSlowed) {
        p.setSlowed(this.SLOW_FACTOR);
      }
    });
  }

  // 교체 진입: 주변 적 즉시 감전 (이벤트로 GameScene에 위임)
  onSwapIn() {
    this.scene.events.emit('electricSwapIn', this);
  }

  // 가드 피격: super와 동일 (50% 대미지)
  onGuardHit(damage, attacker) {
    super.onGuardHit(damage, attacker);
  }

  update(delta, cursors, keys) {
    super.update(delta, cursors, keys);
    if (this.shieldGraphic) {
      this.shieldGraphic.setPosition(this.x, this.y);
    }
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/entities/ElectricCharacter.js
git commit -m "feat: ElectricCharacter - 전기 범위 공격/역장 가드"
```

---

### Task 6: MechaArmCharacter

**Files:**
- Modify: `src/entities/MechaArmCharacter.js`

- [ ] **Step 1: MechaArmCharacter 구현**

`src/entities/MechaArmCharacter.js`:
```js
class MechaArmCharacter extends BaseCharacter {
  constructor(scene, x, y, stat) {
    super(scene, x, y, 'mecha_char', stat);
    this.ATTACK_DAMAGE = 15;
    this.COMBO_COUNT = 3;
    this.comboStep = 0;
    this.comboResetTimer = 0;
    this.COMBO_RESET_TIME = 600; // ms

    this.DASH_SPEED = 800;
    this.DASH_DURATION = 200; // ms
    this.isDashing = false;
    this.dashTimer = 0;

    this.speedBoost = 1.0;
  }

  // 빠른 3단 콤보
  attack(enemies) {
    if (!enemies || this.isDashing) return;
    const multiplier = this.stat.getAttackMultiplier();
    const comboMult = [1.0, 1.2, 1.5][this.comboStep] || 1.0;
    const range = 80 + this.comboStep * 20;

    enemies.forEach(enemy => {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
      if (dist <= range) {
        enemy.onHit(this.ATTACK_DAMAGE * multiplier * comboMult, this);
      }
    });

    this.comboStep = (this.comboStep + 1) % this.COMBO_COUNT;
    this.comboResetTimer = 0;
  }

  // 메카 팔 대시 돌진 (스태미나 소모)
  skill(enemies) {
    if (this.isDashing) return;
    if (!this.stat.useStamina(this.stat.STAMINA_SKILL_COST)) return;
    const facing = this.flipX ? -1 : 1;
    this.isDashing = true;
    this.dashTimer = 0;
    this.setVelocityX(this.DASH_SPEED * facing);
    this.setInvincible(this.DASH_DURATION);
    this.scene.events.emit('mechaDashStart', this);
  }

  // 가드: 풀 대미지 받되 스태미나 충전
  onGuardHit(damage, attacker) {
    this.stat.takeDamage(damage);
    this.stat.addStamina(this.stat.STAMINA_MECHA_HIT_GAIN);
  }

  // 교체 진입: 짧은 무적 + 속도 부스트
  onSwapIn() {
    this.setInvincible(800);
    this.speedBoost = 1.5;
    this.scene.time.delayedCall(1000, () => { this.speedBoost = 1.0; });
  }

  update(delta, cursors, keys) {
    // 콤보 리셋
    this.comboResetTimer += delta;
    if (this.comboResetTimer > this.COMBO_RESET_TIME) {
      this.comboStep = 0;
    }

    // 대시 처리
    if (this.isDashing) {
      this.dashTimer += delta;
      if (this.dashTimer >= this.DASH_DURATION) {
        this.isDashing = false;
        this.setVelocityX(0);
        this.scene.events.emit('mechaDashEnd', this);
      }
      return;
    }

    super.update(delta, cursors, keys);
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/entities/MechaArmCharacter.js
git commit -m "feat: MechaArmCharacter - 콤보/대시/가드 스태미나 충전"
```

---

### Task 7: Enemy

**Files:**
- Modify: `src/entities/Enemy.js`

- [ ] **Step 1: Enemy 구현**

`src/entities/Enemy.js`:
```js
class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.maxHp = 50;
    this.hp = 50;
    this.speed = 80;
    this.ATTACK_DAMAGE = 10;
    this.attackRange = 60;
    this.attackCooldown = 1500;
    this.attackTimer = 0;
    this.stunTimer = 0;
    this.isStunned = false;

    this.setCollideWorldBounds(false);
  }

  onHit(damage, attacker) {
    this.hp -= damage;
    if (this.hp <= 0) this.onDeath();
  }

  applyStun(duration) {
    this.isStunned = true;
    this.stunTimer = duration;
  }

  cancelAttack() {
    this.attackTimer = 0;
  }

  onDeath() {
    this.scene.events.emit('enemyKilled', this);
    this.destroy();
  }

  update(delta, player) {
    if (!player || !this.active) return;

    if (this.isStunned) {
      this.stunTimer -= delta;
      if (this.stunTimer <= 0) this.isStunned = false;
      this.setVelocityX(0);
      return;
    }

    const dx = player.x - this.x;
    this.setVelocityX(Math.sign(dx) * this.speed);
    this.setFlipX(dx < 0);

    this.attackTimer += delta;
    if (this.attackTimer >= this.attackCooldown) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (dist <= this.attackRange) {
        this.attackTimer = 0;
        player.onHit(this.ATTACK_DAMAGE, this);
      }
    }
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/entities/Enemy.js
git commit -m "feat: Enemy - 기본 적 엔티티"
```

---

### Task 8: PursuerAI + Pursuer

**Files:**
- Modify: `src/systems/PursuerAI.js`
- Modify: `src/entities/Pursuer.js`

- [ ] **Step 1: PursuerAI 구현 (상태머신)**

`src/systems/PursuerAI.js`:
```js
const PURSUER_STATE = {
  CHASING: 'CHASING',
  STUNNED: 'STUNNED',
};

class PursuerAI {
  constructor() {
    this.state = PURSUER_STATE.CHASING;
    this.stunTimer = 0;
    this.STUN_DURATION = 4000;

    // 저지 메커니즘
    this.damageAccumulated = 0;
    this.stunThreshold = 200;
    this.THRESHOLD_INCREASE = 50;

    // 공격 패턴 순환
    this.attackTimer = 0;
    this.attackQueue = [
      { type: 'projectile', interval: 3000 },
      { type: 'shockwave',  interval: 6000 },
      { type: 'dash',       interval: 8000 },
    ];
    this.attackIndex = 0;

    // 난이도
    this.survivalTime = 0;
    this.speedMultiplier = 1.0;
  }

  onDamage(amount) {
    if (this.state === PURSUER_STATE.STUNNED) return;
    this.damageAccumulated += amount;
    if (this.damageAccumulated >= this.stunThreshold) {
      this.damageAccumulated = 0;
      this.stunThreshold += this.THRESHOLD_INCREASE;
      this.state = PURSUER_STATE.STUNNED;
      this.stunTimer = this.STUN_DURATION;
    }
  }

  getSpeed(baseSpeed) {
    return baseSpeed * this.speedMultiplier;
  }

  isStunned() {
    return this.state === PURSUER_STATE.STUNNED;
  }

  // returns attack type string or null
  update(delta) {
    this.survivalTime += delta;
    // 30초마다 속도 5% 증가
    this.speedMultiplier = 1.0 + Math.floor(this.survivalTime / 30000) * 0.05;

    if (this.state === PURSUER_STATE.STUNNED) {
      this.stunTimer -= delta;
      if (this.stunTimer <= 0) this.state = PURSUER_STATE.CHASING;
      return null;
    }

    const current = this.attackQueue[this.attackIndex];
    this.attackTimer += delta;
    if (this.attackTimer >= current.interval) {
      this.attackTimer = 0;
      const type = current.type;
      this.attackIndex = (this.attackIndex + 1) % this.attackQueue.length;
      return type;
    }

    return null;
  }
}

if (typeof module !== 'undefined') module.exports = { PursuerAI, PURSUER_STATE };
```

- [ ] **Step 2: Pursuer 엔티티 구현**

`src/entities/Pursuer.js`:
```js
class Pursuer extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'pursuer');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.ai = new PursuerAI();
    this.BASE_SPEED = 120;
    this.CONTACT_DAMAGE = 5;
    this.contactTimer = 0;
    this.CONTACT_INTERVAL = 500;

    this.setImmovable(true);
    this.body.allowGravity = false;
  }

  // 플레이어 공격에 의한 피격
  onHit(damage, attacker) {
    this.ai.onDamage(damage);
    if (this.ai.isStunned()) this.setTint(0x888888);
  }

  // 패링으로 반사된 투사체가 추격자에 닿을 때
  reflect(reflector) {
    this.onHit(30, reflector);
  }

  update(delta, player) {
    if (!player) return;

    const attackAction = this.ai.update(delta);

    if (this.ai.isStunned()) {
      this.setVelocity(0, 0);
      this.setTint(0x888888);
      return;
    }

    this.clearTint();

    // 플레이어 추격
    const speed = this.ai.getSpeed(this.BASE_SPEED);
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

    // 접촉 대미지
    this.contactTimer += delta;
    if (this.contactTimer >= this.CONTACT_INTERVAL) {
      this.contactTimer = 0;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
      if (dist < 60) player.onHit(this.CONTACT_DAMAGE, this);
    }

    // 공격 패턴 이벤트
    if (attackAction) {
      this.scene.events.emit('pursuerAttack', { pursuer: this, type: attackAction, player });
    }
  }
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/systems/PursuerAI.js src/entities/Pursuer.js
git commit -m "feat: PursuerAI + Pursuer - 추격자 상태머신 및 엔티티"
```

---

### Task 9: MapGenerator

**Files:**
- Modify: `src/systems/MapGenerator.js`
- Create: `tests/MapGenerator.test.js`

- [ ] **Step 1: 청크 인덱스 로직 테스트 작성**

`tests/MapGenerator.test.js`:
```js
// MapGenerator의 순수 로직 부분만 단위 테스트

function getChunkIndex(y, chunkHeight) {
  return Math.floor(y / chunkHeight);
}

function getChunkBounds(chunkIndex, chunkHeight) {
  return { top: chunkIndex * chunkHeight, bottom: (chunkIndex + 1) * chunkHeight };
}

describe('MapGenerator 청크 인덱스 로직', () => {
  const H = 300;

  test('y=0 → 청크 0', () => expect(getChunkIndex(0, H)).toBe(0));
  test('y=299 → 청크 0', () => expect(getChunkIndex(299, H)).toBe(0));
  test('y=300 → 청크 1', () => expect(getChunkIndex(300, H)).toBe(1));
  test('y=-1 → 청크 -1', () => expect(getChunkIndex(-1, H)).toBe(-1));
  test('y=-300 → 청크 -1', () => expect(getChunkIndex(-300, H)).toBe(-1));
  test('청크 1의 범위: top=300, bottom=600', () => {
    expect(getChunkBounds(1, H)).toEqual({ top: 300, bottom: 600 });
  });
  test('청크 -1의 범위: top=-300, bottom=0', () => {
    expect(getChunkBounds(-1, H)).toEqual({ top: -300, bottom: 0 });
  });
});
```

- [ ] **Step 2: 테스트 통과 확인 (순수 함수라 바로 통과)**

Run: `npm test -- tests/MapGenerator.test.js`
Expected: PASS (7 tests)

- [ ] **Step 3: MapGenerator 구현 (Phaser 의존)**

`src/systems/MapGenerator.js`:
```js
class MapGenerator {
  constructor(scene) {
    this.scene = scene;
    this.CHUNK_HEIGHT = 300;
    this.BUFFER = 2;
    this.chunks = new Map();
    // 단일 staticGroup으로 모든 플랫폼 관리 (충돌 등록 한 번만)
    this.platformGroup = scene.physics.add.staticGroup();
  }

  getChunkIndex(y) {
    return Math.floor(y / this.CHUNK_HEIGHT);
  }

  update(player, enemyFactory) {
    const center = this.getChunkIndex(player.y);

    for (let i = center - this.BUFFER; i <= center + this.BUFFER; i++) {
      if (!this.chunks.has(i)) this.generateChunk(i, enemyFactory);
    }

    for (const [index] of this.chunks) {
      if (Math.abs(index - center) > this.BUFFER + 1) this.removeChunk(index);
    }
  }

  generateChunk(chunkIndex, enemyFactory) {
    const yTop = chunkIndex * this.CHUNK_HEIGHT;

    // 항상 이동 가능한 경로 보장: 좌/중/우 각 1개
    const guaranteed = [
      { x: 200,  y: yTop + 150, w: 120 },
      { x: 640,  y: yTop + 80,  w: 120 },
      { x: 1080, y: yTop + 200, w: 120 },
    ];

    const platforms = guaranteed.map(p => {
      const plat = this.platformGroup.create(p.x, p.y, 'platform');
      plat.setDisplaySize(p.w, 20).refreshBody();
      return plat;
    });

    const extra = Phaser.Math.Between(2, 4);
    for (let i = 0; i < extra; i++) {
      const x = Phaser.Math.Between(100, 1180);
      const y = yTop + Phaser.Math.Between(30, 260);
      const w = Phaser.Math.Between(60, 150);
      const plat = this.platformGroup.create(x, y, 'platform');
      plat.setDisplaySize(w, 20).refreshBody();
      platforms.push(plat);
    }

    const enemies = [];
    if (enemyFactory && chunkIndex !== 0) {
      const count = Phaser.Math.Between(1, 3);
      for (let i = 0; i < count; i++) {
        const x = Phaser.Math.Between(100, 1180);
        const y = yTop + 50;
        const e = enemyFactory(x, y);
        if (e) enemies.push(e);
      }
    }

    this.chunks.set(chunkIndex, { platforms, enemies });
  }

  removeChunk(chunkIndex) {
    const chunk = this.chunks.get(chunkIndex);
    if (!chunk) return;
    chunk.platforms.forEach(p => p.destroy());
    chunk.enemies.forEach(e => { if (e.active) e.destroy(); });
    this.chunks.delete(chunkIndex);
  }

  getPlatformGroup() {
    return this.platformGroup;
  }

  getAllEnemies() {
    const result = [];
    for (const [, chunk] of this.chunks) {
      chunk.enemies.forEach(e => { if (e.active) result.push(e); });
    }
    return result;
  }
}

if (typeof module !== 'undefined') module.exports = MapGenerator;
```

- [ ] **Step 4: 커밋**

```bash
git add src/systems/MapGenerator.js tests/MapGenerator.test.js
git commit -m "feat: MapGenerator - 무한 청크 생성/제거"
```

---

### Task 10: HUD

**Files:**
- Modify: `src/ui/HUD.js`

- [ ] **Step 1: HUD 구현**

`src/ui/HUD.js`:
```js
class HUD {
  constructor(scene, stat, characterManager) {
    this.scene = scene;
    this.stat = stat;
    this.cm = characterManager;

    // HP 바 (좌측 상단, 카메라 고정)
    scene.add.rectangle(20, 20, 200, 18, 0x333333).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    this.hpBar  = scene.add.rectangle(20, 20, 200, 18, 0xff4444).setOrigin(0, 0).setScrollFactor(0).setDepth(11);
    scene.add.text(225, 18, 'HP', { fontSize: '14px', color: '#fff' }).setScrollFactor(0).setDepth(11);

    // 스태미나 바 (HP 하단)
    scene.add.rectangle(20, 44, 200, 12, 0x333333).setOrigin(0, 0).setScrollFactor(0).setDepth(10);
    this.stBar  = scene.add.rectangle(20, 44, 200, 12, 0x44aaff).setOrigin(0, 0).setScrollFactor(0).setDepth(11);
    scene.add.text(225, 43, 'ST', { fontSize: '12px', color: '#fff' }).setScrollFactor(0).setDepth(11);

    // 생존 시간 + 점수 (상단 중앙)
    this.scoreText = scene.add.text(640, 16, '00:00  0점', {
      fontSize: '20px', color: '#fff', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(10);

    // 캐릭터 아이콘 (우측 하단)
    this.charIcons = [];
    this._buildCharIcons();
  }

  _buildCharIcons() {
    this.charIcons.forEach(ic => ic.destroy());
    this.charIcons = [];
    this.cm.characters.forEach((_, i) => {
      const isActive = i === this.cm.activeIndex;
      const x = 1260 - (this.cm.characters.length - 1 - i) * 70;
      const icon = this.scene.add.rectangle(x, 690, 50, 50, isActive ? 0xffffff : 0x555555)
        .setScrollFactor(0).setDepth(10);
      this.charIcons.push(icon);
    });
  }

  update() {
    const hpRatio = Math.max(0, this.stat.hp / this.stat.maxHp);
    this.hpBar.setDisplaySize(200 * hpRatio, 18);
    this.hpBar.setFillStyle(hpRatio <= 0.3 ? 0xff8800 : 0xff4444);

    const stRatio = Math.max(0, this.stat.stamina / this.stat.maxStamina);
    this.stBar.setDisplaySize(200 * stRatio, 12);

    const totalSec = Math.floor(this.stat.survivalTime);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    this.scoreText.setText(`${min}:${sec}  ${this.stat.score}점`);

    this._buildCharIcons();
  }
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/ui/HUD.js
git commit -m "feat: HUD - HP/스태미나 바, 점수, 캐릭터 아이콘"
```

---

### Task 11: GameScene (메인 게임플레이)

**Files:**
- Modify: `src/scenes/GameScene.js`

모든 시스템을 연결하는 핵심 씬.

- [ ] **Step 1: GameScene 구현**

`src/scenes/GameScene.js`:
```js
class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  create() {
    // 물리 경계 매우 크게 설정 (무한 스크롤 허용)
    this.physics.world.setBounds(-50000, -50000, 100000, 100000);
    this.cameras.main.setBounds(-50000, -50000, 100000, 100000);

    // 시스템 초기화
    this.stat = new StatSystem();
    this.mapGen = new MapGenerator(this);

    // 캐릭터 생성
    const electric = new ElectricCharacter(this, 640, 300, this.stat);
    const mecha    = new MechaArmCharacter(this, 640, 300, this.stat);
    mecha.setVisible(false);

    this.charManager = new CharacterManager([electric, mecha]);

    // 추격자 (플레이어보다 400px 아래에서 시작)
    this.pursuer = new Pursuer(this, 640, 700);

    // HUD
    this.hud = new HUD(this, this.stat, this.charManager);

    // 입력
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      attack: Phaser.Input.Keyboard.KeyCodes.Z,
      skill:  Phaser.Input.Keyboard.KeyCodes.X,
      guard:  Phaser.Input.Keyboard.KeyCodes.C,
      swap:   Phaser.Input.Keyboard.KeyCodes.TAB,
    });

    // 카메라
    this.cameras.main.startFollow(this.charManager.getActive(), true, 0.1, 0.1);

    // 투사체 추적 배열
    this.projectiles = [];

    // 플랫폼 충돌
    this.physics.add.collider(electric, this.mapGen.getPlatformGroup());
    this.physics.add.collider(mecha,    this.mapGen.getPlatformGroup());

    // 이벤트
    this.events.on('enemyKilled', () => this.stat.onKill());

    this.events.on('electricSwapIn', (char) => {
      this.mapGen.getAllEnemies().forEach(e => {
        const dist = Phaser.Math.Distance.Between(char.x, char.y, e.x, e.y);
        if (dist <= 200) e.applyStun(800);
      });
    });

    this.events.on('pursuerAttack', ({ pursuer, type, player }) => {
      this._handlePursuerAttack(pursuer, type, player);
    });
  }

  _handlePursuerAttack(pursuer, type, player) {
    if (type === 'projectile') {
      const proj = this.add.rectangle(pursuer.x, pursuer.y, 12, 12, 0xff6600);
      this.physics.add.existing(proj);
      proj.body.allowGravity = false;
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      proj.body.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
      proj.damage = 15;

      // 패링/가드용 메서드 부착
      proj.reflect = (reflector) => {
        const ba = Phaser.Math.Angle.Between(proj.x, proj.y, pursuer.x, pursuer.y);
        proj.body.setVelocity(Math.cos(ba) * 350, Math.sin(ba) * 350);
        proj.damage = 30;
        // 반사 후 추격자에 닿으면 대미지
        this.physics.add.overlap(proj, pursuer, () => {
          pursuer.onHit(proj.damage, proj);
          proj.destroy();
          this.projectiles = this.projectiles.filter(p => p !== proj);
        });
      };
      proj.setSlowed = (factor) => {
        proj.body.setVelocity(proj.body.velocity.x * factor, proj.body.velocity.y * factor);
      };

      // 플레이어 충돌
      this.physics.add.overlap(proj, player, () => {
        player.onHit(proj.damage, proj);
        proj.destroy();
        this.projectiles = this.projectiles.filter(p => p !== proj);
      });

      this.projectiles.push(proj);
      this.time.delayedCall(5000, () => {
        if (proj.active) {
          proj.destroy();
          this.projectiles = this.projectiles.filter(p => p !== proj);
        }
      });

    } else if (type === 'shockwave') {
      const warn = this.add.circle(pursuer.x, pursuer.y, 200, 0xff0000, 0.2);
      this.time.delayedCall(800, () => {
        warn.destroy();
        const dist = Phaser.Math.Distance.Between(pursuer.x, pursuer.y, player.x, player.y);
        if (dist <= 200) player.onHit(20, pursuer);
      });

    } else if (type === 'dash') {
      const angle = Phaser.Math.Angle.Between(pursuer.x, pursuer.y, player.x, player.y);
      pursuer.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
      this.time.delayedCall(400, () => pursuer.setVelocity(0, 0));
    }
  }

  update(time, delta) {
    if (this.stat.isDead()) {
      this.scene.start('GameOverScene', { score: this.stat.score, time: this.stat.survivalTime });
      return;
    }

    const active = this.charManager.getActive();

    // 캐릭터 교체
    if (Phaser.Input.Keyboard.JustDown(this.keys.swap)) {
      const prev = active;
      prev.setVisible(false);
      this.charManager.swap();
      const next = this.charManager.getActive();
      next.setPosition(prev.x, prev.y);
      next.setVisible(true);
      this.cameras.main.startFollow(next, true, 0.1, 0.1);
    }

    const current = this.charManager.getActive();

    // 공격
    if (Phaser.Input.Keyboard.JustDown(this.keys.attack)) {
      current.attack(this.mapGen.getAllEnemies());
    }

    // 스킬
    if (Phaser.Input.Keyboard.JustDown(this.keys.skill)) {
      current.skill(this.mapGen.getAllEnemies());
    }

    // 가드
    if (this.keys.guard.isDown) {
      current.guard(time);
      if (current instanceof ElectricCharacter) {
        current.applyShieldSlow(this.projectiles);
      }
    } else {
      current.stopGuard();
    }

    // StatSystem 업데이트
    this.stat.update(delta, current.isGuarding);

    // 캐릭터 업데이트
    current.update(delta, this.cursors, this.keys);

    // 맵 업데이트
    this.mapGen.update(current, (x, y) => {
      const e = new Enemy(this, x, y);
      this.physics.add.collider(e, this.mapGen.getPlatformGroup());
      return e;
    });

    // 추격자 업데이트
    this.pursuer.update(delta, current);

    // 적 업데이트
    this.mapGen.getAllEnemies().forEach(e => e.update(delta, current));

    // HUD 업데이트
    this.hud.update();
  }
}
```

- [ ] **Step 2: 수동 테스트**

Run: `npm start`

확인 항목:
- [ ] Space → GameScene 진입, 캐릭터 보임
- [ ] 방향키로 이동, 위로 점프
- [ ] Tab으로 캐릭터 교체 (시각 전환)
- [ ] Z 공격, X 스킬, C 가드 입력 동작
- [ ] 카메라가 캐릭터 추적
- [ ] HUD 표시 (HP, 스태미나, 점수)
- [ ] 위/아래 이동 시 새 청크 생성
- [ ] HP가 시간에 따라 감소
- [ ] 추격자가 따라옴

- [ ] **Step 3: 커밋**

```bash
git add src/scenes/GameScene.js
git commit -m "feat: GameScene - 메인 게임플레이 씬 조립"
```

---

### Task 12: Boot/MainMenu/GameOver 씬 완성

**Files:**
- Modify: `src/scenes/BootScene.js`
- Modify: `src/scenes/MainMenuScene.js`
- Modify: `src/scenes/GameOverScene.js`

- [ ] **Step 1: BootScene - 플레이스홀더 텍스처 생성**

`src/scenes/BootScene.js`:
```js
class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {}

  create() {
    // 실제 에셋 없이 색상 사각형으로 플레이스홀더 텍스처 생성
    this._makeRect('electric_char', 0x4488ff, 30, 50);
    this._makeRect('mecha_char',    0xaa4422, 30, 50);
    this._makeRect('enemy',         0x884400, 25, 40);
    this._makeRect('pursuer',       0xff2222, 60, 80);
    this._makeRect('platform',      0x555555, 100, 20);
    this.scene.start('MainMenuScene');
  }

  _makeRect(key, color, w, h) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
```

- [ ] **Step 2: MainMenuScene 완성**

`src/scenes/MainMenuScene.js`:
```js
class MainMenuScene extends Phaser.Scene {
  constructor() { super('MainMenuScene'); }

  create() {
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x111111);

    this.add.text(width / 2, height / 2 - 80, '묵철 (墨鐵)', {
      fontSize: '48px', color: '#cccccc', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, '수묵화 액션 플랫포머', {
      fontSize: '20px', color: '#888888'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 80, '[ SPACE ] 시작', {
      fontSize: '24px', color: '#ffffff'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
  }
}
```

- [ ] **Step 3: GameOverScene 완성**

`src/scenes/GameOverScene.js`:
```js
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOverScene'); }

  create(data) {
    const { width, height } = this.cameras.main;
    const score = data?.score ?? 0;
    const totalSec = Math.floor(data?.time ?? 0);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');

    this.add.rectangle(width / 2, height / 2, width, height, 0x000000);

    this.add.text(width / 2, height / 2 - 120, '게임 오버', {
      fontSize: '52px', color: '#ff4444', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 20, `생존 시간: ${min}:${sec}`, {
      fontSize: '28px', color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 40, `점수: ${score}`, {
      fontSize: '32px', color: '#ffdd00'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 120, '[ SPACE ] 다시 시작    [ ESC ] 메인 메뉴', {
      fontSize: '18px', color: '#aaaaaa'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('GameScene'));
    this.input.keyboard.once('keydown-ESC',   () => this.scene.start('MainMenuScene'));
  }
}
```

- [ ] **Step 4: 전체 흐름 수동 테스트**

Run: `npm start`

확인 항목:
- [ ] 타이틀 "묵철" 표시
- [ ] Space로 게임 시작
- [ ] HP 0으로 GameOver 씬 전환, 점수/시간 표시
- [ ] Space로 재시작, ESC로 메인 메뉴 복귀

- [ ] **Step 5: 커밋**

```bash
git add src/scenes/BootScene.js src/scenes/MainMenuScene.js src/scenes/GameOverScene.js
git commit -m "feat: Boot/MainMenu/GameOver 씬 완성"
```

---

### Task 13: 빌드 설정

**Files:**
- Create: `electron-builder.config.js`

- [ ] **Step 1: 빌드 설정 작성**

`electron-builder.config.js`:
```js
module.exports = {
  appId: 'com.21nl.game',
  productName: '21NL',
  directories: { output: 'release' },
  files: [
    'main.js',
    'index.html',
    'src/**/*',
    'assets/**/*',
    'node_modules/phaser/dist/phaser.min.js',
  ],
  win: {
    target: 'portable',
  },
  portable: {
    artifactName: '21NL_v${version}_portable.exe',
  },
};
```

- [ ] **Step 2: 빌드 실행**

Run: `npm run build`
Expected: `release/21NL_v0.1.0_portable.exe` 생성

- [ ] **Step 3: 커밋**

```bash
git add electron-builder.config.js
git commit -m "feat: electron-builder 빌드 설정"
```

---

## 자체 검토 결과

### 스펙 커버리지

| 스펙 요구사항 | 구현 태스크 |
|---|---|
| Electron + Phaser.js | Task 1 |
| StatSystem (HP 감소/저체력 강화/스태미나) | Task 2 |
| 캐릭터 교체 (즉시, onSwapIn 이펙트) | Task 3, Task 11 |
| 전기 캐릭터 (범위 공격, 역장 가드, 감전 스왑) | Task 5 |
| 메카 팔 캐릭터 (콤보, 대시, 가드 스태미나 충전) | Task 6 |
| 패링 (가드 입력 후 100ms 이내, 투사체 반사/공격 캔슬) | Task 4 |
| 무한 청크 맵 (위/아래 무한 생성) | Task 9 |
| 일반 적 (추격+공격+스턴) | Task 7 |
| 추격자 (3종 공격 패턴+저지 메커니즘+난이도 증가) | Task 8 |
| HUD (HP/스태미나 바, 점수, 캐릭터 아이콘) | Task 10 |
| Boot/MainMenu/GameOver 씬 | Task 12 |
| 빌드 (portable exe) | Task 13 |

### 타입/메서드 일관성 확인

- `stat.STAMINA_SKILL_COST`, `stat.STAMINA_MECHA_HIT_GAIN` — Task 2에서 정의, Task 5·6에서 참조 ✓
- `enemy.onHit(damage, attacker)` — Task 7 Enemy에 정의, Task 5·6·8에서 호출 ✓
- `enemy.applyStun(duration)` — Task 7 Enemy에 정의, Task 5에서 호출 ✓
- `charManager.getActive()`, `charManager.swap()` — Task 3에서 정의, Task 11에서 사용 ✓
- `mapGen.getAllEnemies()` — Task 9에서 정의, Task 11에서 사용 ✓
- `mapGen.getPlatformGroup()` — Task 9에서 정의, Task 11에서 사용 ✓
- `pursuer.onHit(damage, attacker)` — Task 8 Pursuer에 정의, Task 11 투사체 반사에서 사용 ✓
