import Roll from "./Roll";

export default class Frame {
  constructor(
    frameNumber,
    numRolls
  ) {
    this._frameNumber = frameNumber;
    this._rolls = [];
    for (let i = 1; i <= numRolls; i++) {
      this._rolls.push(new Roll(i));
    };
    this._frameScore = '-';
  }

  getRollScores() {
    return this._rolls;
  }

  setRollScore(rollNumber, value, split = false) {
    const rollIndex = this._rolls.map(roll => roll.rollNumber).indexOf(rollNumber);
    this._rolls[rollIndex].pins = value;
    if ((rollNumber == 1 || rollNumber == 3) && value == 10) {
      this._rolls[rollIndex].strike = true;
    }
    if (rollNumber == 2 && value > 0) {
      const firstRollIndex = this._rolls.map(roll => roll.rollNumber).indexOf(1);
      const firstRollValue = this._rolls[firstRollIndex].pins;
      if (value + firstRollValue == 10) {
        this._rolls[rollIndex].spare = true;
      }
    }
    if (split) {
      this._rolls[rollIndex].split = true;
    }
    if (this._frameNumber == 10) {
      if (rollNumber == 1 && value == 10) {
        this._rolls[rollIndex].strike = true;
      }
      if (rollNumber >= 2) {
        const previousRollIndex = this._rolls.map(roll => roll.rollNumber).indexOf(rollNumber - 1);
        const previousValue = this._rolls[previousRollIndex].pins;
        if (value == 10 && previousValue > 0) {
          this._rolls[rollIndex].strike = true;
        }
        if (value != 10 && value + previousValue == 10) {
          this._rolls[rollIndex].spare = true;
        }
      }
    }
  }

  get id() {
    return this._id;
  }

  get frameNumber() {
    return this._frameNumber;
  }

  get rolls() {
    return this._rolls;
  }

  get frameScore() {
    return this._frameScore;
  }

  set frameScore(score) {
    this._frameScore = score;
  }
}
