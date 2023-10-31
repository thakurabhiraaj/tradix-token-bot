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
  url: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v2-dev",
  headers: {
    "sec-ch-ua":
      '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
    accept: "*/*",
    "content-type": "application/json",
    "sec-ch-ua-mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "sec-ch-ua-platform": '"Windows"',
    host: "api.thegraph.com",
    Cookie:
      "__cf_bm=vkyyrFXnkBDMopaRr4P4so7_42zSHX9rtdH5aiN_vhE-1698755367-0-Afm4WkEYfDah1X9NyxrKqJvcj5N/0Ty+RG1oLsva/041lS7/LY8YzNELLindoyxOIn68mCPR8QEaYtH4kEn77Dc=",
  },
  data: data,
};

const job = schedule.scheduleJob("*/1 * * * *", function () {
  connection.execute(
    `SELECT * FROM uniswapv2`,
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
            // console.log(response.data.data.pairs[0]);
            const symbolsToExclude = [
              "WETH",
              "PSYOP",
              "PSYOP",
              "Astaghfirullah",
              "COPIUM",
              "Homer Pepe",
              "WAIFU",
              "WAIFU",
              "ASTAGHFIRULLAH",
              "DONNY",
              "MEPE",
              "QDC",
              "WAIFU",
              "PMN",
              "MEMECORP",
              "HOPIUM",
              "PINKMAN",
              "GMI",
              "BRUH",
              "PEPELAND",
            ];
            response.data.data.pairs.forEach((element) => {
              if (symbolsToExclude.includes(element.token0.symbol)) {
                if (!tokenIdArr.includes(element.token1.id)) {
                  connection.query(
                    `INSERT INTO uniswapv2 (tokenId, name, symbol, totalSupply, totalLiquidity, tradeVolume, tradeVolumeUSD, derivedETH, untrackedVolumeUSD, txCount, createdAtTimestamp, reserveETH, reserveUSD, pairId, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                    `INSERT INTO uniswapv2 (tokenId, name, symbol, totalSupply, totalLiquidity, tradeVolume, tradeVolumeUSD, derivedETH, untrackedVolumeUSD, txCount, createdAtTimestamp, reserveETH, reserveUSD, pairId, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
