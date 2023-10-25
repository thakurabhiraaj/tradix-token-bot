const axios = require("axios");
let data =
  '{"where":{},"_method":"GET","_ApplicationId":"HO0zdYafPpzyqsHoc8TzHvY6BWVIcJqntInBq4Gw","_ClientVersion":"js1.12.0","_InstallationId":"ed6a8e09-cc7c-4218-9858-0860404cf9f9"}';

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://ggw0qmefesej.grandmoralis.com:2053/server/classes/Scams",
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

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
