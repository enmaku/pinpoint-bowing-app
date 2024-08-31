export default class Bowler {
  constructor() {
    this._id = 'bowler_' + Math.random().toString(16).slice(2);
    this._name = '';
    this._games = [];
    this._color = 'red';
  }

  addGame(id) {
    this._games.push(id);
  }

  removeGame(id) {
    const index = this._games.map(game => game.id).indexOf(id);
    ~index && this._games.splice(index, 1);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get color() {
    return this._color;
  }

  set color(color) {
    this._color = color;
  }

  get games() {
    return this._games;
  }
}
