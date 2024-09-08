export default class Roll {
  constructor(rollNumber) {
    this._rollNumber = rollNumber;
    this._pins = null;
    this._strike = false;
    this._spare = false;
    this._split = false;
    this._pinData = null;
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

  get pinData() {
    if (this._pinData == null) {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    return this._pinData;
  }

  set pinData(pinData) {
    if (this._pinData == null) {
      this._pinData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this._pinData = pinData;
  }
}
