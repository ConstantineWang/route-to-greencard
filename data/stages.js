export const STAGES = [
  { id: 'graduate', short: '找工作', title: '🎓 找工作', desc: 'OPT开始！找一份愿意sponsor H-1B的工作。', baseOdds: 0.5, oddsText: '50%基础率(受能力影响)', successMsg: '🎉 拿到Offer！', failMsg: '😢 没找到sponsor工作...', failEnding: 'opt_expired', useAbility: true },
  { id: 'h1b_lottery_1', short: 'H1B①', title: '🎰 H-1B抽签(1)', desc: '40万人抢8.5万名额！', baseOdds: 0.27, oddsText: '27%中签率', successMsg: '🎊 中签了！', failMsg: '😔 没中，明年再战！', failEnding: null, useAbility: false },
  { id: 'h1b_lottery_2', short: 'H1B②', title: '🎰 H-1B抽签(2)', desc: '第二次机会！', baseOdds: 0.27, oddsText: '27%中签率', successMsg: '🎊 第二年中了！', failMsg: '😔 又没中...', failEnding: null, useAbility: false },
  { id: 'h1b_lottery_3', short: 'H1B③', title: '🎰 H-1B抽签(3)', desc: '最后机会！', baseOdds: 0.27, oddsText: '27%中签率(最后!)', successMsg: '🎊 绝地逢生！', failMsg: '💔 三年没中...', failEnding: 'h1b_failed', useAbility: false },
  { id: 'h1b_approve', short: 'H1B审批', title: '📋 H-1B审批', desc: 'USCIS审核材料', baseOdds: 0.92, oddsText: '92%批准率', successMsg: '✅ H-1B批准！', failMsg: '❌ H-1B被拒...', failEnding: 'h1b_denied', useAbility: false },
  { id: 'perm', short: 'PERM', title: '📝 PERM', desc: '申请劳工证', baseOdds: 0.85, oddsText: '85%通过率', successMsg: '✅ PERM批准！', failMsg: '❌ PERM被拒...', failEnding: 'perm_failed', useAbility: false },
  { id: 'i140', short: 'I-140', title: '📄 I-140', desc: '提交移民申请', baseOdds: 0.90, oddsText: '90%批准率', successMsg: '✅ I-140批准！', failMsg: '❌ I-140被拒...', failEnding: 'i140_denied', useAbility: false },
  { id: 'waiting', short: '排期', title: '⏳ 排期', desc: '中国申请人等4-5年...', baseOdds: 0.75, oddsText: '75%(裁员/倒闭风险)', successMsg: '🎯 排期到了！', failMsg: '💼 等待中遭遇变故...', failEnding: 'waiting_failed', useAbility: false },
  { id: 'i485', short: 'I-485', title: '🏠 I-485', desc: '最后一步！', baseOdds: 0.95, oddsText: '95%批准率', successMsg: '🎉🎉🎉 绿卡批准！！！', failMsg: '❌ I-485被拒...', failEnding: 'i485_denied', useAbility: false }
];

export const EB5_STAGE = { id: 'eb5', short: 'EB-5', title: '💰 EB-5', desc: '投资80万美元走EB-5', baseOdds: 0.90, oddsText: '90%成功率', successMsg: '🎉 EB-5批准！', failMsg: '❌ EB-5失败...', failEnding: 'eb5_failed', useAbility: false };
