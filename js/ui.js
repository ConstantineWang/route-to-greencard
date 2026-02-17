import { ABILITY_LEVELS, WEALTH_LEVELS, AGE_COMMENTS, MENTAL_LEVELS, EDUCATION_LEVELS } from '../data/endings.js';

export class UI {
  constructor(game, el) { this.game = game; this.el = el; this.rolling = false; }

  render() {
    const { state } = this.game;
    if (state.phase === 'setup') this.renderSetup();
    else if (state.phase === 'ended') this.renderEnd();
    else { this.game.skipInvalid(); this.renderStage(); }
  }

  renderSetup() {
    this.el.innerHTML = `
      <div class="card"><div class="stage-title">👤 创建你的角色</div><p class="desc">选择属性，开始你的绿卡之路</p></div>
      <div class="card">
        <h3>🎓 学历</h3>
        <p class="desc" style="margin-bottom:10px;font-size:0.85em">本科H-1B中签率较低，但失败后可读硕士</p>
        <div class="opts">${Object.entries(EDUCATION_LEVELS).map(([k,v])=>`
          <label class="opt"><input type="radio" name="e" value="${k}"><span>${v.name}</span></label>
        `).join('')}</div>
      </div>
      <div class="card">
        <h3>🎂 毕业年龄</h3>
        <div class="age-input">
          <button type="button" class="age-btn" id="age-down">−</button>
          <input type="number" id="age" min="20" max="35" value="22" style="width:70px;padding:12px;font-size:1.2em;border-radius:10px;text-align:center">
          <button type="button" class="age-btn" id="age-up">+</button>
          <span style="margin-left:12px;color:#aaa">岁</span>
        </div>
      </div>
      <div class="card">
        <h3>💰 家庭资产</h3>
        <p class="desc" style="margin-bottom:10px;font-size:0.85em">富哥可选择EB-5投资移民</p>
        <div class="opts">${Object.entries(WEALTH_LEVELS).map(([k,v])=>`
          <label class="opt"><input type="radio" name="w" value="${k}"><span>${v.name}</span></label>
        `).join('')}</div>
      </div>
      <div class="card">
        <h3>📚 做题家能力</h3>
        <p class="desc" style="margin-bottom:10px;font-size:0.85em">影响找工作的随机数判定方法</p>
        <div class="opts">${Object.entries(ABILITY_LEVELS).map(([k,v])=>`
          <label class="opt"><input type="radio" name="a" value="${k}"><span>${v.name}</span><small>${v.desc}</small></label>
        `).join('')}</div>
      </div>
      <div class="card">
        <h3>💪 身心状态</h3>
        <p class="desc" style="margin-bottom:10px;font-size:0.85em">影响健康危机事件的随机数判定方法</p>
        <div class="opts">${Object.entries(MENTAL_LEVELS).map(([k,v])=>`
          <label class="opt"><input type="radio" name="m" value="${k}"><span>${v.name}</span><small>${v.desc}</small></label>
        `).join('')}</div>
      </div>
      <button class="btn btn-roll" id="start" disabled>🚀 开始移民之路</button>
      <label class="opt" style="margin-top:12px;justify-content:center;background:rgba(255,215,0,0.1)"><input type="checkbox" id="cheat"><span>🔓 开挂模式 <small style="margin-left:0">全部检定自动通过</small></span></label>`;
    const btn = this.el.querySelector('#start');
    const check = () => {
      btn.disabled = !this.el.querySelector('input[name="e"]:checked') ||
                     !this.el.querySelector('input[name="w"]:checked') || 
                     !this.el.querySelector('input[name="a"]:checked') ||
                     !this.el.querySelector('input[name="m"]:checked');
    };
    this.el.querySelectorAll('input[type="radio"]').forEach(r => r.onchange = check);
    const ageInput = this.el.querySelector('#age');
    this.el.querySelector('#age-down').onclick = () => { if (ageInput.value > 20) ageInput.value--; };
    this.el.querySelector('#age-up').onclick = () => { if (ageInput.value < 35) ageInput.value++; };
    btn.onclick = () => {
      const age = parseInt(this.el.querySelector('#age').value) || 22;
      const cheat = this.el.querySelector('#cheat').checked;
      this.game.setCharacter(
        this.el.querySelector('input[name="w"]:checked').value,
        this.el.querySelector('input[name="a"]:checked').value,
        age,
        cheat,
        this.el.querySelector('input[name="m"]:checked').value,
        this.el.querySelector('input[name="e"]:checked').value
      );
      this.render();
    };
  }

  renderEnd() {
    const { state } = this.game;
    if (!state.submitted) { state.submitted = true; this.game.submitResult(); }
    const e = this.game.getEnding(state.endingType);
    const finalAge = this.game.currentAge;
    const yearsSpent = state.character.yearsSpent;
    let ageComment = '';
    if (finalAge < 30) {
      ageComment = AGE_COMMENTS.young.replace('${age}', finalAge);
    } else if (finalAge >= 35) {
      ageComment = AGE_COMMENTS.old.replace('${age}', finalAge);
    }

    this.el.innerHTML = `
      <div class="card">
        <h4 style="margin-bottom:10px">📍 你的移民之路</h4>
        <div class="path">${state.history.map(h=>`
          <div class="path-item ${h.success?'ok':'fail'}">
            <span class="dot ${h.success?'ok':'fail'}"></span>
            <span class="path-label">${h.short}</span>
          </div>
        `).join('')}</div>
      </div>
      <div class="card final">
        <div class="big">${e.emoji}</div>
        <h2>${e.title}</h2>
        <p>${e.desc}</p>
        <p class="gold">📅 ${yearsSpent}年 | 🎂 ${state.character.age}岁 → ${finalAge}岁</p>
        ${ageComment ? `<p style="margin-top:15px;color:${finalAge<30?'#4caf50':'#f5576c'}">${ageComment}</p>` : ''}
        <button class="btn btn-restart" id="re">🔄 重生</button>
      </div>
      <div class="card" id="stats-card">
        <h4 style="margin-bottom:10px">📊 全球统计</h4>
        <div id="stats-content">加载中...</div>
      </div>`;
    this.el.querySelector('#re').onclick = () => { this.game.reset(); this.render(); };
    this.loadStats(state.endingType);
  }

  async loadStats(currentEnding) {
    try {
      const res = await fetch('/api/results');
      const data = await res.json();
      const total = data.total || 0;
      const successRate = total ? ((data.success / total) * 100).toFixed(1) : 0;
      
      const sorted = Object.entries(data.endings || {}).sort((a,b) => b[1] - a[1]);
      
      document.getElementById('stats-content').innerHTML = `
        <div style="display:flex;justify-content:space-around;margin-bottom:15px;font-size:0.9em">
          <span>🎮 ${total}次</span>
          <span>🎉 ${successRate}%上岸</span>
          <span>📅 平均${data.avgYears}年</span>
        </div>
        <div class="endings-list">
          ${sorted.map(([k, v]) => {
            const ending = this.game.getEnding(k);
            if (!ending) return '';
            const pct = ((v / total) * 100).toFixed(1);
            const isCurrent = k === currentEnding;
            return `<div class="ending-row ${isCurrent ? 'current' : ''}">
              <span>${ending.emoji} ${ending.title}</span>
              <span>${pct}%</span>
            </div>
            <div class="ending-bar"><div class="ending-fill ${isCurrent ? 'current' : ''}" style="width:${pct}%"></div></div>`;
          }).join('')}
        </div>`;
    } catch (e) {
      document.getElementById('stats-content').innerHTML = '暂无数据';
    }
  }

  renderStage() {
    const { state } = this.game;
    const s = this.game.currentStage;
    const ab = this.game.getAbility();
    const mental = this.game.getMental();
    
    let dc, pickBest, attrName;
    if (s.useAbility) {
      dc = ab.diceCount;
      pickBest = ab.pickBest;
      attrName = ab.name;
    } else if (s.useMental) {
      dc = mental.diceCount;
      pickBest = mental.pickBest;
      attrName = mental.name;
    } else {
      dc = 1;
      pickBest = true;
      attrName = null;
    }
    
    // H-1B 使用学历对应的概率
    let baseOdds = s.baseOdds;
    if (s.id.startsWith('h1b_lottery')) {
      baseOdds = this.game.h1bOdds;
    }
    const threshold = 10 - Math.floor(baseOdds * 10);
    const successRate = Math.floor(baseOdds * 100);
    const info = attrName 
      ? ` ≥${threshold}成功 | ${dc}次随机取${pickBest?'最大':'最小'}，因为初始属性是（${attrName}）` 
      : `${successRate}%成功率 | 掷出≥${threshold}即可通过`;

    this.el.innerHTML = `
      ${state.history.length?`
        <div class="card">
          <div class="path">${state.history.map(h=>`
            <div class="path-item ${h.success?'ok':'fail'}">
              <span class="dot ${h.success?'ok':'fail'}"></span>
              <span class="path-label">${h.short}</span>
            </div>
          `).join('')}
          ${state.lastResult === undefined ? `<div class="path-item now"><span class="dot now"></span><span class="path-label">${s.short}</span></div>` : ''}
          </div>
        </div>
      `:''}
      <div class="card">
        <div class="status">
          <span>📍 ${state.isEB5?'EB-5': state.inWaiting?`排期${state.waitingYear+1}/${state.waitingTotal}`: `${state.stageIndex+1}/${this.game.totalStages}`}</span>
          <span>🎂 ${this.game.currentAge}岁</span>
          <span>${EDUCATION_LEVELS[state.character.education].name}</span>
          ${s.id.startsWith('h1b_lottery') && state.h1bAttempts >= 3 ? `<span>总第${state.h1bAttempts+1}抽</span>` : ''}
        </div>
      </div>
      <div class="card">
        <div class="stage-title">${s.title}</div><p class="desc">${s.desc}</p>
        <div class="odds">🎲 ${info}</div>
        <div class="dice-box">${this.renderDice(s, dc)}</div>
        ${this.renderActions(s)}
      </div>`;
    this.bindEvents();
  }

  renderDice(s, dc) {
    const { state } = this.game;
    let baseOdds = s.baseOdds;
    if (s.id.startsWith('h1b_lottery')) {
      baseOdds = this.game.h1bOdds;
    }
    const threshold = 10 - Math.floor(baseOdds * 10);
    
    if (state.diceValues.length) {
      return state.diceValues.map((v, i) => {
        const isChosen = i === state.chosenIndex;
        const isSuccess = v >= threshold;
        return `<span class="dice ${isSuccess?'ok':'fail'} ${isChosen?'chosen':''}">${v}</span>`;
      }).join('');
    }
    return Array(dc).fill(`<span class="dice ${this.rolling?'roll':''}">?</span>`).join('');
  }

  renderActions(s) {
    const { state } = this.game;
    if ((state.showEB5 || state.showMaster) && !state.lastResult) {
      let btns = `<div class="result fail">${s.failMsg}</div>`;
      if (state.showMaster) btns += `<button class="btn btn-roll" id="master">📚 读硕士 (+2年，重新抽签)</button>`;
      if (state.showEB5) btns += `<button class="btn btn-eb5" id="eb5">💎 EB-5投资移民 (80万刀)</button>`;
      btns += `<button class="btn btn-gray" id="next">😢 算了，认命</button>`;
      return btns;
    }
    if (state.lastResult !== undefined) return `<div class="result ${state.lastResult?'ok':'fail'}">${state.lastResult?s.successMsg:s.failMsg}</div><button class="btn btn-roll" id="next">${state.lastResult?'继续前进 →':'查看结果'}</button>`;
    if (state.inPeaceful) return `<button class="btn btn-roll" id="peaceful">😌 平安度过，继续等待</button>`;
    return `<button class="btn btn-roll" id="roll" ${this.rolling?'disabled':''}>🎲 掷骰子！</button>`;
  }

  bindEvents() {
    this.el.querySelector('#roll')?.addEventListener('click', () => this.rollDice());
    this.el.querySelector('#next')?.addEventListener('click', () => { this.game.advance(); this.render(); });
    this.el.querySelector('#eb5')?.addEventListener('click', () => { this.game.chooseEB5(); this.render(); });
    this.el.querySelector('#master')?.addEventListener('click', () => { this.game.chooseMaster(); this.render(); });
    this.el.querySelector('#peaceful')?.addEventListener('click', () => { this.game.advancePeaceful(); this.render(); });
  }

  rollDice() {
    this.rolling = true; this.render();
    let c = 0;
    const iv = setInterval(() => {
      this.el.querySelectorAll('.dice').forEach(d => d.textContent = Math.floor(Math.random() * 10));
      if (++c > 15) { clearInterval(iv); this.rolling = false; this.game.roll(); this.render(); }
    }, 20);
  }
}
