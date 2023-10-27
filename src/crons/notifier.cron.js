const connection = require("../config/db.config");

const message = require("../utils/createMessage");

const { Bot } = require("grammy");
const { hydrateReply, parseMode } = require("@grammyjs/parse-mode");

const schedule = require("node-schedule");
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot("6761717001:AAHvOaSbZuoVz6OG78iWscPXLiKQIr50Qi8"); // <-- put your bot token between the ""

// Install the plugin.
bot.use(hydrateReply);

// Sets default parse_mode for ctx.reply
bot.api.config.use(parseMode("MarkdownV2"));

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome. Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message."));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.

class FunctionQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(fn) {
    this.queue.push(fn);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length > 0) {
      const fn = this.queue.shift();
      this.isProcessing = true;
      fn();
      setTimeout(() => {
        this.processQueue();
      }, 5000);
    } else {
      this.isProcessing = false;
    }
  }
}

function sendChannelMessage(messsage) {
  try {
    bot.api.sendMessage("@tradixsnipe", messsage);
  } catch (err) {
    console.error(err);
  }
}

bot.start();

// sendChannelMessage("Hello, world!");
const functionQueue = new FunctionQueue();

const job = schedule.scheduleJob("*/3 * * * *", function () {
  connection.query(
    `SELECT * FROM cexlistings WHERE notifiedStatus = false`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: notifier.cron.js:37 ~ err:", err);
        return;
      } else {
        // console.log(results); // results contains rows returned by server
        results.forEach((element) => {
          const notificationMsg = message("cexlisting", element);
          // console.log(notificationMsg)
          connection.query(
            `UPDATE cexlistings SET notifiedStatus = ? WHERE objectId = ?;`,
            [true, element.objectId],
            function async(err, results, fields) {
              if (err) {
                console.log("🚀 ~ file: notifier.cron.js:46 ~ err:", err);
                return;
              } else {
                console.log(results); // results contains rows returned by server
                functionQueue.enqueue(() =>
                  sendChannelMessage(notificationMsg)
                );
              }
            }
          );
        });
      }
    }
  );

  connection.query(
    `SELECT * FROM pancakeswap WHERE notifiedStatus = false`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: notifier.cron.js:37 ~ err:", err);
        return;
      } else {
        // console.log(results); // results contains rows returned by server
        results.forEach((element) => {
          const notificationMsg = message("pancakeswap", element);
          connection.query(
            `UPDATE pancakeswap SET notifiedStatus = ? WHERE address = ?;`,
            [true, element.address],
            function async(err, results, fields) {
              if (err) {
                console.log("🚀 ~ file: notifier.cron.js:46 ~ err:", err);
                return;
              } else {
                console.log(results); // results contains rows returned by server
                functionQueue.enqueue(() =>
                  sendChannelMessage(notificationMsg)
                );
              }
            }
          );
        });
      }
    }
  );

  connection.query(
    `SELECT * FROM uniswapv3 WHERE notifiedStatus = false`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: notifier.cron.js:37 ~ err:", err);
        return;
      } else {
        // console.log(results); // results contains rows returned by server
        results.forEach((element) => {
          const notificationMsg = message("uniswapv3", element);
          // console.log(notificationMsg)
          connection.query(
            `UPDATE uniswapv3 SET notifiedStatus = ? WHERE id = ?;`,
            [true, element.id],
            function async(err, results, fields) {
              if (err) {
                console.log("🚀 ~ file: notifier.cron.js:46 ~ err:", err);
                return;
              } else {
                console.log(results); // results contains rows returned by server
                functionQueue.enqueue(() =>
                  sendChannelMessage(notificationMsg)
                );
              }
            }
          );
        });
      }
    }
  );

  connection.query(
    `SELECT * FROM uniswapv2 WHERE notifiedStatus = false`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: notifier.cron.js:37 ~ err:", err);
        return;
      } else {
        // console.log(results); // results contains rows returned by server
        results.forEach((element) => {
          const notificationMsg = message("uniswapv2", element);
          // console.log(notificationMsg)
          connection.query(
            `UPDATE uniswapv2 SET notifiedStatus = ? WHERE tokenId = ?;`,
            [true, element.tokenId],
            function async(err, results, fields) {
              if (err) {
                console.log("🚀 ~ file: notifier.cron.js:46 ~ err:", err);
                return;
              } else {
                console.log(results); // results contains rows returned by server
                functionQueue.enqueue(() =>
                  sendChannelMessage(notificationMsg)
                );
              }
            }
          );
        });
      }
    }
  );

  connection.query(
    `SELECT * FROM sushiswap WHERE notifiedStatus = false`,
    function (err, results, fields) {
      if (err) {
        console.log("🚀 ~ file: notifier.cron.js:37 ~ err:", err);
        return;
      } else {
        // console.log(results); // results contains rows returned by server
        results.forEach((element) => {
          const notificationMsg = message("sushiswap", element);
          // console.log(notificationMsg)
          connection.query(
            `UPDATE sushiswap SET notifiedStatus = ? WHERE tokenId = ?;`,
            [true, element.tokenId],
            function async(err, results, fields) {
              if (err) {
                console.log("🚀 ~ file: notifier.cron.js:46 ~ err:", err);
                return;
              } else {
                console.log(results); // results contains rows returned by server
                functionQueue.enqueue(() =>
                  sendChannelMessage(notificationMsg)
                );
              }
            }
          );
        });
      }
    }
  );
});

module.exports = job;
