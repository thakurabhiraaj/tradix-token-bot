const axios = require("axios");
const moment = require("moment");
const connection = require("../config/db.config");
const schedule = require("node-schedule");

let data = JSON.stringify({
  operationName: "GetNewPairs",
  variables: {
    limit: 200,
    skip: 0,
    start: Math.floor(Date.now() / 1000),
  },
  query:
    'query GetNewPairs($limit: Int!, $skip: Int!, $start: Int!) {\n  pairs(\n    first: $limit\n    skip: $skip\n    orderBy: createdAtTimestamp\n    orderDirection: desc\n    where: {createdAtTimestamp_lt: $start}\n  ) {\n    token0 {\n      name\n      symbol\n      id\n      totalSupply\n      totalLiquidity\n      tradeVolume\n      tradeVolumeUSD\n      derivedETH\n      untrackedVolumeUSD\n      txCount\n      __typename\n    }\n    token1 {\n      name\n      symbol\n      id\n      totalSupply\n      totalLiquidity\n      tradeVolume\n      tradeVolumeUSD\n      derivedETH\n      untrackedVolumeUSD\n      txCount\n      __typename\n    }\n    createdAtTimestamp\n    reserveETH\n    reserveUSD\n    volumeUSD\n    id\n    __typename\n  }\n  bundles(where: {id: "1"}) {\n    ethPrice\n    __typename\n  }\n}',
});

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.thegraph.com/subgraphs/name/zippoxer/sushiswap-subgraph-fork",
  headers: {
    "sec-ch-ua":
      '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    accept: "*/*",
    "content-type": "application/json",
    "sec-ch-ua-mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "sec-ch-ua-platform": '"Windows"',
  },
  data: data,
};

const job = schedule.scheduleJob("*/7 * * * *", function () {
  connection.execute(
    `SELECT * FROM sushiswap`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: pancakeswap.cron.js:87 ~ .then ~ err:", err);
        return;
      } else {
        const tokenIdArr = results.map((e) => {
          return e.tokenId;
        });
        axios
          .request(config)
          .then((response) => {
            const symbolsToExclude = [
              "WETH",
              "USDC",
              "USDT",
              "SLP",
              "DAI",
              "BTCBR",
              "SUSHI",
              "ETHMNY",
              "BLKD",
              "PRIMATE",
              "WBTC",
              "LUA",
              "UNI",
              "BTCTRADE",
              "COMP",
              "BURN",
              "APE",
              "LRC",
              "BTC",
              "ASTRAFER",
            ];
            response.data.data.pairs.forEach((element) => {
              if (symbolsToExclude.includes(element.token0.symbol)) {
                if (!tokenIdArr.includes(element.token1.id)) {
                  connection.query(
                    `INSERT INTO sushiswap (tokenId, name, symbol, totalSupply, totalLiquidity, tradeVolume, tradeVolumeUSD, derivedETH, untrackedVolumeUSD, txCount, createdAtTimestamp, reserveETH, reserveUSD, pairId, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      element.token1.id,
                      element.token1.name,
                      element.token1.symbol,
                      element.token1.totalSupply,
                      element.token1.totalLiquidity,
                      element.token1.tradeVolume,
                      element.token1.tradeVolumeUSD,
                      element.token1.derivedETH,
                      element.token1.untrackedVolumeUSD,
                      element.token1.txCount,
                      element.createdAtTimestamp,
                      element.reserveETH,
                      element.reserveUSD,
                      element.id,
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
                    `INSERT INTO sushiswap (tokenId, name, symbol, totalSupply, totalLiquidity, tradeVolume, tradeVolumeUSD, derivedETH, untrackedVolumeUSD, txCount, createdAtTimestamp, reserveETH, reserveUSD, pairId, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      element.token0.id,
                      element.token0.name,
                      element.token0.symbol,
                      element.token0.totalSupply,
                      element.token0.totalLiquidity,
                      element.token0.tradeVolume,
                      element.token0.tradeVolumeUSD,
                      element.token0.derivedETH,
                      element.token0.untrackedVolumeUSD,
                      element.token0.txCount,
                      element.createdAtTimestamp,
                      element.reserveETH,
                      element.reserveUSD,
                      element.id,
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
