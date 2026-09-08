# InkWarrior — Steam Achievements

---

## Stats

| API Name | Type | Description |
|----------|------|-------------|
| `STAT_ENEMIES_DEFEATED` | INT | Total enemies defeated |
| `STAT_COMBOS_3HIT` | INT | Total 3-hit combos landed |
| `STAT_FINISH_KILLS` | INT | Total finish kills executed |
| `STAT_PERFECT_DODGES` | INT | Successful dodges with no damage taken in fight |
| `STAT_STAGES_CLEARED` | INT | Total stages cleared |
| `STAT_DEATHS` | INT | Total deaths |

---

## Achievements

| API Name | EN Name | KO Name | How to Unlock |
|----------|---------|---------|---------------|
| `ACH_FIRST_COMBO` | First Brushstroke | 첫 붓터치 | Land your first 3-hit combo |
| `ACH_FIRST_FINISH` | Ink Burst | 잉크 폭발 | Execute your first finish kill |
| `ACH_FIRST_STAGE` | Into the Dark | 어둠 속으로 | Clear stage 1 |
| `ACH_STAGE_5` | Ink-Stained Warrior | 잉크로 물든 전사 | Clear stage 5 |
| `ACH_STAGE_10` | Brush of Fury | 분노의 붓 | Clear stage 10 |
| `ACH_NO_HIT` | Clean Canvas | 깨끗한 캔버스 | Clear a stage without taking damage |
| `ACH_COMBO_MASTER` | Master Calligrapher | 달인 서예가 | Land 50 3-hit combos total |
| `ACH_FINISH_COLLECTOR` | Ink Executioner | 잉크 처형인 | Execute 100 finish kills total |
| `ACH_DODGE_REFLEX` | Phantom Dodge | 환영 회피 | Dodge 5 attacks in a single fight |
| `ACH_ENEMY_HUNDRED` | Dark Ink Army | 어둠의 잉크 군대 | Defeat 100 enemies total |
| `ACH_SPEED_CLEAR` | Swift Brush | 빠른 붓 | Clear a stage in under 60 seconds |
| `ACH_NO_DEATH_RUN` | Untarnished | 흠 없는 용사 | Complete the game without dying |
| `ACH_COMEBACK` | Ink Rises | 잉크는 다시 | Complete a stage after losing all but 1 HP |
| `ACH_PORTRAIT_MASTER` | Vertical Virtuoso | 세로 화면의 달인 | Reach stage 10 — portrait mode specialist |

---

## Implementation Notes

- Steam API: `ISteamUserStats`
- `ACH_NO_HIT` tracks damage taken per stage (reset on stage start)
- `ACH_DODGE_REFLEX` requires per-fight dodge counter
- `ACH_NO_DEATH_RUN` persists a "death occurred" flag across the full playthrough
- `ACH_SPEED_CLEAR` uses wall clock per stage (excluding loading)
- All achievements unlockable offline in single-player
- Replace App ID 480 with real Steamworks App ID before submission
