import Roll from './Roll';

export default class Frame {
  constructor(frameNumber, numRolls) {
    this._frameNumber = frameNumber;
    this._rolls = [];
    for (let i = 1; i <= numRolls; i++) {
      this._rolls.push(new Roll(i));
    }
    this._frameScore = '-';
  }

  get frameNumber() { return this._frameNumber; }
  get rolls() { return this._rolls; }
  get frameScore() { return this._frameScore; }
  set frameScore(value) { this._frameScore = value; }

  getCurrentRoll() {
    for (const roll of this._rolls) {
      if (roll.pins === undefined || roll.pins === null) {
        return roll.rollNumber;
      }
    }
    return null;
  }

  setRollScore(rollNumber, value, pinData = null, split = false) {
    // For non-10th frames, if first roll was a strike, don't allow second roll
    if (this._frameNumber !== 10 && rollNumber === 2) {
      const firstRoll = this._rolls.find(r => r.rollNumber === 1);
      if (firstRoll && firstRoll.strike) {
        return;
      }
    }

    const roll = this._rolls.find(r => r.rollNumber === rollNumber);
    if (!roll) return;

    roll.pins = value;
    roll.pinData = pinData;
    roll.split = split;

    // Handle strikes and spares
    if (this._frameNumber === 10) {
      if (rollNumber === 1 && value === 10) {
        roll.strike = true;
      } else if (rollNumber === 2) {
        const prevRoll = this._rolls.find(r => r.rollNumber === 1);
        if (prevRoll) {
          if (value === 10 && prevRoll.strike) {
            roll.strike = true;  // Second 10 after a strike is always a strike
          } else if (value + (prevRoll.pins || 0) === 10 && !prevRoll.strike) {
            roll.spare = true;
          }
        }
      } else if (rollNumber === 3) {
        const prevRoll = this._rolls.find(r => r.rollNumber === 2);
        if (prevRoll && (prevRoll.strike || prevRoll.spare)) {
          if (value === 10) {
            roll.strike = true;  // Third 10 after strike/spare is a strike
          }
        }
      }
    } else {
      if (rollNumber === 1 && value === 10) {  
        roll.strike = true;
      } else if (rollNumber === 2) {
        const firstRoll = this._rolls.find(r => r.rollNumber === 1);
        if (firstRoll && value + (firstRoll.pins || 0) === 10) {
          roll.spare = true;
        }
      }
    }
  }
}
