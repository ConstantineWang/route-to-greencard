import { STAGES, EB5_STAGE, RANDOM_EVENTS, PEACEFUL_YEAR, FIND_JOB_60 } from '../data/stages.js';
import { ENDINGS, ABILITY_LEVELS, MENTAL_LEVELS } from '../data/endings.js';

export class Game {
  constructor() { this.reset(); }

  reset() {
    this.state = {
      phase: 'setup', stageIndex: 0, history: [], h1bAttempts: 0,
      endingType: null, lastResult: undefined, diceValues: [],
      character: { wealth: null, ability: null, age: 22, yearsSpent: 0 }, 
      showEB5: false, isEB5: false, chosenIndex: -1, cheat: false,
      inEvent: null, inFindJob60: false, inWaiting: false, inPeaceful: false,
      waitingYear: 0, waitingTotal: 0
    };
  }

  async submitResult() {
    const { state } = this;
    try {
      await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ending: state.endingType,
          yearsSpent: state.character.yearsSpent,
          startAge: state.character.age,
          finalAge: this.currentAge,
          ability: state.character.ability,
          mental: state.character.mental,
          wealth: state.character.wealth,
          cheat: state.cheat,
          path: state.history.map(h => h.short)
        })
      });
    } catch (e) { console.log('Submit failed:', e); }
  }

  setCharacter(wealth, ability, age, cheat = false, mental = 'normal') {
    this.state.character = { wealth, ability, age, yearsSpent: 0, mental };
    this.state.cheat = cheat;
    this.state.phase = 'playing';
  }

  get canEB5() { return this.state.character.wealth === 'rich' && !this.state.isEB5; }
  
  get currentStage() { 
    if (this.state.inPeaceful) return PEACEFUL_YEAR;
    if (this.state.inEvent) return RANDOM_EVENTS[this.state.inEvent];
    if (this.state.inFindJob60) return FIND_JOB_60;
    if (this.state.isEB5) return EB5_STAGE;
    return STAGES[this.state.stageIndex]; 
  }
  
  get totalStages() { return STAGES.length; }
  get currentAge() { return this.state.character.age + this.state.character.yearsSpent; }
  getEnding(t) { return ENDINGS[t]; }
  getAbility() { return ABILITY_LEVELS[this.state.character.ability]; }
  getMental() { return MENTAL_LEVELS[this.state.character.mental]; }

  roll() {
    const stage = this.currentStage;
    
    // 根据阶段类型选择属性
    let count, pickBest, attrName;
    if (stage.useAbility) {
      const attr = this.getAbility();
      count = attr.diceCount;
      pickBest = attr.pickBest;
      attrName = attr.name;
    } else if (stage.useMental) {
      const attr = this.getMental();
      count = attr.diceCount;
      pickBest = attr.pickBest;
      attrName = attr.name;
    } else {
      count = 1;
      pickBest = true;
      attrName = null;
    }

    const diceValues = Array(count).fill(0).map(() => Math.floor(Math.random() * 10));
    const threshold = 10 - Math.floor(stage.baseOdds * 10);
    
    let chosenIndex = pickBest 
      ? diceValues.indexOf(Math.max(...diceValues))
      : diceValues.indexOf(Math.min(...diceValues));
    
    const success = this.state.cheat ? true : diceValues[chosenIndex] >= threshold;
    if (this.state.cheat) diceValues[chosenIndex] = 9;
    
    this.state.currentThreshold = threshold;

    this.state.diceValues = diceValues;
    this.state.chosenIndex = chosenIndex;
    this.state.lastResult = success;
    
    // 年龄累加
    if (this.state.inEvent || this.state.inWaiting || this.state.inPeaceful) {
      this.state.character.yearsSpent++;
    } else if (!this.state.inFindJob60) {
      this.state.character.yearsSpent += stage.years || 0;
    }
    
    this.state.history.push({ stage: stage.title, success, short: stage.short });
    
    if (stage.id.startsWith('h1b_lottery')) this.state.h1bAttempts++;
    if (!success && this.canEB5 && !this.state.inEvent && !this.state.inPeaceful) {
      this.state.showEB5 = true;
    }
    return success;
  }

  chooseEB5() { 
    this.state.isEB5 = true; 
    this.state.showEB5 = false; 
    this.state.lastResult = undefined; 
    this.state.diceValues = []; 
    this.state.inEvent = null;
    this.state.inFindJob60 = false;
    this.state.inWaiting = false;
    this.state.inPeaceful = false;
  }

  // 随机选择事件或平安年
  rollRandomEvent() {
    const rand = Math.random();
    if (rand < 0.15) return 'layoff';      // 15%裁员
    if (rand < 0.25) return 'family';      // 10%家庭变故
    if (rand < 0.33) return 'health';      // 8%健康危机
    return 'peaceful';                      // 67%平安
  }

  advance() {
    const stage = this.currentStage;
    const success = this.state.lastResult;
    this.state.showEB5 = false;

    // 平安年结果
    if (this.state.inPeaceful) {
      this.state.inPeaceful = false;
      if (this.state.inWaiting) {
        this.advanceWaiting();
      }
      this.state.lastResult = undefined;
      this.state.diceValues = [];
      return;
    }

    // 60天找工作结果
    if (this.state.inFindJob60) {
      this.state.inFindJob60 = false;
      if (!success) {
        this.state.endingType = 'layoff_failed';
        this.state.phase = 'ended';
      } else if (this.state.inWaiting) {
        this.advanceWaiting();
      }
      this.state.lastResult = undefined;
      this.state.diceValues = [];
      return;
    }

    // 随机事件结果
    if (this.state.inEvent) {
      const eventType = this.state.inEvent;
      this.state.inEvent = null;
      
      if (!success) {
        if (eventType === 'layoff') {
          this.state.inFindJob60 = true;
        } else {
          // 家庭/健康事件失败直接结束
          this.state.endingType = RANDOM_EVENTS[eventType].failEnding;
          this.state.phase = 'ended';
        }
      } else if (this.state.inWaiting) {
        this.advanceWaiting();
      }
      this.state.lastResult = undefined;
      this.state.diceValues = [];
      return;
    }

    // 正常阶段结果
    if (!success) {
      if (stage.failEnding) { 
        this.state.endingType = stage.failEnding; 
        this.state.phase = 'ended'; 
      } else {
        this.state.stageIndex++;
      }
    } else {
      if (this.state.isEB5) { 
        this.state.endingType = 'success_eb5'; 
        this.state.phase = 'ended'; 
      } else if (this.state.stageIndex >= STAGES.length - 1) { 
        this.state.endingType = 'success'; 
        this.state.phase = 'ended'; 
      } else {
        if (stage.id.startsWith('h1b_lottery')) {
          while (STAGES[this.state.stageIndex + 1]?.id.startsWith('h1b_lottery')) {
            this.state.stageIndex++;
          }
        }
        
        // I-140通过后进入排期等待
        if (stage.waitingYears) {
          this.state.inWaiting = true;
          this.state.waitingYear = 0;
          this.state.waitingTotal = stage.waitingYears;
          this.state.stageIndex++;
          this.triggerYearEvent();
          this.state.lastResult = undefined;
          this.state.diceValues = [];
          return;
        }
        
        this.state.stageIndex++;
      }
    }
    
    this.state.lastResult = undefined;
    this.state.diceValues = [];
  }

  triggerYearEvent() {
    const event = this.rollRandomEvent();
    if (event === 'peaceful') {
      this.state.inPeaceful = true;
    } else {
      this.state.inEvent = event;
    }
  }

  advancePeaceful() {
    this.state.character.yearsSpent++;
    this.state.history.push({ stage: PEACEFUL_YEAR.title, success: true, short: PEACEFUL_YEAR.short });
    this.state.inPeaceful = false;
    if (this.state.inWaiting) {
      this.advanceWaiting();
    }
  }

  advanceWaiting() {
    this.state.waitingYear++;
    if (this.state.waitingYear >= this.state.waitingTotal) {
      this.state.inWaiting = false;
    } else {
      this.triggerYearEvent();
    }
  }

  skipInvalid() {
    if (this.state.inEvent || this.state.inFindJob60 || this.state.inWaiting || this.state.inPeaceful) return;
    const s = this.currentStage;
    if (s.id === 'h1b_lottery_2' && this.state.h1bAttempts === 0) { this.state.stageIndex++; this.skipInvalid(); }
    if (s.id === 'h1b_lottery_3' && this.state.h1bAttempts <= 1) { this.state.stageIndex++; this.skipInvalid(); }
  }
}
