import { ABILITY_LEVELS, WEALTH_LEVELS, AGE_COMMENTS } from '../data/endings.js';

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
      <div class="card"><div class="stage-title">👤 创建角色</div></div>
      <div class="card">
        <h3>🎂 毕业年龄</h3>
        <div class="age-input">
          <input type="number" id="age" min="20" max="35" value="22" style="width:80px;padding:10px;font-size:1.2em;border-radius:8px;border:none;text-align:center">
          <span style="margin-left:10px;color:#aaa">岁 (硕士毕业)</span>
        </div>
      </div>
      <div class="card">
        <h3>💰 家庭资产</h3>
        <div class="opts">${Object.entries(WEALTH_LEVELS).map(([k,v])=>`
          <label class="opt"><input type="radio" name="w" value="${k}"><span>${v.name}</span>${v.canEB5?'<small class="gold">解锁EB-5</small>':''}</label>
        `).join('')}</div>
      </div>
      <div class="card">
        <h3>📚 做题家能力</h3><p class="hint">影响找工作，请诚实评估</p>
        <div class="opts">${Object.entries(ABILITY_LEVELS).map(([k,v])=>`
          <label class="opt"><input type="radio" name="a" value="${k}"><span>${v.name}</span><small>${v.desc}</small>${v.warn?`<small class="warn">${v.warn}</small>`:''}</label>
        `).join('')}</div>
      </div>
      <button class="btn btn-roll" id="start" disabled>🚀 开始</button>`;
    const btn = this.el.querySelector('#start');
    const check = () => {
      btn.disabled = !this.el.querySelector('input[name="w"]:checked') || !this.el.querySelector('input[name="a"]:checked');
    };
    this.el.querySelectorAll('input[type="radio"]').forEach(r => r.onchange = check);
    btn.onclick = () => {
      const age = parseInt(this.el.querySelector('#age').value) || 22;
      this.game.setCharacter(
        this.el.querySelector('input[name="w"]:checked').value,
        this.el.querySelector('input[name="a"]:checked').value,
        age
      );
      this.render();
    };
  }

  renderEnd() {
    const { state } = this.game;
    const e = this.game.getEnding(state.endingType);
    const finalAge = state.character.age + e.years;
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
        <p class="gold">📅 ~${e.years}年 | 🎂 ${state.character.age}岁 → ${finalAge}岁</p>
        ${ageComment ? `<p style="margin-top:15px;color:${finalAge<30?'#4caf50':'#f5576c'}">${ageComment}</p>` : ''}
        <button class="btn btn-restart" id="re">🔄 再来</button>
      </div>`;
    this.el.querySelector('#re').onclick = () => { this.game.reset(); this.render(); };
  }

  renderStage() {
    const { state } = this.game;
    const s = this.game.currentStage;
    const ab = this.game.getAbility();
    const dc = s.useAbility ? ab.diceCount : 1;
    const threshold = Math.floor(s.baseOdds * 10);
    const info = s.useAbility ? `${dc}骰取${ab.pickBest?'最小':'最大'} (<${threshold}成功)` : `<${threshold}成功`;

    this.el.innerHTML = `
      ${state.history.length?`
        <div class="card">
          <div class="path">${state.history.map(h=>`
            <div class="path-item ${h.success?'ok':'fail'}">
              <span class="dot ${h.success?'ok':'fail'}"></span>
              <span class="path-label">${h.short}</span>
            </div>
          `).join('')}
          <div class="path-item now"><span class="dot now"></span><span class="path-label">${s.short}</span></div>
          </div>
        </div>
      `:''}
      <div class="card">
        <div class="status">
          <span>📍 ${state.isEB5?'EB-5':`${state.stageIndex+1}/${this.game.totalStages}`}</span>
          <span>🎂 ${state.character.age}岁</span>
          <span>${ABILITY_LEVELS[state.character.ability].name}</span>
        </div>
      </div>
      <div class="card">
        <div class="stage-title">${s.title}</div><p class="desc">${s.desc}</p>
        <div class="odds">🎲 ${s.oddsText}<br><small class="gold">D10: ${info}</small></div>
        <div class="dice-box">${this.renderDice(s, dc)}</div>
        ${this.renderActions(s)}
      </div>`;
    this.bindEvents();
  }

  renderDice(s, dc) {
    const { state } = this.game;
    const threshold = Math.floor(s.baseOdds * 10);
    
    if (state.diceValues.length) {
      return state.diceValues.map((v, i) => {
        const isChosen = i === state.chosenIndex;
        const isSuccess = v < threshold;
        return `<span class="dice ${isSuccess?'ok':'fail'} ${isChosen?'chosen':''}">${v}</span>`;
      }).join('');
    }
    return Array(dc).fill(`<span class="dice ${this.rolling?'roll':''}">?</span>`).join('');
  }

  renderActions(s) {
    const { state } = this.game;
    if (state.showEB5 && !state.lastResult) return `<div class="result fail">${s.failMsg}</div><p class="gold">💰 要走EB-5吗？</p><button class="btn btn-eb5" id="eb5">💎 EB-5 (80万刀)</button><button class="btn btn-gray" id="next">😢 算了</button>`;
    if (state.lastResult !== undefined) return `<div class="result ${state.lastResult?'ok':'fail'}">${state.lastResult?s.successMsg:s.failMsg}</div><button class="btn btn-roll" id="next">${state.lastResult?'继续 →':'继续'}</button>`;
    return `<button class="btn btn-roll" id="roll" ${this.rolling?'disabled':''}>🎲 掷骰子！</button>`;
  }

  bindEvents() {
    this.el.querySelector('#roll')?.addEventListener('click', () => this.rollDice());
    this.el.querySelector('#next')?.addEventListener('click', () => { this.game.advance(); this.render(); });
    this.el.querySelector('#eb5')?.addEventListener('click', () => { this.game.chooseEB5(); this.render(); });
  }

  rollDice() {
    this.rolling = true; this.render();
    let c = 0;
    const iv = setInterval(() => {
      this.el.querySelectorAll('.dice').forEach(d => d.textContent = Math.floor(Math.random() * 10));
      if (++c > 15) { clearInterval(iv); this.rolling = false; this.game.roll(); this.render(); }
    }, 80);
  }
}
