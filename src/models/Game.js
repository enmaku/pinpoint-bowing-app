import ScoreCard from './ScoreCard';

export default class Game {
  constructor(seriesId = null) {
    this._id = 'game_' + Math.random().toString(16).slice(2);
    this._seriesId = seriesId;
    this._scorecards = [];
    this._timestamp = new Date();
  }

  addScorecard(bowler) {
    const scorecard = new ScoreCard(bowler);
    this._scorecards.push(scorecard);
    return scorecard;
  }

  removeScorecard(bowlerId) {
    const index = this._scorecards.findIndex(sc => sc._bowlerId === bowlerId);
    if (index !== -1) {
      this._scorecards.splice(index, 1);
    }
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  get seriesId() {
    return this._seriesId;
  }

  get scorecards() {
    return this._scorecards;
  }
}
