# 美国留子上岸模拟器 - Immigration Simulator RPG

## Project Overview
A D10 dice-rolling immigration simulator game for Chinese students in the US, built as a web app.

## Tech Stack
- Vanilla JS (ES modules)
- HTML/CSS
- No frameworks

## File Structure
```
route-to-green-card/
├── index.html          # Main game page
├── guide.html          # Game rules/logic tree
├── css/style.css       # Styles
├── data/
│   ├── stages.js       # Game stages config
│   └── endings.js      # Endings + character attributes
└── js/
    ├── game.js         # Game logic/state
    └── ui.js           # UI rendering
```

## Game Flow
1. **找工作** [60%, 做题家能力检定] → +1年
2. **H-1B抽签** [27%] × 3次机会 → 每次+1年
3. **H-1B审批** [92%]
4. **PERM** [85%] → +1年
5. **I-140** [90%] → +1年, 触发6年排期
6. **排期等待** 6年，每年随机事件
7. **I-485** [95%] → 绿卡成功！

## Character Attributes
### 💰 家庭资产
- 富哥富姐 (>5000万) → 解锁EB-5逃生路线
- 普通家庭

### 📚 做题家能力 (影响找工作/60天找工)
| 等级 | 描述 | 骰子 |
|------|------|------|
| 🏆 卷王 | Ivy/Top10 托福115+ GPA3.9+ FAANG实习 | 3次取最大 |
| 💪 强 | Top30 托福105+ GPA3.5+ 有实习 | 2次取最大 |
| 😐 一般 | Top50 托福95+ GPA3.0+ | 1次 |
| 😰 弱 | Top100 托福刚过线 GPA一般 | 2次取最小 |
| 🛋️ 摆王 | 野鸡大学 躺平爱好者 | 3次取最小 |

### 💪 身心状态 (影响健康危机检定)
| 等级 | 描述 | 骰子 |
|------|------|------|
| 🔩 身心钢铁 | 健身狂+压力越大越兴奋 | 3次取最大 |
| 💪 身心健康 | 偶尔运动+扛得住压力 | 2次取最大 |
| 😐 普通 | 久坐不动+正常心态 | 1次 |
| 😰 亚健康 | 熬夜+容易焦虑 | 2次取最小 |
| 💔 身心俱疲 | 体弱多病+玻璃心 | 3次取最小 |

## Dice System
- D10 (0-9), 数字越大越好
- 阈值 = 10 - (概率 × 10), 例如 27% → ≥7成功
- 优势: 多骰取最大
- 劣势: 多骰取最小

## Random Events (排期期间每年)
| 概率 | 事件 | 检定 |
|------|------|------|
| 67% | ☀️ 平安年 | 自动通过 |
| 15% | 💼 裁员 | ≥1成功, 失败→60天找工作 |
| 10% | 👨‍👩‍👧 家庭变故 | ≥2成功 |
| 8% | 🏥 健康危机 | ≥2成功, 身心状态检定 |

## Special Features
- **EB-5逃生**: 富哥在主线失败时可选择投资移民
- **60天找工作**: 被裁后触发，做题家能力检定
- **年龄追踪**: 结局时评价 (<30岁青春还在 / ≥35岁年华献给绿卡)
- **开挂模式**: 全部检定自动通过
- **路径追踪**: 可视化显示走过的阶段

## All Endings
- 🗽 美国梦实现 / 🏆 氪金通关
- 📚 OPT到期 / 🎲 三年未中签 / 📋 H1B被拒
- 💼 PERM失败 / 📄 I-140被拒 / 🏠 I-485被拒
- 📦 60天未找到工作 / 👨‍👩‍👧 家庭变故 / 🏥 身心崩溃
- 💸 EB-5失败

## Git
Initialized with commits tracking feature additions.

## Run
```bash
cd route-to-green-card
python3 -m http.server 8000
# or: npx serve .
```
