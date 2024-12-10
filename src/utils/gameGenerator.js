import { useBowlingStore } from 'src/stores/bowling-store';

const colors = ['red', 'green', 'blue', 'purple', 'orange', 'teal',
              'pink', 'indigo', 'cyan', 'deep-purple', 'light-blue', 'deep-orange',
              'lime', 'brown', 'amber', 'yellow', 'light-green', 'blue-grey'];

// Pin layout (triangle formation):
//    7 8 9 10
//     4 5 6
//      2 3
//       1

// Pin positions in a normalized 2D space (0-1 range)
const PIN_POSITIONS = [
  { x: 0.5, y: 0.85 },   // Pin 1
  { x: 0.4, y: 0.7 },    // Pin 2
  { x: 0.6, y: 0.7 },    // Pin 3
  { x: 0.3, y: 0.55 },   // Pin 4
  { x: 0.5, y: 0.55 },   // Pin 5
  { x: 0.7, y: 0.55 },   // Pin 6
  { x: 0.2, y: 0.4 },    // Pin 7
  { x: 0.4, y: 0.4 },    // Pin 8
  { x: 0.6, y: 0.4 },    // Pin 9
  { x: 0.8, y: 0.4 }     // Pin 10
];

// Pin adjacency matrix - each pin's index (1-based) maps to array of adjacent pin indices
const PIN_ADJACENCY = {
  1: [2, 3],
  2: [1, 4, 5],
  3: [1, 5, 6],
  4: [2, 7, 8],
  5: [2, 3, 8, 9],
  6: [3, 9, 10],
  7: [4],
  8: [4, 5],
  9: [5, 6],
  10: [6]
};

// Convert 0/1 array to proper pin indices (1-based)
function pinArrayToIndices(pinArray) {
  return pinArray
    .map((value, index) => value === 1 ? index + 1 : null)
    .filter(index => index !== null);
}

function countPinsDown(pinData) {
  // Count pins that are 0 (knocked down)
  return pinData.reduce((count, pin) => count + (pin === 0 ? 1 : 0), 0);
}

function generatePinData(pinsDown, skill) {
  // Keep trying until we get a valid configuration with the correct number of pins down
  let attempts = 0;
  let pinData;

  do {
    pinData = generatePinConfiguration(pinsDown, skill);
    attempts++;
  } while (countPinsDown(pinData.pinData) !== pinsDown && attempts < 10);

  // If we couldn't generate a valid configuration, fall back to a simple one
  if (countPinsDown(pinData.pinData) !== pinsDown) {
    pinData = {
      pinData: Array(10).fill(1),
      knockedDownPositions: []
    };
    for (let i = 0; i < pinsDown; i++) {
      pinData.pinData[i] = 0;
      pinData.knockedDownPositions.push(PIN_POSITIONS[i]);
    }
  }

  return pinData;
}

function calculateDistance(pos1, pos2) {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

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

function isSplit(pinData) {
  // Convert to 1-based indices of standing pins
  const standingPins = pinArrayToIndices(pinData);

  // Basic split requirements:
  // 1. Headpin (pin 1) must be down
  if (pinData[0] === 1) return false;

  // 2. Need at least 2 standing pins
  if (standingPins.length < 2) return false;

  // 3. Total pins down must be between 2 and 8
  const pinsDown = countPinsDown(pinData);
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

function generateRandomFrame(skill, isLastFrame = false) {
  // First roll: weighted by skill level
  let firstRoll;
  if (skill >= 0.8) {  // For highly skilled players (Alice and Brian)
    // Generate numbers 0-10 with heavy bias towards 7-10
    const rand = Math.random();
    if (rand < 0.4) {  // 40% chance of strike
      firstRoll = 10;
    } else if (rand < 0.85) {  // 45% chance of 7-9 pins
      firstRoll = 7 + Math.floor(Math.random() * 3);
    } else {  // 15% chance of 3-6 pins
      firstRoll = 3 + Math.floor(Math.random() * 4);
    }
  } else if (skill >= 0.5) {  // For intermediate players (Charlie)
    const rand = Math.random();
    if (rand < 0.25) {  // 25% chance of strike
      firstRoll = 10;
    } else if (rand < 0.6) {  // 35% chance of 7-9 pins
      firstRoll = 7 + Math.floor(Math.random() * 3);
    } else if (rand < 0.9) {  // 30% chance of 4-6 pins
      firstRoll = 4 + Math.floor(Math.random() * 3);
    } else {  // 10% chance of 0-3 pins
      firstRoll = Math.floor(Math.random() * 4);
    }
  } else {  // For beginners (Diana, Ethan, Fiona)
    // Use original random distribution but weighted by skill
    firstRoll = Math.floor(Math.random() * 11 * (0.3 + skill * 0.7));
  }

  const firstPinData = generatePinData(firstRoll, skill);
  const firstRollSplit = isSplit(firstPinData.pinData);

  if (firstRoll === 10) { // Strike
    if (isLastFrame) {
      // In 10th frame after a strike, get two more rolls
      const secondRoll = Math.floor(Math.random() * 11 * (0.5 + skill * 0.5));
      const secondPinData = generatePinData(secondRoll, skill);
      const secondRollSplit = false;

      const thirdRoll = secondRoll === 10 ?
        Math.floor(Math.random() * 11 * (0.5 + skill * 0.5)) :
        Math.floor(Math.random() * (11 - secondRoll) * (0.5 + skill * 0.5));
      const thirdPinData = generatePinData(thirdRoll, skill);
      const thirdRollSplit = false;

      return {
        rolls: [firstRoll, secondRoll, thirdRoll],
        pinData: [firstPinData, secondPinData, thirdPinData],
        splits: [firstRollSplit, secondRollSplit, thirdRollSplit]
      };
    }
    // For non-10th frames, only return the strike roll
    return {
      rolls: [firstRoll],
      pinData: [firstPinData],
      splits: [firstRollSplit]
    };
  }

  // Second roll: Chance of spare depends on skill and whether it's a split
  const remainingPins = 10 - firstRoll;
  let spareChance;

  if (firstRollSplit) {
    // Splits are much harder to convert, especially for less skilled players
    // Skill^3 makes the effect more pronounced - low skill players rarely convert splits
    spareChance = Math.pow(skill, 3);
  } else {
    // Regular spares are easier but still affected by skill
    // Skill^2 makes it moderately harder for low skill players
    spareChance = Math.pow(skill, 2);
  }

  // Determine if they convert the spare based on skill-adjusted probability
  const convertsSpare = Math.random() < spareChance;
  const secondRoll = convertsSpare ? remainingPins :
    Math.floor(Math.random() * remainingPins * (0.3 + skill * 0.4)); // If they miss, still affected by skill

  // Generate pin data for second roll based on remaining standing pins
  const secondPinData = {
    pinData: firstPinData.pinData.map((pin, index) => {
      if (pin === 0) return 0; // Already knocked down pins stay down
      return generatePinData(secondRoll, skill).pinData[index]; // Only consider still-standing pins
    }),
    knockedDownPositions: []
  };

  secondPinData.knockedDownPositions = secondPinData.pinData.map((pin, index) => {
    if (pin === 0) return PIN_POSITIONS[index];
  }).filter(pos => pos !== undefined);

  const secondRollSplit = false;

  if (isLastFrame && firstRoll + secondRoll === 10) { // Spare in 10th frame
    // Bonus ball after spare - skill affects this too
    const thirdRoll = Math.floor(Math.random() * 11 * (0.5 + skill * 0.5));
    const thirdPinData = generatePinData(thirdRoll, skill);
    const thirdRollSplit = false;

    return {
      rolls: [firstRoll, secondRoll, thirdRoll],
      pinData: [firstPinData, secondPinData, thirdPinData],
      splits: [firstRollSplit, secondRollSplit, thirdRollSplit]
    };
  }

  return {
    rolls: [firstRoll, secondRoll],
    pinData: [firstPinData, secondPinData],
    splits: [firstRollSplit, secondRollSplit]
  };
}

// List of fixed bowlers with preset skill levels and IDs
// - Alice and Bob are our pros (naturally, as they're the most experienced in the protocol)
// - Carol is our intermediate bowler
// - Dave is learning but getting there
// - Eve is still a beginner (too busy eavesdropping to practice)
// - And Mallory is our novice (probably because they spend all their time trying to modify the scorecard!)
const bowlers = [
  { id: 'bowler_alice', name: 'Alice', skill: 0.9 },   // Pro - The originator
  { id: 'bowler_bob', name: 'Bob', skill: 0.8 },       // Pro - The recipient
  { id: 'bowler_carol', name: 'Carol', skill: 0.6 },   // Intermediate - The third participant
  { id: 'bowler_dave', name: 'Dave', skill: 0.4 },     // Beginner - The fourth participant
  { id: 'bowler_eve', name: 'Eve', skill: 0.2 },       // Beginner - The eavesdropper
  { id: 'bowler_mallory', name: 'Mallory', skill: 0.0 } // Novice - The malicious attacker
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

export function generateRandomGame() {
  const store = useBowlingStore();

  // First ensure all our fixed bowlers exist in the store
  bowlers.forEach(bowler => {
    let existingBowler = store.bowlers.find(b => b.id === bowler.id);
    if (!existingBowler) {
      existingBowler = store.addBowler(bowler.name, bowler.id);
      existingBowler.skill = bowler.skill;
    }
  });

  // Generate 2-4 random bowlers
  const numBowlers = Math.floor(Math.random() * 3) + 2;
  const availableColors = [...colors];
  const availableBowlers = [...bowlers];

  const bowlersInGame = [];
  for (let i = 0; i < numBowlers; i++) {
    // Randomly select a bowler and remove them from available bowlers
    const bowlerIndex = Math.floor(Math.random() * availableBowlers.length);
    const selectedBowler = availableBowlers.splice(bowlerIndex, 1)[0];

    // Get the existing bowler from the store
    const bowler = store.getBowlerById(selectedBowler.id);

    // Randomly select a color and remove it from available colors
    const colorIndex = Math.floor(Math.random() * availableColors.length);
    bowler.color = availableColors.splice(colorIndex, 1)[0];

    bowlersInGame.push(bowler);
  }

  // Select a random bowling alley name
  const alleyName = bowlingAlleys[Math.floor(Math.random() * bowlingAlleys.length)];
  const game = store.startNewGame(bowlersInGame.map(b => b.id), alleyName);

  // Generate random scores for each bowler
  game.scorecards.forEach((scoreCard, index) => {
    const skill = bowlersInGame[index].skill; // Use the fixed skill level

    // Generate 10 frames
    for (let frame = 1; frame <= 10; frame++) {
      const frameData = generateRandomFrame(skill, frame === 10);
      frameData.rolls.forEach((pins, rollIndex) => {
        scoreCard.setScore(frame, rollIndex + 1, pins, frameData.pinData[rollIndex].pinData, frameData.splits[rollIndex]);
      });
    }
  });

  store.saveState();
  return game;
}

export function generateSampleGame() {
  return generateRandomGame();
}
