import { STAGES, EB5_STAGE } from '../data/stages.js';
import { ENDINGS, ABILITY_LEVELS } from '../data/endings.js';

export class Game {
  constructor() { this.reset(); }

  reset() {
    this.state = {
      phase: 'setup', stageIndex: 0, history: [], h1bAttempts: 0,
      endingType: null, lastResult: undefined, lastRolls: [], diceValues: [],
      character: { wealth: null, ability: null, age: 22 }, showEB5: false, isEB5: false,
      chosenIndex: -1
    };
  }

  setCharacter(wealth, ability, age) {
    this.state.character = { wealth, ability, age };
    this.state.phase = 'playing';
  }

  get canEB5() { return this.state.character.wealth === 'rich' && !this.state.isEB5; }
  get currentStage() { return this.state.isEB5 ? EB5_STAGE : STAGES[this.state.stageIndex]; }
  get totalStages() { return STAGES.length; }
  getEnding(t) { return ENDINGS[t]; }
  getAbility() { return ABILITY_LEVELS[this.state.character.ability]; }

  roll() {
    const stage = this.currentStage;
    const ability = this.getAbility();
    const count = stage.useAbility ? ability.diceCount : 1;
    const pickBest = stage.useAbility ? ability.pickBest : true;

    const diceValues = Array(count).fill(0).map(() => Math.floor(Math.random() * 10));
    const threshold = Math.floor(stage.baseOdds * 10);
    
    let chosenIndex;
    if (pickBest) {
      chosenIndex = diceValues.indexOf(Math.min(...diceValues));
    } else {
      chosenIndex = diceValues.indexOf(Math.max(...diceValues));
    }
    
    const success = diceValues[chosenIndex] < threshold;

    this.state.diceValues = diceValues;
    this.state.threshold = threshold;
    this.state.chosenIndex = chosenIndex;
    this.state.lastResult = success;
    this.state.history.push({ stage: stage.title, success, isEB5: this.state.isEB5, short: stage.short });
    
    if (stage.id.startsWith('h1b_lottery')) this.state.h1bAttempts++;
    if (!success && this.canEB5) this.state.showEB5 = true;
    return success;
  }

  chooseEB5() { this.state.isEB5 = true; this.state.showEB5 = false; this.state.lastResult = undefined; this.state.lastRolls = []; this.state.diceValues = []; }

  advance() {
    const stage = this.currentStage;
    const success = this.state.lastResult;
    this.state.showEB5 = false;

    if (!success) {
      if (stage.failEnding) { this.state.endingType = stage.failEnding; this.state.phase = 'ended'; }
      else this.state.stageIndex++;
    } else {
      if (this.state.isEB5) { this.state.endingType = 'success_eb5'; this.state.phase = 'ended'; }
      else if (this.state.stageIndex >= STAGES.length - 1) { this.state.endingType = 'success'; this.state.phase = 'ended'; }
      else {
        if (stage.id.startsWith('h1b_lottery')) while (STAGES[this.state.stageIndex + 1]?.id.startsWith('h1b_lottery')) this.state.stageIndex++;
        this.state.stageIndex++;
      }
    }
    this.state.lastResult = undefined;
    this.state.lastRolls = [];
    this.state.diceValues = [];
  }

  skipInvalid() {
    const s = this.currentStage;
    if (s.id === 'h1b_lottery_2' && this.state.h1bAttempts === 0) { this.state.stageIndex++; this.skipInvalid(); }
    if (s.id === 'h1b_lottery_3' && this.state.h1bAttempts <= 1) { this.state.stageIndex++; this.skipInvalid(); }
  }
}
