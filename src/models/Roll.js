export default class Roll {
  constructor(rollNumber) {
    this._rollNumber = rollNumber;
    this._pins = 0;
    this._strike = false;
    this._spare = false;
    this._split = false;
  }

  get rollNumber() {
    return this._rollNumber;
  }

  get pins() {
    return this._pins;
  }

  set pins(pins) {
    this._pins = pins;
  }

  get strike() {
    return this._strike;
  }

  set strike(strike) {
    this._strike = strike;
  }

  get spare() {
    return this._spare;
  }

  set spare(spare) {
    this._spare = spare;
  }

  get split() {
    return this._split;
  }

  set split(split) {
    this._split = split;
  }
}
