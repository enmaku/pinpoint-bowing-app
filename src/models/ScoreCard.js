import Frame from './Frame';

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

  get bowlerId() { return this._bowlerId; }
  get bowlerName() { return this._bowlerName; }
  get bowlerColor() { return this._bowlerColor; }
  get frames() { return this._frames; }

  get cumulativeScores() {
    const scores = [];
    let runningTotal = 0;
    
    for (let i = 0; i < this._frames.length; i++) {
      const frame = this._frames[i];
      const rolls = frame.rolls;
      
      // Special handling for 10th frame
      if (frame.frameNumber === 10) {
        const firstRoll = rolls[0];
        const secondRoll = rolls[1];
        const thirdRoll = rolls[2];
        
        // Can't calculate until we have at least the first roll
        if (!firstRoll || firstRoll.pins === undefined) {
          scores.push(null);
          continue;
        }
        
        let frameScore = 0;
        
        // First roll strike
        if (firstRoll.strike) {
          // Need all three rolls
          if (!secondRoll || secondRoll.pins === undefined || !thirdRoll || thirdRoll.pins === undefined) {
            scores.push(null);
            continue;
          }
          // Strike bonus: count next two rolls
          frameScore = 10 + (secondRoll.foul ? 0 : (secondRoll.pins || 0)) + 
                           (thirdRoll.foul ? 0 : (thirdRoll.pins || 0));
        } else {
          // Not a strike, need second roll
          if (!secondRoll || secondRoll.pins === undefined) {
            scores.push(null);
            continue;
          }
          
          const firstTwoRollsTotal = (firstRoll.foul ? 0 : (firstRoll.pins || 0)) + 
                                   (secondRoll.foul ? 0 : (secondRoll.pins || 0));
          
          if (firstTwoRollsTotal === 10) { // Spare
            // Need third roll for spare bonus
            if (!thirdRoll || thirdRoll.pins === undefined) {
              scores.push(null);
              continue;
            }
            // Spare bonus: count next roll
            frameScore = 10 + (thirdRoll.foul ? 0 : (thirdRoll.pins || 0));
          } else {
            // Open frame, just count the pins
            frameScore = firstTwoRollsTotal;
          }
        }
        
        runningTotal += frameScore;
        scores.push(runningTotal);
        continue;
      }
      
      // For frames 1-9, calculate score with bonuses
      const firstRoll = rolls[0];
      const secondRoll = rolls[1];
      
      // Can't calculate frame score until we have the first roll
      if (!firstRoll || firstRoll.pins === undefined) {
        scores.push(null);
        continue;
      }
      
      let frameScore = firstRoll.foul ? 0 : (firstRoll.pins || 0);
      
      if (firstRoll.strike) {
        // Strike - need next two rolls
        const nextRolls = this.getNextTwoRolls(i);
        if (nextRolls.length < 2) {
          scores.push(null); // Need more rolls to calculate
          continue;
        }
        frameScore = 10 + nextRolls.reduce((sum, roll) => sum + (roll.foul ? 0 : (roll.pins || 0)), 0);
      } else {
        // Not a strike - need second roll of this frame
        if (!secondRoll || secondRoll.pins === undefined) {
          scores.push(null);
          continue;
        }
        frameScore += secondRoll.foul ? 0 : (secondRoll.pins || 0);
        
        if (frameScore === 10) { // Spare
          const nextRoll = this.getNextRoll(i);
          if (!nextRoll || nextRoll.pins === undefined) {
            scores.push(null); // Need next roll to calculate
            continue;
          }
          frameScore += nextRoll.foul ? 0 : (nextRoll.pins || 0);
        }
      }
      
      runningTotal += frameScore;
      scores.push(runningTotal);
    }
    
    return scores;
  }
  
  getNextRoll(frameIndex) {
    const nextFrame = this._frames[frameIndex + 1];
    return nextFrame?.rolls[0];
  }
  
  getNextTwoRolls(frameIndex) {
    const rolls = [];
    const nextFrame = this._frames[frameIndex + 1];
    
    if (nextFrame) {
      const firstRoll = nextFrame.rolls[0];
      if (firstRoll && firstRoll.pins !== undefined) {
        rolls.push(firstRoll);
        
        if (firstRoll.strike && frameIndex < 8) {
          // If next roll is a strike and we're not on frame 9,
          // get first roll of next next frame
          const nextNextFrame = this._frames[frameIndex + 2];
          const nextNextFirstRoll = nextNextFrame?.rolls[0];
          if (nextNextFirstRoll && nextNextFirstRoll.pins !== undefined) {
            rolls.push(nextNextFirstRoll);
          }
        } else {
          // Otherwise get second roll of next frame
          const secondRoll = nextFrame.rolls[1];
          if (secondRoll && secondRoll.pins !== undefined) {
            rolls.push(secondRoll);
          }
        }
      }
    }
    
    return rolls;
  }

  get finalScore() {
    const scores = this.cumulativeScores;
    return scores.length > 0 ? scores[scores.length - 1] : 0;
  }

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
    }
  }
}
