import { defineStore } from 'pinia';
import Bowler from '../models/Bowler';
import Game from '../models/Game';
import Series from '../models/Series';
import ScoreCard from '../models/ScoreCard';
import Frame from '../models/Frame';
import Roll from '../models/Roll';
import { generateRandomFrame, generateRandomGame } from '../utils/gameGenerator';

export const useBowlingStore = defineStore('bowling', {
  state: () => ({
    bowlers: [],
    series: [],
    currentSeries: null,
    currentGame: null
  }),

  getters: {
    getBowlerById: state => id => {
      return state.bowlers.find(bowler => bowler._id === id);
    },
    getSeriesById: state => id => {
      return state.series.find(series => series._id === id);
    },
    getCurrentSeries: state => {
      return state.currentSeries;
    },
    getCurrentGame: state => {
      return state.currentGame;
    },
    getBowlersInCurrentSeries: state => {
      if (!state.currentSeries) return [];
      return state.currentSeries._bowlerIds.map(id => state.getBowlerById(id));
    },
    getBowlerSeriesCount: state => bowlerId => {
      return state.series.filter(series => series._bowlerIds.includes(bowlerId)).length;
    },
    getBowlerGamesCount: state => bowlerId => {
      return state.series.reduce((count, series) => 
        count + series.games.filter(game => 
          game._scorecards.some(sc => sc._bowlerId === bowlerId)
        ).length, 0);
    },
    getBowlerAverageScore: state => bowlerId => {
      const allGames = state.series.flatMap(series => 
        series.games.filter(game => 
          game._scorecards.some(sc => sc._bowlerId === bowlerId)
        )
      ).sort((a, b) => new Date(b._timestamp) - new Date(a._timestamp));

      const recentGames = allGames.slice(0, 12);
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
      bowler.color = {
        'bowler_alice': 'blue',     // Pro
        'bowler_bob': 'red',       // Pro
        'bowler_carol': 'green',   // Intermediate
        'bowler_dave': 'orange',   // Beginner
        'bowler_eve': 'purple',    // Beginner
        'bowler_mallory': 'brown'  // Novice
      }[id] || ['red', 'blue', 'green', 'orange', 'purple', 'cyan', 'pink', 'teal'][this.bowlers.length % 8];
      bowler.skill = {
        'bowler_alice': 0.9,    // Pro
        'bowler_bob': 0.8,      // Pro
        'bowler_carol': 0.6,    // Intermediate
        'bowler_dave': 0.4,     // Beginner
        'bowler_eve': 0.2,      // Beginner
        'bowler_mallory': 0.0   // Novice
      }[id] || 0.5;  // Default to medium skill (0.5) for new bowlers
      this.bowlers.push(bowler);
      this.saveState();
      return bowler;
    },

    removeBowler(id) {
      const index = this.bowlers.findIndex(bowler => bowler._id === id);
      if (~index) {
        // Remove bowler from all series
        this.series.forEach(series => {
          series.removeBowler(id);
          series.games.forEach(game => {
            game.removeScorecard(id);
          });
        });

        // Remove bowler from current series/game if exists
        if (this.currentSeries) {
          this.currentSeries.removeBowler(id);
          if (this.currentGame) {
            this.currentGame.removeScorecard(id);
          }
        }

        this.bowlers.splice(index, 1);
        this.saveState();
      }
    },

    startNewSeries(bowlerIds, name, location, generateScores = false, timestamp = null) {
      const series = new Series(name, location, timestamp);
      // Handle both bowler objects and IDs
      series._bowlerIds = bowlerIds.map(bowler => 
        typeof bowler === 'string' ? bowler : 
        bowler.value ? bowler.value._id : 
        bowler._id
      );
      this.series.push(series);
      this.currentSeries = series;
      
      // Start the first game with or without generating scores
      this.startNewGame(generateScores);
      
      this.saveState();
      return series;
    },

    startNewGame(generateScores = false) {
      if (!this.currentSeries) return null;

      const game = new Game(this.currentSeries._id);
      
      // Create scorecards for each bowler
      this.currentSeries._bowlerIds.forEach(bowlerId => {
        const bowler = this.getBowlerById(bowlerId);
        if (bowler) {
          const scorecard = new ScoreCard({
            id: bowlerId,
            name: bowler._name,
            color: bowler._color || 'primary'
          });
          game._scorecards.push(scorecard);
        }
      });

      this.currentSeries._games.push(game);
      this.currentGame = game;

      if (generateScores) {
        generateRandomGame(game, this);
      }

      return game;
    },

    endCurrentGame() {
      if (this.currentGame) {
        this.currentGame = null;
        this.saveState();
      }
    },

    endCurrentSeries() {
      if (this.currentSeries) {
        this.currentGame = null;
        this.currentSeries = null;
        this.saveState();
      }
    },

    addRoll(bowlerId, pins) {
      if (this.currentGame) {
        const scorecard = this.currentGame._scorecards.find(sc => sc._bowlerId === bowlerId);
        if (scorecard) {
          scorecard.addRoll(pins);
          this.saveState();
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
              _color: bowlerData._color || 'red',
              _skill: bowlerData._skill || 0.5
            });
          });

          // Restore series
          this.series = state.series.map(seriesData => {
            const series = new Series(seriesData._name, seriesData._location, new Date(seriesData._timestamp));
            series._id = seriesData._id;
            series._bowlerIds = seriesData._bowlerIds || [];
            series._games = seriesData._games.map(gameData => {
              const game = new Game();
              game._id = gameData._id;
              game._seriesId = gameData._seriesId;
              game._timestamp = gameData._timestamp;
              game._scorecards = gameData._scorecards.map(cardData => {
                const bowler = this.getBowlerById(cardData._bowlerId);
                if (!bowler) return null;

                const card = new ScoreCard(bowler);
                card._scores = cardData._scores || {};
                if (cardData._frames) {
                  card._frames = cardData._frames.map(frameData => {
                    const frame = new Frame(frameData._frameNumber, frameData._rolls.length);
                    frame._frameScore = frameData._frameScore;
                    frame._rolls = frameData._rolls.map(rollData => {
                      const roll = new Roll(rollData._rollNumber);
                      roll._pins = rollData._pins;
                      roll._strike = rollData._strike;
                      roll._spare = rollData._spare;
                      roll._split = rollData._split;
                      roll._pinData = rollData._pinData;
                      roll._foul = rollData._foul;
                      return roll;
                    });
                    return frame;
                  });
                }
                return card;
              }).filter(Boolean);
              return game;
            });
            return series;
          });

          // Restore current series/game
          if (state.currentSeries) {
            this.currentSeries = this.series.find(s => s._id === state.currentSeries._id) || null;
            if (this.currentSeries) {
              this.currentGame = this.currentSeries.games[this.currentSeries.games.length - 1] || null;
            }
          }
        }
      } catch (error) {
        console.error('Error loading state:', error);
        this.bowlers = [];
        this.series = [];
        this.currentSeries = null;
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
            _color: bowler._color,
            _skill: bowler._skill
          })),
          series: this.series.map(series => ({
            _id: series._id,
            _name: series._name,
            _location: series._location,
            _bowlerIds: series._bowlerIds,
            _timestamp: series._timestamp,
            _games: series._games.map(game => ({
              _id: game._id,
              _seriesId: game._seriesId,
              _timestamp: game._timestamp,
              _scorecards: game._scorecards.map(card => ({
                _bowlerId: card._bowlerId,
                _bowlerName: card._bowlerName,
                _bowlerColor: card._bowlerColor,
                _scores: card._scores,
                _frames: card._frames.map(frame => ({
                  _frameNumber: frame._frameNumber,
                  _frameScore: frame._frameScore,
                  _rolls: frame._rolls.map(roll => ({
                    _rollNumber: roll._rollNumber,
                    _pins: roll._pins,
                    _strike: roll._strike,
                    _spare: roll._spare,
                    _split: roll._split,
                    _pinData: roll._pinData,
                    _foul: roll._foul
                  }))
                }))
              }))
            }))
          })),
          currentSeries: this.currentSeries ? {
            _id: this.currentSeries._id
          } : null,
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
      this.series = [];
      this.currentSeries = null;
      this.currentGame = null;
      this.saveState();
    },

    setCurrentSeries(seriesId) {
      const series = this.getSeriesById(seriesId);
      if (series) {
        this.currentSeries = series;
        this.currentGame = series.games[series.games.length - 1] || null;
        this.saveState();
      }
    }
  }
});
