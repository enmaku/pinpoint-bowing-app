// Pin adjacency matrix - each pin's index (1-based) maps to array of adjacent pin indices
const PIN_ADJACENCY = {
  1: [2, 3],
  2: [1, 3, 4, 5],      // Horizontal and diagonal connections
  3: [1, 2, 5, 6],      // Horizontal and diagonal connections
  4: [2, 5, 7, 8],      // Horizontal and diagonal connections
  5: [2, 3, 4, 6, 8, 9],// Horizontal and diagonal connections
  6: [3, 5, 9, 10],     // Horizontal and diagonal connections
  7: [4, 8],            // Horizontal connection
  8: [4, 5, 7, 9],      // Horizontal and diagonal connections
  9: [5, 6, 8, 10],     // Horizontal and diagonal connections
  10: [6, 9]            // Horizontal and diagonal connections
};

export default class Roll {
  constructor(rollNumber) {
    this._rollNumber = rollNumber;
    this._pins = null;
    this._strike = false;
    this._spare = false;
    this._split = false;
    this._pinData = null;
    this._foul = false;
  }

  // Helper function to convert pin array to indices
  _pinArrayToIndices(pinArray) {
    return pinArray
      .map((value, index) => value === 1 ? index + 1 : -1)
      .filter(index => index !== -1);
  }

  // Helper function to count pins down
  _countPinsDown(pinData) {
    return pinData.filter(pin => pin === 0).length;
  }

  // Calculate if the current pin configuration is a split
  _calculateSplit(pinData) {
    // Convert to 1-based indices of standing pins
    const standingPins = this._pinArrayToIndices(pinData);

    // Basic split requirements:
    // 1. Headpin (pin 1) must be down
    if (pinData[0] === 1) return false;

    // 2. Need at least 2 standing pins
    if (standingPins.length < 2) return false;

    // 3. Total pins down must be between 2 and 8
    const pinsDown = this._countPinsDown(pinData);
    if (pinsDown < 2 || pinsDown > 8) return false;

    // Check if standing pins are separated by at least one downed pin
    for (let i = 0; i < standingPins.length; i++) {
      for (let j = i + 1; j < standingPins.length; j++) {
        const pin1 = standingPins[i];
        const pin2 = standingPins[j];

        // Check if these pins are connected through any path of standing pins
        const visited = new Set();
        const stack = [pin1];

        while (stack.length > 0) {
          const currentPin = stack.pop();
          if (currentPin === pin2) {
            // Found a path of standing pins - not a split
            return false;
          }

          visited.add(currentPin);

          // Add all standing adjacent pins that haven't been visited
          const adjacentPins = PIN_ADJACENCY[currentPin] || [];
          for (const adjPin of adjacentPins) {
            if (!visited.has(adjPin) && pinData[adjPin - 1] === 1) {
              stack.push(adjPin);
            }
          }
        }
      }
    }

    return true;
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
    // Only allow manual split setting if there's no pin data
    if (this._pinData === null) {
      this._split = split;
    }
  }

  get foul() {
    return this._foul;
  }

  set foul(foul) {
    this._foul = foul;
  }

  get pinData() {
    if (this._pinData == null) {
      return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    return this._pinData;
  }

  set pinData(pinData) {
    this._pinData = pinData;
    if (pinData !== null) {
      // Automatically calculate and set split based on pin data
      this._split = this._calculateSplit(pinData);
      
      // Update pins count
      this._pins = this._countPinsDown(pinData);
      
      // Update strike/spare status based on pin count
      if (this._rollNumber === 0) {
        this._strike = this._pins === 10;
      }
    }
  }
}
