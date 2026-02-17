# 绿卡之路 - Immigration Simulator RPG

## Overview
D10 dice-rolling immigration simulator for Chinese students in the US.

## Tech
Vanilla JS, Upstash Redis, Vercel

## Game Flow
```
找工作 [60%, 能力] → H-1B ×3 [18%本科/27%硕士] → 审批 [92%]
→ PERM [85%] → I-140 [90%] → 6年排期 → I-485 [95%] → 绿卡
```

## Attributes
| 属性 | 效果 |
|------|------|
| 学历 | 本科18%/硕士27% H-1B，本科失败可读硕士 |
| 做题家能力 | 影响找工作/裁员检定 |
| 身心状态 | 影响健康危机检定 |
| 家庭资产 | 富哥可选EB-5 |

## Random Events (每年)
- 40% 平安
- 30% 裁员 [70%, 能力]
- 20% 健康危机 [88%, 身心]
- 10% 家庭变故 [85%]

## Special
- 6次H-1B未中 = 特殊结局
- 上岸率统计排除开挂和EB-5
- 结局界面显示全球统计+高亮当前结局

## Endings
成功: 绿卡到手, EB-5通关
失败: OPT到期, 3/6抽未中, H1B被拒, PERM失败, I-140被拒, I-485被拒, 60天未找到, 家庭变故, 身心崩溃, EB-5失败, 主动回国
