import Frame from './Frame';

export default class ScoreCard {
  constructor(bowler) {
    this._bowlerId = bowler.id;
    this._bowlerName = bowler.name;
    this._bowlerColor = bowler.color;
    this._scores = {};
    this.scores = this._scores;
    this._frames = [
      new Frame(1, 2), new Frame(2, 2), new Frame(3, 2), new Frame(4, 2), new Frame(5, 2),
      new Frame(6, 2), new Frame(7, 2), new Frame(8, 2), new Frame(9, 2), new Frame(10, 3)
    ];
  }

  get bowlerId() { return this._bowlerId; }
  get bowlerName() { return this._bowlerName; }
  get bowlerColor() { return this._bowlerColor; }
  get frames() { return this._frames; }
  get scores() { return this._scores; }
  set scores(value) { this._scores = value; }

  getCurrentFrame() {
    for (const frame of this._frames) {
      for (const roll of frame.rolls) {
        if (roll.pins === undefined || roll.pins === null) {
          return frame;
        }
      }
    }
    return null;
  }

  setScore(frameNumber, rollNumber, value, pinData, split) {
    const frame = this._frames.find(f => f.frameNumber === frameNumber);
    if (frame) {
      frame.setRollScore(rollNumber, value, pinData, split);
      this.updateFrameScores();
    }
  }

  updateFrameScores() {
    for (let f = 1; f <= 9; f++) {
      const frame = this._frames.find(frame => frame.frameNumber === f);
      if (frame) frame.frameScore = 0;
    }
    let score = 0;

    for (let f = 1; f <= 9; f++) {
      const frame = this._frames.find(frame => frame.frameNumber === f);
      if (!frame) continue;

      let frameScore = 0;
      for (let r = 1; r <= 2; r++) {
        const roll = frame.rolls.find(roll => roll.rollNumber === r);
        if (!roll) continue;

        frameScore += roll.pins || 0;
        if (roll.strike || roll.spare) {
          const nextFrame = this._frames.find(frame => frame.frameNumber === f + 1);
          if (nextFrame) {
            const nextRoll1 = nextFrame.rolls.find(roll => roll.rollNumber === 1);
            if (nextRoll1) frameScore += nextRoll1.pins || 0;

            if (roll.strike) {
              const nextRoll2 = nextFrame.rolls.find(roll => roll.rollNumber === 2);
              if (nextRoll2) frameScore += nextRoll2.pins || 0;
            }
          }
        }
      }
      score += frameScore;
      frame.frameScore = score;
    }

    // Handle final frame
    const finalFrame = this._frames.find(frame => frame.frameNumber === 10);
    if (finalFrame) {
      for (let r = 1; r <= 3; r++) {
        const roll = finalFrame.rolls.find(roll => roll.rollNumber === r);
        if (roll) score += roll.pins || 0;
      }
      finalFrame.frameScore = score;
    }
  }

  get finalScore() {
    this.updateFrameScores();
    const finalFrame = this._frames.find(frame => frame.frameNumber === 10);
    return finalFrame.frameScore;
  }
}
