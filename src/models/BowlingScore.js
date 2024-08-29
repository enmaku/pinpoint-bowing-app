export default class BowlingScore {
  constructor(gamedata = '---------------------') {
    if (gamedata.length !== 21) {
      throw new Error('Invalid scoring data')
    }
    this._gamedata = gamedata;
  }

  getFrame(frameNumber) {
    frameNumber -= 1;
    const start = frameNumber * 2;
    const end = frameNumber < 9 ? start + 2 : 21;
    return String(this._gamedata).substring(start, end);
  }

  getFrameScore(frameNumber) {
    return '-';
  }

  get gamedata() {
    return this._gamedata;
  }

  set gamedata(gamedata) {
    this._gamedata = gamedata;
  }
}
