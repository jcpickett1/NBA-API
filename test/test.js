const assert = require('assert');
const axios = require('axios');

let server = require('../index').server;
const api = axios.create({
  baseURL: 'https://localhost:3000',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});

describe('Baller API', () => {
  after(() => {
    server.close();
  });

  describe('LeBron Endpoint', () => {
    it('should return 6 seasons above 50 games and 1 below', async () => {
      await api.get('/lebron').then((res) => {
        // Lebron played greater than 50 games in 6 seasons
        assert.equal(res.data.games_played.above50, 6);
        // Lebron played fewer than 50 games in 1 season
        assert.equal(res.data.games_played.below50, 1);
      });
    });
  });

  // Using Hamidou Diallo for other tests
  describe('Player Endpoint', () => {
    it('should return correct data for a given ID', async () => {
      await api.get('/player/128').then((res) => {
        // Should return correct name
        assert.equal(res.data.player_name, 'Hamidou Diallo');
        // Should return 3 above 50 seasons
        assert.equal(res.data.games_played.above50, 3);
        // Should return 0 below 50 seasons
        assert.equal(res.data.games_played.below50, 0);
        // Should return 4 did not play seasons
        assert.equal(res.data.games_played.didNotPlay, 4);
      });
    });
  });

  describe('Search Endpoint', () => {
    it('should return a list of players who share a name the specified name', async () => {
      await api.get(`/playerSearch/hamidou`).then((res) => {
        // We expect a player with the name Hamidou and the ID 128
        // There happens to be only one player with this name but for more robust testing
        // this will be designed for the possiblilty of more Hamidous
        let found128 = false;
        for (const ind in res.data.data) {
          if (res.data.data[ind].id === 128) found128 = true;
        }

        // If search worked correctly, we should have found one Hamidou with the player ID 128 (Diallo)
        assert(found128);
      });
    });
  });
});
