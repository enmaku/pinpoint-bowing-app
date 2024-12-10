import { defineStore } from 'pinia';
import Bowler from '../models/Bowler';
import Game from '../models/Game';
import ScoreCard from '../models/ScoreCard';

export const useBowlingStore = defineStore('bowling', {
  state: () => ({
    bowlers: [],
    games: [],
    currentGame: null
  }),

  getters: {
    getBowlerById: state => id => {
      return state.bowlers.find(bowler => bowler.id === id);
    },
    getGameById: state => id => {
      return state.games.find(game => game.id === id);
    },
    getCurrentGame: state => {
      return state.currentGame;
    },
    getBowlersInCurrentGame: state => {
      if (!state.currentGame) return [];
      return state.currentGame.bowlerIds.map(id => state.getBowlerById(id));
    },
    getBowlerGamesCount: state => bowlerId => {
      return state.games.filter(game => game._bowlerIds.includes(bowlerId)).length;
    },
    getBowlerAverageScore: state => bowlerId => {
      const bowlerGames = state.games
        .filter(game => game._bowlerIds.includes(bowlerId))
        .sort((a, b) => new Date(b._timestamp) - new Date(a._timestamp));

      const recentGames = bowlerGames.slice(0, 12);
      const scores = recentGames.map(game => {
        const scorecard = game._scorecards.find(sc => sc._bowlerId === bowlerId);
        return scorecard ? scorecard.finalScore : 0;
      });
      const validScores = scores.filter(score => score > 0);
      const totalScore = validScores.reduce((acc, score) => acc + score, 0);
      return validScores.length > 0 ? Number((totalScore / validScores.length).toFixed(2)) : 0;
    }
  },

  actions: {
    addBowler(name, id = null) {
      const bowler = new Bowler(id || `bowler_${Date.now()}`);
      bowler.name = name;
      bowler.color = 'primary';
      bowler.skill = 0.7;
      this.bowlers.push(bowler);
      this.saveState();
      return bowler;
    },

    removeBowler(id) {
      const index = this.bowlers.findIndex(bowler => bowler.id === id);
      if (~index) {
        this.bowlers.splice(index, 1);
        this.saveState();
      }
    },

    startNewGame(bowlerIds, gameName = 'New Game') {
      const game = new Game();
      game.name = gameName;
      bowlerIds.forEach(bowlerId => {
        const bowler = this.getBowlerById(bowlerId);
        if (bowler) {
          game.addBowler(bowler);
        }
      });
      this.games.push(game);
      this.currentGame = game;
      this.saveState();
      return game;
    },

    endCurrentGame() {
      if (this.currentGame) {
        this.currentGame = null;
        this.saveState();
      }
    },

    addRoll(bowlerId, pins) {
      if (this.currentGame) {
        const scoreCard = this.currentGame._scorecards.find(
          card => card._bowlerId === bowlerId
        );
        if (scoreCard) {
          const frame = scoreCard.getCurrentFrame();
          if (frame) {
            scoreCard.setScore(frame.number, frame.getCurrentRoll(), pins);
            this.saveState();
          }
        }
      }
    },

    initializeStore() {
      try {
        const savedState = localStorage.getItem('bowlingState');
        if (savedState) {
          const state = JSON.parse(savedState);

          // Restore bowlers
          this.bowlers = state.bowlers.map(bowlerData => {
            return Object.assign(new Bowler(), {
              _id: bowlerData._id,
              _name: bowlerData._name,
              _games: bowlerData._games || [],
              _color: bowlerData._color || 'red'
            });
          });

          // Restore games
          this.games = state.games.map(gameData => {
            const game = new Game();
            game._id = gameData._id;
            game._name = gameData._name;
            game._bowlerIds = gameData._bowlerIds || [];
            game._timestamp = gameData._timestamp;

            // Only create score cards if they don't exist in saved state
            if (gameData._scorecards && gameData._scorecards.length > 0) {
              game._scorecards = gameData._scorecards.map(cardData => {
                const bowler = this.getBowlerById(cardData._bowlerId);
                if (!bowler) return null;

                const card = new ScoreCard(bowler);
                if (cardData._frames) {
                  cardData._frames.forEach(frameData => {
                    if (frameData.rolls) {
                      frameData.rolls.forEach(rollData => {
                        if (typeof rollData.pins !== 'undefined') {
                          card.setScore(frameData._frameNumber, rollData.rollNumber, rollData.pins);
                        }
                      });
                    }
                  });
                }
                return card;
              }).filter(Boolean);
            } else {
              // Create fresh score cards for each bowler
              game._bowlerIds.forEach(bowlerId => {
                const bowler = this.getBowlerById(bowlerId);
                if (bowler) {
                  game.addBowler(bowler);
                }
              });
            }

            return game;
          });

          // Restore current game
          if (state.currentGame) {
            this.currentGame = this.games.find(g => g._id === state.currentGame._id) || null;
          }
        }
      } catch (error) {
        console.error('Error loading state:', error);
        this.bowlers = [];
        this.games = [];
        this.currentGame = null;
      }
    },

    saveState() {
      try {
        const state = {
          bowlers: this.bowlers.map(bowler => ({
            _id: bowler._id,
            _name: bowler._name,
            _games: bowler._games || [],
            _color: bowler._color
          })),
          games: this.games.map(game => ({
            _id: game._id,
            _name: game._name,
            _bowlerIds: game._bowlerIds,
            _timestamp: game._timestamp,
            _scorecards: game._scorecards.map(card => ({
              _bowlerId: card._bowlerId,
              _bowlerName: card._bowlerName,
              _bowlerColor: card._bowlerColor,
              _frames: card._frames.map(frame => ({
                _frameNumber: frame._frameNumber,
                _frameScore: frame._frameScore,
                rolls: frame._rolls.map(roll => ({
                  rollNumber: roll._rollNumber,
                  pins: roll._pins,
                  strike: roll._strike,
                  spare: roll._spare,
                  split: roll._split
                }))
              }))
            }))
          })),
          currentGame: this.currentGame ? {
            _id: this.currentGame._id
          } : null
        };
        localStorage.setItem('bowlingState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    },

    clearAllData() {
      this.bowlers = [];
      this.games = [];
      this.currentGame = null;
      this.saveState();
    },

    setCurrentGame(gameId) {
      if (!gameId) {
        this.currentGame = null;
        this.saveState();
        return;
      }

      const game = this.games.find(g => g._id === gameId);
      if (game) {
        this.currentGame = game;
        this.saveState();
      }
    }
  }
});
