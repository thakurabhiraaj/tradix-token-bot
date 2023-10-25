const axios = require("axios");
const connection = require("../config/db.config");
const moment = require("moment");
const schedule = require("node-schedule");

let data =
  '{"where":{"scamLevel":{"$lt":2}},"limit":10,"order":"-block_timestamp","_method":"GET","_ApplicationId":"HO0zdYafPpzyqsHoc8TzHvY6BWVIcJqntInBq4Gw","_ClientVersion":"js1.12.0","_InstallationId":"ed6a8e09-cc7c-4218-9858-0860404cf9f9"}';

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://ggw0qmefesej.grandmoralis.com:2053/server/classes/TokensPancakeswap",
  headers: {
    "sec-ch-ua":
      '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
    "sec-ch-ua-platform": '"Windows"',
    "sec-ch-ua-mobile": "?0",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "Content-Type": "text/plain",
    Accept: "*/*",
  },
  data: data,
};


const job = schedule.scheduleJob("*/9 * * * *", function () {
  connection.execute(
    `SELECT * FROM pancakeswap`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: pancakeswap.cron.js:87 ~ .then ~ err:", err);
        return;
      } else {
        const tokenAddrArr = results.map((e) => {
          return e.address;
        });
        axios
          .request(config)
          .then((response) => {
            response.data.results.forEach((element) => {
              if (!tokenAddrArr.includes(element.address)) {
                connection.query(
                  `INSERT INTO pancakeswap(address, block_timestamp, checks, created_at, decimals, initial_liquidity, initial_market_cap_usd, initial_price_usd, last_token_page_request, links, liquidity_change_percentage_initial, market_cap_usd, name, object_id, price_change_percentage_15m_usd, price_change_percentage_1h_usd, price_change_percentage_24h_usd, price_change_percentage_4h_usd, price_change_percentage_initial, price_usd, price_usd_24h_ago, scam, scam_level, scam_reason, symbol, total_liquidity_usd, total_supply, updated_at, webhook_sent, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    element.address,
                    moment(element.block_timestamp.iso).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    JSON.stringify(element.checks),
                    moment(element.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                    element.decimals,
                    element.initialLiquidity,
                    element.initialMarketCapUsd,
                    element.initialPriceUSD,
                    moment(element.lastTokenPageRequest?.iso).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    JSON.stringify(element.links),
                    element.liquidity_change_percentage_initial,
                    element.marketCapUsd,
                    element.name,
                    element.objectId,
                    element.price_change_percentage_15m_usd,
                    element.price_change_percentage_1h_usd,
                    element.price_change_percentage_24h_usd,
                    element.price_change_percentage_4h_usd,
                    element.price_change_percentage_initial,
                    element.priceUSD,
                    element.priceUsd24hAgo,
                    element.scam,
                    element.scamLevel,
                    JSON.stringify(element.scamReason),
                    element.symbol,
                    element.totalLiquidityUSD,
                    element.totalSupply,
                    moment(element.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
                    element.webhookSent,
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
