const axios = require("axios");
const moment = require("moment");
const connection = require("../config/db.config");
const schedule = require("node-schedule");

let data = JSON.stringify({
  operationName: "GetNewPairs",
  variables: {
    limit: 1000,
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

axios
  .request(config)
  .then((response) => {
    const combinationsCount = {};
    const repeatingSymbols = [];

    response.data.data.pairs.forEach((item) => {
      const token0Symbol = item.token0.symbol;
      const token0Name = item.token0.name;
      const token1Symbol = item.token1.symbol;
      const token1Name = item.token1.name;

      const symbolNameCombination1 = token0Symbol + " - " + token0Name;
      const symbolNameCombination2 = token1Symbol + " - " + token1Name;

      combinationsCount[symbolNameCombination1] =
        (combinationsCount[symbolNameCombination1] || 0) + 1;
      combinationsCount[symbolNameCombination2] =
        (combinationsCount[symbolNameCombination2] || 0) + 1;
    });

    for (const combination in combinationsCount) {
      if (combinationsCount[combination] > 1) {
        repeatingSymbols.push(combination);
      }
    }

    const uniqueRepeatingSymbols = repeatingSymbols.sort(
      (a, b) => combinationsCount[b] - combinationsCount[a]
    );

    console.log(
      "Repeating symbol and name combinations (descending order of occurrence):",
      uniqueRepeatingSymbols
    );
  })
  .catch((error) => {
    console.log(error);
  });
