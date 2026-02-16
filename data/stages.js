export const STAGES = [
  { id: 'graduate', short: '找工作', title: '🎓 找工作', desc: 'OPT开始！找一份愿意sponsor H-1B的工作。', baseOdds: 0.6, oddsText: '60%(受做题家能力影响)', successMsg: '🎉 拿到Offer！', failMsg: '😢 没找到sponsor工作...', failEnding: 'opt_expired', useAbility: true, years: 1, canEvent: false },
  { id: 'h1b_lottery_1', short: 'H1B①', title: '🎰 H-1B抽签(1)', desc: '40万人抢8.5万名额！', baseOdds: 0.27, oddsText: '27%中签率', successMsg: '🎊 中签了！', failMsg: '😔 没中，明年再战！', failEnding: null, useAbility: false, years: 1, canEvent: true },
  { id: 'h1b_lottery_2', short: 'H1B②', title: '🎰 H-1B抽签(2)', desc: '第二次机会！', baseOdds: 0.27, oddsText: '27%中签率', successMsg: '🎊 第二年中了！', failMsg: '😔 又没中...', failEnding: null, useAbility: false, years: 1, canEvent: true },
  { id: 'h1b_lottery_3', short: 'H1B③', title: '🎰 H-1B抽签(3)', desc: '最后机会！', baseOdds: 0.27, oddsText: '27%中签率(最后!)', successMsg: '🎊 绝地逢生！', failMsg: '💔 三年没中...', failEnding: 'h1b_failed', useAbility: false, years: 1, canEvent: true },
  { id: 'h1b_approve', short: 'H1B审批', title: '📋 H-1B审批', desc: 'USCIS审核材料', baseOdds: 0.92, oddsText: '92%批准率', successMsg: '✅ H-1B批准！', failMsg: '❌ H-1B被拒...', failEnding: 'h1b_denied', useAbility: false, years: 0, canEvent: false },
  { id: 'perm', short: 'PERM', title: '📝 PERM', desc: '申请劳工证', baseOdds: 0.85, oddsText: '85%通过率', successMsg: '✅ PERM批准！', failMsg: '❌ PERM被拒...', failEnding: 'perm_failed', useAbility: false, years: 1, canEvent: true },
  { id: 'i140', short: 'I-140', title: '📄 I-140', desc: '提交移民申请', baseOdds: 0.90, oddsText: '90%批准率', successMsg: '✅ I-140批准！开始漫长排期...', failMsg: '❌ I-140被拒...', failEnding: 'i140_denied', useAbility: false, years: 1, canEvent: false, waitingYears: 6 },
  { id: 'i485', short: 'I-485', title: '🏠 I-485', desc: '最后一步！', baseOdds: 0.95, oddsText: '95%批准率', successMsg: '🎉🎉🎉 绿卡批准！！！', failMsg: '❌ I-485被拒...', failEnding: 'i485_denied', useAbility: false, years: 1, canEvent: false }
];

// 随机事件类型
export const RANDOM_EVENTS = {
  layoff: { 
    id: 'layoff', short: '裁员', title: '💼 公司裁员', 
    desc: '经济不好，你被裁员了...', baseOdds: 0.9, oddsText: '90%安全(10%被裁)', 
    successMsg: '😮‍💨 躲过一劫！', failMsg: '😱 被裁员了！', useAbility: false 
  },
  family: { 
    id: 'family', short: '家庭变故', title: '👨‍👩‍👧 家庭变故', 
    desc: '家里出了大事，需要你回去处理...', baseOdds: 0.85, oddsText: '85%能远程解决(15%必须回国)', 
    successMsg: '😮‍💨 远程处理好了！', failMsg: '😢 必须回国处理，身份中断...', useAbility: false,
    failEnding: 'family_emergency'
  },
  health: { 
    id: 'health', short: '健康危机', title: '🏥 身心健康危机', 
    desc: '长期高压，身体或心理出现严重问题...', baseOdds: 0.88, oddsText: '88%能扛住(12%扛不住)', 
    successMsg: '💪 调整过来了！', failMsg: '😢 身心崩溃，无法继续...', useMental: true,
    failEnding: 'health_crisis'
  }
};

export const PEACEFUL_YEAR = {
  id: 'peaceful', short: '平安', title: '☀️ 平安的一年', 
  desc: '这一年风平浪静，继续等待...', baseOdds: 1, oddsText: '自动通过',
  successMsg: '😌 平安度过！', useAbility: false
};

export const FIND_JOB_60 = {
  id: 'find_job_60', short: '60天找工', title: '🏃 60天内找工作', 
  desc: '被裁后有60天grace period，必须找到新工作！', baseOdds: 0.3, oddsText: '30%基础率(受做题家能力影响)', 
  successMsg: '🎉 找到新工作了！', failMsg: '😢 60天内没找到工作...', failEnding: 'layoff_failed', useAbility: true
};

export const EB5_STAGE = { 
  id: 'eb5', short: 'EB-5', title: '💰 EB-5', desc: '投资80万美元走EB-5', 
  baseOdds: 0.90, oddsText: '90%成功率', successMsg: '🎉 EB-5批准！', failMsg: '❌ EB-5失败...', 
  failEnding: 'eb5_failed', useAbility: false, years: 2, canEvent: false 
};
