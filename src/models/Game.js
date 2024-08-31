import ScoreCard from "./ScoreCard";

export default class Game {
  constructor() {
    this._id = 'game_' + Math.random().toString(16).slice(2);
    this._name = 'New Game';
    this._bowlers = [];
    this._scoreCards = [];
    this._timestamp = new Date().toLocaleString();
  }

  addBowler(bowler) {
    this._bowlers.push(bowler.id);
    this._scoreCards.push(new ScoreCard(bowler));
  }

  removeBowler(id) {
    const index = this._bowlers.map(bowler => bowler.id).indexOf(id);
    ~index && this._bowlers.splice(index, 1);
  }

  get id() {
    return this._id;
  }

  get timestamp() {
    return this._timestamp;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get bowlers() {
    return this._bowlers;
  }

  get scoreCards() {
    return this._scoreCards;
  }
}
