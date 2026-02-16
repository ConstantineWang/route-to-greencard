export const ENDINGS = {
  opt_expired: { emoji: '📚', title: '学业结束', desc: '没找到sponsor工作，OPT到期后回国发展。', years: 1 },
  h1b_failed: { emoji: '🎲', title: '抽签未中', desc: '连续三年H-1B未中签，STEM OPT到期。', years: 3 },
  h1b_denied: { emoji: '📋', title: 'H-1B被拒', desc: 'H-1B申请被拒绝，需要离境。', years: 1 },
  perm_failed: { emoji: '💼', title: 'PERM受阻', desc: '绿卡申请在PERM阶段受阻。', years: 2 },
  i140_denied: { emoji: '📄', title: 'I-140被拒', desc: 'I-140被拒，需要重新评估。', years: 3 },
  waiting_failed: { emoji: '⏳', title: '等待中变故', desc: '排期等待中遭遇变故。', years: 5 },
  i485_denied: { emoji: '😢', title: '功亏一篑', desc: '最后一步I-485被拒...', years: 7 },
  eb5_failed: { emoji: '💸', title: 'EB-5失败', desc: '投资移民项目出问题，钱也打水漂了...', years: 2 },
  success: { emoji: '🗽', title: '美国梦实现！', desc: '历经千辛万苦，终于拿到绿卡！', years: 7 },
  success_eb5: { emoji: '🏆', title: '氪金通关！', desc: '有钱真好，EB-5直接拿绿卡！', years: 2 }
};

export const AGE_COMMENTS = {
  young: '🌟 才${age}岁，青春还在，未来可期！',
  old: '😮‍💨 ${age}岁了...最好的年华都献给了绿卡，值得吗？'
};

export const ABILITY_LEVELS = {
  god: { name: '🏆 卷王', desc: '托福115+ GPA3.9+ FAANG实习', warn: '(确定？请诚实评估)', diceCount: 3, pickBest: true },
  strong: { name: '💪 强', desc: '托福105+ GPA3.5+ 有实习', warn: '', diceCount: 2, pickBest: true },
  normal: { name: '😐 一般', desc: '托福95+ GPA3.0+', warn: '', diceCount: 1, pickBest: true },
  weak: { name: '😰 弱', desc: '托福刚过线 GPA一般', warn: '', diceCount: 2, pickBest: false },
  loser: { name: '🛋️ 摆王', desc: '躺平爱好者', warn: '', diceCount: 3, pickBest: false }
};

export const WEALTH_LEVELS = {
  rich: { name: '💎 土豪 (>3500万)', canEB5: true },
  normal: { name: '🏠 普通家庭', canEB5: false }
};
