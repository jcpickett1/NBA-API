import axios, { AxiosInstance } from 'axios';
import express from 'express';

const app = express();
const ballerApi: AxiosInstance = axios.create({
  baseURL: 'https://www.balldontlie.io',
  timeout: 1000,
});

app.get('/', function (req: express.Request, res: express.Response) {
  res.send('Welcome to Ballers API!\nCheck README for routes');
});

app.get(
  '/playerSearch/:search',
  function (req: express.Request, res: express.Response) {
    ballerApi
      .get(`/api/v1/players?search=${req.params.search}`)
      .then((response) => {
        res.send(response.data);
      });
  }
);

app.get(
  '/player/:id',
  async function (req: express.Request, res: express.Response) {
    await ballerApi
      .get(`https://www.balldontlie.io/api/v1/players/${req.params.id}`)
      .then(async (nameResponse) => {
        let getSeason = (playerId: number, season: number): Promise<number> =>
          new Promise(async (resolve): Promise<number | void> => {
            return await ballerApi
              .get(
                `/api/v1/season_averages?season=${season}&player_ids[]=${playerId}`
              )
              .then((response) => {
                if (response.data.data[0])
                  resolve(response.data.data[0].games_played);
                else resolve(-1);
              });
          });

        let playerId = req.params.id;
        let seasons: number[] = await Promise.all([
          getSeason(playerId, 2014),
          getSeason(playerId, 2015),
          getSeason(playerId, 2016),
          getSeason(playerId, 2017),
          getSeason(playerId, 2018),
          getSeason(playerId, 2019),
          getSeason(playerId, 2020),
        ]);
        let above50 = 0;
        let below50 = 0;
        let didNotPlay = 0;
        for (const ind in seasons) {
          if (seasons[ind] >= 50) above50++;
          else if (seasons[ind] === -1) didNotPlay++;
          else below50++;
        }

        return res.send({
          player_name: `${nameResponse.data.first_name} ${nameResponse.data.last_name}`,
          games_played: {
            above50,
            below50,
            didNotPlay,
            seasons,
          },
        });
      })
      .catch((err) => {
        switch (err.response.status) {
          case 404:
            return res.status(404).send('No player found with that ID');
            break;
          case 500:
            return res.status(500).send('Player data API failure');
        }
      });
  }
);

app.get(
  '/lebron',
  async function (req: express.Request, res: express.Response) {
    let getSeason = (playerId: number, season: number): Promise<number> =>
      new Promise(async (resolve) => {
        await ballerApi
          .get(
            `/api/v1/season_averages?season=${season}&player_ids[]=${playerId}`
          )
          .then((response) => {
            resolve(response.data.data[0].games_played);
          });
      });

    let seasons: number[] = await Promise.all([
      getSeason(237, 2014),
      getSeason(237, 2015),
      getSeason(237, 2016),
      getSeason(237, 2017),
      getSeason(237, 2018),
      getSeason(237, 2019),
      getSeason(237, 2020),
    ]);
    let above50 = 0;
    let below50 = 0;
    for (const ind in seasons) {
      if (seasons[ind] > 50) above50++;
      else below50++;
    }
    res.send({
      player_name: 'LeBron James',
      games_played: {
        above50,
        below50,
        bySeason: seasons,
      },
    });
  }
);

const port = 3000;
const hostname = 'localhost';
const server = app.listen(port, hostname, function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = { server };
