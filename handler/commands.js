const request = require("request");
const baseUrl = "https://api.vk.com/method/";
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const v = "5.103";

function sendMessage(peer_id, message) {
  let url = baseUrl + "messages.send";
  request(
    {
      url: url,
      method: "POST",
      form: {
        peer_id: peer_id,
        message: message,
        random_id: Math.random(),
        access_token: TOKEN,
        v: v
      }
    },
    function(error, response, body) {
      //console.log(response.toJSON());
    }
  );
}

exports.sendMessage = sendMessage;
