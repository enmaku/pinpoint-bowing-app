import Frame from "./Frame";

export default class ScoreCard {
  constructor(bowler) {
    this._bowlerId = bowler.id;
    this._bowlerName = bowler.name;
    this._bowlerColor = bowler.color;
    this._frames = [
      new Frame(1, 2), new Frame(2, 2), new Frame(3, 2), new Frame(4, 2), new Frame(5, 2),
      new Frame(6, 2), new Frame(7, 2), new Frame(8, 2), new Frame(9, 2), new Frame(10, 3)
    ];
  }

  setScore(frameNumber, rollNumber, value) {
    const frameIndex = this._frames.map(frame => frame.frameNumber).indexOf(frameNumber);
    this._frames[frameIndex].setRollScore(rollNumber, value);
    this.updateFrameScores();
  }

  updateFrameScores() {
    for (let f = 1; f <= 9; f++) {
      const frameIndex = this._frames.map(frame => frame.frameNumber).indexOf(f);
      this._frames[frameIndex].frameScore = 0;
    }
    let score = 0;
    for (let f = 1; f <= 9; f++) {
      const frameIndex = this._frames.map(frame => frame.frameNumber).indexOf(f);
      let frameScore = 0;
      for (let r = 1; r <= 2; r++) {
        const rollIndex = this._frames[frameIndex].rolls.map(roll => roll.rollNumber).indexOf(r);
        frameScore += this._frames[frameIndex].rolls[rollIndex].pins;
        if (this._frames[frameIndex].rolls[rollIndex].strike || this._frames[frameIndex].rolls[rollIndex].spare) {
          const nextFrameIndex = this._frames.map(frame => frame.frameNumber).indexOf(f + 1);
          const roll1Index = this._frames[nextFrameIndex].rolls.map(roll => roll.rollNumber).indexOf(1);
          frameScore += this._frames[nextFrameIndex].rolls[roll1Index].pins;
          if (this._frames[frameIndex].rolls[rollIndex].strike) {
            const roll2Index = this._frames[nextFrameIndex].rolls.map(roll => roll.rollNumber).indexOf(2);
            frameScore += this._frames[nextFrameIndex].rolls[roll2Index].pins;
          }
        }
      }
      score += frameScore

      this._frames[frameIndex].frameScore = score;
    };
    const finalFrameIndex = this._frames.map(frame => frame.frameNumber).indexOf(10);
    let frameScore = 0;
    for (let r = 1; r <= 3; r++) {
      const rollIndex = this._frames[finalFrameIndex].rolls.map(roll => roll.rollNumber).indexOf(r);
      score += this._frames[finalFrameIndex].rolls[rollIndex].pins;
      if (this._frames[finalFrameIndex].rolls[rollIndex].spare || this._frames[finalFrameIndex].rolls[rollIndex].strike) {
        if (r <= 2) {
          const roll1Index = this._frames[finalFrameIndex].rolls.map(roll => roll.rollNumber).indexOf(r + 1);
          frameScore += this._frames[finalFrameIndex].rolls[roll1Index].pins;
          if (this._frames[finalFrameIndex].rolls[rollIndex].strike && r == 1) {
            const roll2Index = this._frames[finalFrameIndex].rolls.map(roll => roll.rollNumber).indexOf(r + 2);
            frameScore += this._frames[finalFrameIndex].rolls[roll2Index].pins;
          }
        }
      }
    }
    this._frames[finalFrameIndex].frameScore = score;
  }

  get finalScore() {
    this.updateFrameScores();
    const finalFrameIndex = this._frames.map(frame => frame.frameNumber).indexOf(10);
    return this._frames[finalFrameIndex].frameScore;
  }

  get bowlerId() {
    return this._bowlerId;
  }

  get bowlerName() {
    return this._bowlerName;
  }

  get bowlerColor() {
    return this._bowlerColor;
  }

  get frames() {
    return this._frames;
  }
}
