const axios = require("axios");
const moment = require("moment");
const connection = require("../config/db.config");
const schedule = require("node-schedule");

let data = JSON.stringify({
  operationName: "GetNewPairs",
  variables: {
    limit: 100,
  },
  query:
    'query GetNewPairs($limit: Int! = 300) {\n  pools(first: $limit, orderBy: createdAtTimestamp, orderDirection: desc) {\n    token0 {\n      name\n      symbol\n      id\n      totalSupply\n      totalValueLocked\n      totalValueLockedUSD\n      volume\n      volumeUSD\n      derivedETH\n      untrackedVolumeUSD\n      txCount\n      totalValueLockedUSD\n      whitelistPools(orderBy: txCount, orderDirection: desc, first: 1) {\n        id\n        txCount\n        token0 {\n          symbol\n          __typename\n        }\n        token1 {\n          symbol\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    token1 {\n      name\n      symbol\n      id\n      totalSupply\n      totalValueLocked\n      totalValueLockedUSD\n      volume\n      volumeUSD\n      derivedETH\n      untrackedVolumeUSD\n      txCount\n      totalValueLockedUSD\n      whitelistPools(orderBy: txCount, orderDirection: desc, first: 1) {\n        id\n        txCount\n        token0 {\n          symbol\n          __typename\n        }\n        token1 {\n          symbol\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    id\n    createdAtTimestamp\n    volumeUSD\n    liquidity\n    token0Price\n    token1Price\n    __typename\n  }\n  bundles(where: {id: "1"}) {\n    ethPriceUSD\n    __typename\n  }\n}',
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  headers: {
    "sec-ch-ua":
      '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    accept: "*/*",
    "content-type": "application/json",
    "sec-ch-ua-mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "sec-ch-ua-platform": '"Windows"',
  },
  data: data,
};

const job = schedule.scheduleJob("*/5 * * * *", function () {
  connection.execute(
    `SELECT * FROM uniswapv3`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: pancakeswap.cron.js:87 ~ .then ~ err:", err);
        return;
      } else {
        const tokenIdArr = results.map((e) => {
          return e.id;
        });
        axios
          .request(config)
          .then((response) => {
            const symbolsToExclude = [
              "WETH",
              "USDC",
              "USDT",
              "PEPE",
              "DAI",
              "HEX",
              "ePhiat",
              "XEN",
              "TURBO",
              "FDX",
              "PSYOP",
              "PSYOP",
              "WPLS",
              "WIS",
              "GLM",
              "xF9",
              "PLSX",
              "AMONG",
              "PEPEXL",
              "BOB"
            ];
            response.data.data.pools.forEach((element) => {
              if (symbolsToExclude.includes(element.token0.symbol)) {
                if (!tokenIdArr.includes(element.token1.id)) {
                  connection.query(
                    `INSERT INTO uniswapv3 (id, name, symbol, totalSupply, totalValueLocked, totalValueLockedUSD, volume, volumeUSD, derivedETH, untrackedVolumeUSD, txCount, pairId, createdAtTimestamp, liquidity, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      element.token1.id,
                      element.token1.name,
                      element.token1.symbol,
                      element.token1.totalSupply,
                      element.token1.totalValueLocked,
                      element.token1.totalValueLockedUSD,
                      element.token1.volume,
                      element.token1.volumeUSD,
                      element.token1.derivedETH,
                      element.token1.untrackedVolumeUSD,
                      element.token1.txCount,
                      element.id,
                      element.createdAtTimestamp,
                      element.liquidity,
                      false,
                    ],
                    function (err, results, fields) {
                      if (err) {
                        console.log(
                          "🚀 ~ file: pancakeswap.cron.js:87 ~ .then ~ err:",
                          err
                        );
                        return;
                      } else {
                        console.log(results); // results contains rows returned by server
                      }
                    }
                  );
                }
              } else {
                if (!tokenIdArr.includes(element.token0.id)) {
                  connection.query(
                    `INSERT INTO uniswapv3 (id, name, symbol, totalSupply, totalValueLocked, totalValueLockedUSD, volume, volumeUSD, derivedETH, untrackedVolumeUSD, txCount, pairId, createdAtTimestamp, liquidity, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      element.token0.id,
                      element.token0.name,
                      element.token0.symbol,
                      element.token0.totalSupply,
                      element.token0.totalValueLocked,
                      element.token0.totalValueLockedUSD,
                      element.token0.volume,
                      element.token0.volumeUSD,
                      element.token0.derivedETH,
                      element.token0.untrackedVolumeUSD,
                      element.token0.txCount,
                      element.id,
                      element.createdAtTimestamp,
                      element.liquidity,
                      false,
                    ],
                    function (err, results, fields) {
                      if (err) {
                        console.log(
                          "🚀 ~ file: pancakeswap.cron.js:87 ~ .then ~ err:",
                          err
                        );
                        return;
                      } else {
                        console.log(results); // results contains rows returned by server
                      }
                    }
                  );
                }
              }
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  );
});
module.exports = job;
