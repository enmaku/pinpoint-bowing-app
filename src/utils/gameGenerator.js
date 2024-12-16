import Roll from 'src/models/Roll';
import { useBowlingStore } from 'src/stores/bowling-store';

// Pin layout (triangle formation):
//    7 8 9 10
//     4 5 6
//      2 3
//       1

// Pin positions for visualization
const PIN_POSITIONS = [
  { x: 0, y: 0 },     // Pin 1
  { x: -0.5, y: 1 },  // Pin 2
  { x: 0.5, y: 1 },   // Pin 3
  { x: -1, y: 2 },    // Pin 4
  { x: 0, y: 2 },     // Pin 5
  { x: 1, y: 2 },     // Pin 6
  { x: -1.5, y: 3 },  // Pin 7
  { x: -0.5, y: 3 },  // Pin 8
  { x: 0.5, y: 3 },   // Pin 9
  { x: 1.5, y: 3 }    // Pin 10
];

// Count the number of pins down in a pin configuration
function countPinsDown(pinData) {
  return pinData.filter(pin => pin === 0).length;
}

// Calculate distance between two points
function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Generate a pin configuration with the specified number of pins down
function generatePinConfiguration(pinsDown, skill) {
  const pinData = Array(10).fill(1); // Start with all pins up

  if (pinsDown === 0) return { pinData, knockedDownPositions: [] };
  if (pinsDown === 10) return { pinData: pinData.fill(0), knockedDownPositions: PIN_POSITIONS };

  // Always consider pin 1 (headpin) first
  if (Math.random() < 0.8) { // 80% chance to hit headpin
    pinData[0] = 0;
    pinsDown--;
  }

  // Create a weighted list of pins to potentially knock down
  let potentialPins = [];
  for (let i = 1; i < 10; i++) {
    if (pinData[i] === 1) { // If pin is still standing
      // Calculate the minimum distance to any fallen pin
      let minDistance = Infinity;
      for (let j = 0; j < 10; j++) {
        if (pinData[j] === 0) { // If this pin is down
          const distance = calculateDistance(PIN_POSITIONS[i], PIN_POSITIONS[j]);
          minDistance = Math.min(minDistance, distance);
        }
      }

      // Weight based on distance to nearest fallen pin and skill
      // Closer pins are more likely to fall
      const distanceWeight = minDistance === Infinity ? 1 : 1 / (minDistance * 2);
      const weight = (distanceWeight + skill) * 10;

      // Add the pin multiple times based on weight to increase its probability
      for (let w = 0; w < weight; w++) {
        potentialPins.push(i);
      }
    }
  }

  // Knock down remaining pins randomly from weighted list
  while (pinsDown > 0 && potentialPins.length > 0) {
    const randomIndex = Math.floor(Math.random() * potentialPins.length);
    const pinIndex = potentialPins[randomIndex];

    if (pinData[pinIndex] === 1) {
      pinData[pinIndex] = 0;
      pinsDown--;
    }

    // Remove this pin and its duplicates from potential pins
    potentialPins = potentialPins.filter(p => p !== pinIndex);
  }

  // If we still have pins to knock down, just knock down random standing pins
  while (pinsDown > 0) {
    const standingPins = pinData.map((v, i) => v === 1 ? i : -1).filter(i => i !== -1);
    if (standingPins.length === 0) break;

    const randomPin = standingPins[Math.floor(Math.random() * standingPins.length)];
    pinData[randomPin] = 0;
    pinsDown--;
  }

  const knockedDownPositions = [];

  // Update the state of knocked down pins and their positions
  pinData.forEach((pin, index) => {
    if (pin === 0) {
      knockedDownPositions.push(PIN_POSITIONS[index]);
    }
  });

  // Update the return statement to include positions of knocked down pins
  return { pinData, knockedDownPositions };
}

// Generate a random frame with realistic pin knockdowns
export function generateRandomFrame(skill, isLastFrame = false) {
  // First roll
  const firstRoll = new Roll(0);
  let remainingPins = 10;

  // For highly skilled players (skill >= 0.8):
  // 40% chance of strike
  // 45% chance of 7-9 pins
  // 15% chance of 3-6 pins
  let pinsDown;
  if (skill >= 0.8) {
    const rand = Math.random();
    if (rand < 0.4) {
      pinsDown = 10;
    } else if (rand < 0.85) {
      pinsDown = 7 + Math.floor(Math.random() * 3);
    } else {
      pinsDown = 3 + Math.floor(Math.random() * 4);
    }
  }
  // For intermediate players (skill >= 0.5):
  // 25% chance of strike
  // 35% chance of 7-9 pins
  // 30% chance of 4-6 pins
  // 10% chance of 0-3 pins
  else if (skill >= 0.5) {
    const rand = Math.random();
    if (rand < 0.25) {
      pinsDown = 10;
    } else if (rand < 0.6) {
      pinsDown = 7 + Math.floor(Math.random() * 3);
    } else if (rand < 0.9) {
      pinsDown = 4 + Math.floor(Math.random() * 3);
    } else {
      pinsDown = Math.floor(Math.random() * 4);
    }
  }
  // For beginners:
  // Random number of pins weighted by skill
  else {
    pinsDown = Math.floor(Math.random() * 11 * (0.3 + skill * 0.7));
  }

  const firstPinData = generatePinConfiguration(pinsDown, skill);
  firstRoll.pinData = firstPinData.pinData;
  remainingPins -= pinsDown;

  // Second roll (if not a strike, or if it's the last frame)
  const rolls = [firstRoll];
  if (remainingPins > 0 || (isLastFrame && pinsDown === 10)) {
    const secondRoll = new Roll(1);

    // Calculate pins down for second roll
    if (remainingPins > 0) {
      // More likely to get remaining pins based on skill
      const probability = 0.3 + skill * 0.7;
      pinsDown = Math.random() < probability ? remainingPins : Math.floor(Math.random() * remainingPins);
    } else {
      // Fresh rack after a strike in the 10th frame
      pinsDown = Math.floor(Math.random() * 11 * (0.3 + skill * 0.7));
    }

    const secondPinData = generatePinConfiguration(pinsDown, skill);
    secondRoll.pinData = secondPinData.pinData;
    remainingPins = 10 - pinsDown;
    rolls.push(secondRoll);

    // Third roll in the last frame
    if (isLastFrame && (firstRoll.strike || secondRoll.spare)) {
      const thirdRoll = new Roll(2);
      pinsDown = Math.floor(Math.random() * 11 * (0.3 + skill * 0.7));
      const thirdPinData = generatePinConfiguration(pinsDown, skill);
      thirdRoll.pinData = thirdPinData.pinData;
      rolls.push(thirdRoll);
    }
  }

  return rolls;
}

// List of fixed bowlers with preset skill levels and IDs
const bowlers = [
  { id: 'bowler_alice', name: 'Alice', skill: 0.9, color: 'blue' },      // Pro - The originator
  { id: 'bowler_bob', name: 'Bob', skill: 0.8, color: 'red' },           // Pro - The recipient
  { id: 'bowler_carol', name: 'Carol', skill: 0.6, color: 'green' },     // Intermediate - The third participant
  { id: 'bowler_dave', name: 'Dave', skill: 0.4, color: 'orange' },      // Beginner - The fourth participant
  { id: 'bowler_eve', name: 'Eve', skill: 0.2, color: 'purple' },        // Beginner - The eavesdropper
  { id: 'bowler_mallory', name: 'Mallory', skill: 0.0, color: 'brown' }  // Novice - The malicious attacker
];

// List of fictional bowling alleys
const bowlingAlleys = [
  'Sunset Lanes',
  'Kingpin Plaza',
  'Lucky Strike Bowl',
  'Cosmic Bowling Center',
  'The 7-10 Split',
  'Perfect Game Alley',
  'Thunderbolt Lanes',
  'Galaxy Bowl',
  'Retro Roll',
  'Strike Zone',
  'Pinsetters Paradise',
  'Gutter & Glory'
];

// Generate a random game with realistic scores
export function generateRandomGame(game, store) {
  if (!game || !store) return;

  // Generate frames for each scorecard
  game._scorecards.forEach(scorecard => {
    for (let frameNum = 1; frameNum <= 10; frameNum++) {
      const bowler = store.getBowlerById(scorecard._bowlerId);
      if (!bowler) continue;

      const frame = generateRandomFrame(bowler.skill || 0.5, frameNum === 10);
      frame.forEach((roll, index) => {
        scorecard.setScore(frameNum, index + 1, countPinsDown(roll.pinData), roll.pinData);
      });
    }
  });
}

// Generate a sample game with the store's current bowlers
export function generateSampleGame(store) {
  if (!store.currentGame) return;
  generateRandomGame(store.currentGame, store);
}
