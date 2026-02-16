# 绿卡之路 - Immigration Simulator RPG

## Project Overview
D10 dice-rolling immigration simulator for Chinese students in the US.

## Tech Stack
- Vanilla JS (ES modules), HTML/CSS
- Upstash Redis (stats backend)
- Vercel deployment

## File Structure
```
route-to-green-card/
├── index.html, guide.html, stats.html
├── css/style.css
├── data/stages.js, endings.js
├── js/game.js, ui.js
└── api/results.js
```

## Game Flow
```
找工作 [60%, 能力] → H-1B抽签 ×3 [18%本科/27%硕士] → H-1B审批 [92%]
→ PERM [85%] → I-140 [90%] → 6年排期(随机事件) → I-485 [95%] → 绿卡
```

## Character Attributes

| 属性 | 选项 | 效果 |
|------|------|------|
| 学历 | 本科(18% H1B) / 硕士(27% H1B) | 本科失败可读硕士 |
| 做题家能力 | 卷王→摆王 | 影响找工作/裁员检定骰子数 |
| 身心状态 | 钢铁→俱疲 | 影响健康危机检定骰子数 |
| 家庭资产 | 富哥/普通 | 富哥可选EB-5 |

## Dice System
- D10 (0-9), 数字越大越好
- 阈值 = 10 - (概率 × 10)
- 优势: 多骰取最大 / 劣势: 多骰取最小

## Random Events (排期每年)
| 概率 | 事件 | 检定 |
|------|------|------|
| 52% | 平安年 | 自动通过 |
| 30% | 裁员 | 70%, 能力检定, 失败→60天找工作 |
| 10% | 家庭变故 | 85% |
| 8% | 健康危机 | 88%, 身心检定 |

## Fail Options
- 本科生: 读硕士 (+2年, 重新找工作, 保留抽签次数)
- 富哥: EB-5投资移民 (90%)
- 放弃回国

## Special
- 6次H1B未中 = 特殊结局
- NIW等待期间无随机事件(可离境)

## Endings
成功: 绿卡到手, EB-5通关
失败: OPT到期, 3/6抽未中, H1B被拒, PERM失败, I-140被拒, I-485被拒, 60天未找到, 家庭变故, 身心崩溃, EB-5失败, 主动回国

## Run
```bash
npx serve .
# or: python3 -m http.server 8000
```
