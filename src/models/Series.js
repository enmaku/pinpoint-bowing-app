export default class Series {
  constructor(name = '', location = '', timestamp = null) {
    this._id = 'series_' + Math.random().toString(16).substring(2);
    this._name = name;
    this._location = location;
    this._bowlerIds = [];
    this._games = [];
    this._timestamp = timestamp || new Date();
  }

  addBowler(bowler) {
    if (!this._bowlerIds.includes(bowler._id)) {
      this._bowlerIds.push(bowler._id);
    }
  }

  removeBowler(id) {
    const index = this._bowlerIds.indexOf(id);
    if (index !== -1) {
      this._bowlerIds.splice(index, 1);
    }
  }

  addGame(game) {
    this._games.push(game);
  }

  get id() { return this._id; }
  get name() { return this._name; }
  set name(value) { this._name = value; }
  get location() { return this._location; }
  set location(value) { this._location = value; }
  get bowlerIds() { return this._bowlerIds; }
  get games() { return this._games; }
  get timestamp() { return this._timestamp; }
}
