import ScoreCard from './ScoreCard';

export default class Game {
  constructor() {
    this._id = 'game_' + Math.random().toString(16).slice(2);
    this._name = 'New Game';
    this._bowlerIds = [];
    this._scorecards = [];
    this._timestamp = new Date().toLocaleString();
  }

  addBowler(bowler) {
    this._bowlerIds.push(bowler.id);
    const scorecard = new ScoreCard(bowler);
    this._scorecards.push(scorecard);
    return scorecard;
  }

  removeBowler(id) {
    const index = this._bowlerIds.indexOf(id);
    if (index !== -1) {
      this._bowlerIds.splice(index, 1);
      this._scorecards.splice(index, 1);
    }
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get timestamp() {
    return this._timestamp;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get bowlerIds() {
    return this._bowlerIds;
  }

  get scorecards() {
    return this._scorecards;
  }
}
