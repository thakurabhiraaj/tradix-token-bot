const axios = require("axios");
const moment = require("moment");
const connection = require("../config/db.config");
const schedule = require("node-schedule");

let data =
  '{"where":{"show":true},"limit":10,"order":"-created_at","_method":"GET","_ApplicationId":"HO0zdYafPpzyqsHoc8TzHvY6BWVIcJqntInBq4Gw","_ClientVersion":"js1.12.0","_InstallationId":"ed6a8e09-cc7c-4218-9858-0860404cf9f9"}  ';

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://ggw0qmefesej.grandmoralis.com:2053/server/classes/CexListings",
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

const job = schedule.scheduleJob("*/2 * * * *", function () {
  connection.execute(
    `SELECT * FROM cexListings`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: pancakeswap.cron.js:87 ~ .then ~ err:", err);
        return;
      } else {
        const objectIdArr = results.map((e) => {
          return e.objectId;
        });
        axios
          .request(config)
          .then((response) => {
            response.data.results.forEach((element) => {
              if (!objectIdArr.includes(element.objectId)) {
                connection.query(
                  `INSERT INTO cexListings(objectId, created_at, CodeCoinLinks, market_url, code, exchange, alert_id, CodeCoinIcon, CodeCoinName, coinIcon, name, checkCG, showStatus, createdAt, updatedAt, notifiedStatus) VALUES( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    element.objectId,
                    moment(element.created_at.iso).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    JSON.stringify(element.CodeCoinLinks),
                    element.market_url,
                    element.code,
                    element.exchange,
                    element.alert_id,
                    element.CodeCoinIcon,
                    element.CodeCoinName,
                    element.coinIcon,
                    element.name,
                    element.checkCG,
                    element.show,
                    moment(element.createdAt).format("YYYY-MM-DD HH:mm:ss"),
                    moment(element.updatedAt.iso).format("YYYY-MM-DD HH:mm:ss"),
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
