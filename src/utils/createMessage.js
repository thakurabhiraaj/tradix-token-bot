// import { md } from 'telegram-md'
const { markdownv2: format } = require("telegram-format");

const disclaimer = format.escape(`Disclaimer: Our Telegram bot provides token information for reference only. Please be aware that these tokens may carry risks, including the possibility of scams. It is essential to conduct thorough research (DYOR - Do Your Own Research) before engaging with any token or investment opportunity. We do not guarantee their legitimacy and cannot be held responsible for any financial losses or damages. Exercise caution and make informed decisions to protect your interests.`)

const message = (type, element) => {
  if (type == "cexlisting") {
    var message = `🔵 CEX Listings 🔵 \\- NEW TOKEN FOUND

Name: ${format.escape(element.name)} \\($${format.escape(element.code)}\\)
Platform: ${element.exchange}

${disclaimer}
`;
  } else if (type == "pancakeswap") {
    message = `🔵 Pancakeswap \\( BINANCE Network \\) 🔵 \\- NEW TOKEN FOUND

Name: ${format.escape(element.name)} \\($${format.escape(element.symbol)}\\)
Platform: pancakeswap
Liquidity \\(USD\\): $${format.escape("" + element.total_liquidity_usd)}

Token Address: \`${element.address}\`

${disclaimer}`;
  } else if (type == "uniswapv3") {
    message = `🔵 uniswapv3 \\( ETHEREUM Network \\) 🔵 \\- NEW TOKEN FOUND

Name: ${format.escape(element.name)} \\($${format.escape(element.symbol)}\\)
Platform: uniswapv3
Liquidity \\(USD\\): $${format.escape("" + element.volumeUSD)}

Token Address: \`${element.id}\`

${disclaimer}`;
  } else if (type == "uniswapv2") {
    message = `🔵 uniswapv2 \\( ETHEREUM Network \\) 🔵 \\- NEW TOKEN FOUND

Name: ${format.escape(element.name)} \\($${format.escape(element.symbol)}\\)
Platform: uniswapv2
Liquidity \\(USD\\): $${format.escape("" + element.tradeVolumeUSD)}

Token Address: \`${element.tokenId}\`

${disclaimer}`;
  } else if (type == "sushiswap") {
    message = `🔵 sushiswap \\( ETHEREUM Network \\) 🔵 \\- NEW TOKEN FOUND

Name: ${format.escape(element.name)} \\($${format.escape(element.symbol)}\\)
Platform: sushiswap
Liquidity \\(USD\\): $${format.escape("" + element.tradeVolumeUSD)}

Token Address: \`${element.tokenId}\`

${disclaimer}`;
  }
  return message;
};
module.exports = message;
